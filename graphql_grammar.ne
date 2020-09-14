# EBNF grammar based on this doc:
# https://spec.graphql.org/June2018/#sec-Schema

@{%

const moo = require('moo')
let lexer = moo.states({
    root: {
        ws: /[ \t,]+/,
        nl: { match: "\n", lineBreaks: true },
        pound_comment: {
            match: /#[^\n]*/,
            value: s => s.substring(1).trim()
        },
        ml_comment: {
            match: /\"\"\"[\s\S]*?\"\"\"/,
            value: s => s.substring(3, s.length-3).trim()
        },
        kunion: "union",
        kscalar: "scalar",
        kschema: "schema",
        ktype: "type",
        kinterface: "interface",
        kenum: "enum",
        kinput: "input",
        kimplements: "implements",
        kdirective: "directive",
        kon: "on",
        lbrace: { match: "{", push: 'block' },
        at: "@",
        lparen: { match: "(", push: 'block' },
        or: "|",
        and: "&",
        equals: "=",
        type_system_directive_location: [
            'SCHEMA', 'SCALAR', 'OBJECT', 'FIELD_DEFINITION',
            'ARGUMENT_DEFINITION', 'INTERFACE', 'UNION', 'ENUM',
            'ENUM_VALUE', 'INPUT_OBJECT', 'INPUT_FIELD_DEFINITION'
        ],
        executable_directive_location: [
            'QUERY', 'MUTATION', 'SUBSCRIPTION', 'FIELD',
            'FRAGMENT_DEFINITION', 'FRAGMENT_SPREAD', 'INLINE_FRAGMENT'
        ],
        name: {
            match: /[a-zA-Z_][a-zA-Z_0-9]*/,
        }
    },
    block: {
        ws: /[ \t,]+/,
        nl: { match: "\n", lineBreaks: true },
        pound_comment: {
            match: /#[^\n]*/,
            value: s => s.substring(1).trim()
        },
        ml_comment: {
            match: /\"\"\"[\s\S]*?\"\"\"/,
            value: s => s.substring(3, s.length-3).trim()
        },
        string_literal: {
            match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
            value: s => JSON.parse(s)
        },    
        ktrue: "true",
        kfalse: "false",
        name: {
            match: /[a-zA-Z_][a-zA-Z_0-9]*/, type: moo.keywords({
                kquery: "query",
                kmutation: "mutation",
                ksubscription: "subscription",
        })},
        number_literal: {
            match: /[0-9]+(?:\.[0-9]+)?/,
            value: s => JSON.parse(s)
        },
        colon: ":",
        or: "|",
        exclamation: "!",
        at: "@",
        rbrace: { match: '}', pop: 1 },
        lparen: { match: "(", push: 'block' },
        rparen: { match: ")", pop: 1 },
        lbracket: "[",
        rbracket: "]",
        equals: "="
    }
})

%}

@lexer lexer

# https://spec.graphql.org/June2018/#sec-Language.Document
Document -> _ml Definitions {% d => d[1] %}
        
Definitions -> Definition Definitions {% d => d[1].concat([d[0]]) %}
             | Definition {% d => [d[0]] %}

Definition -> TypeSystemDefinition {% d => d[0] %}

TypeSystemDefinition -> TypeDefinition {% d => d[0] %}
                      | SchemaDefinition {% d => d[0] %}
                      | DirectiveDefinition {% d => d[0] %}

DirectiveDefinition -> Description:? %kdirective _ml %at Name ArgumentsDefinition:? %kon _ml DirectiveLocations
                        {%
                            d => {
                                const r = {
                                    "type": "DirectiveDefinition",
                                    "name": d[4]
                                }

                                if(d[0]) r.description = d[0]
                                if(d[5]) r.argumentsDefinition = d[5]
                                if(d[8]) r.on = d[8]

                                return r
                            }
                        %}

DirectiveLocations -> DirectiveLocation %or _ml DirectiveLocations  {% d => [d[0]].concat(d[3]) %}
                    | DirectiveLocation  {% d => [d[0]] %}

DirectiveLocation -> %executable_directive_location _ml     {% d => d[0].value %}
                   | %type_system_directive_location _ml    {% d => d[0].value %}

SchemaDefinition -> %kschema _ml Directives:? %lbrace _ml RootOperationTypeDefinitions %rbrace _ml
                    {%
                        d => {
                            const r = {
                                "type": "SchemaDefinition",
                                "operations": d[5]
                            }

                            if(d[2]) r.directives = d[2]

                            return r
                        }
                    %}

RootOperationTypeDefinitions -> RootOperationTypeDefinition RootOperationTypeDefinitions {% d => [d[0]].concat(d[1]) %}
                              | RootOperationTypeDefinition {% d => [d[0]] %}

RootOperationTypeDefinition -> OperationType %colon _ml NamedType
                               {%
                                    d => {
                                        return {
                                            "operation": d[0],
                                            "type": d[3]
                                        }
                                    }
                               %}

OperationType -> %kquery _ml {% d => d[0].value %}
               | %kmutation _ml {% d => d[0].value %}
               | %ksubscription _ml {% d => d[0].value %}

TypeDefinition -> ScalarTypeDefinition {% d => d[0] %}
                | ObjectTypeDefinition {% d => d[0] %}
                | InterfaceTypeDefinition {% d => d[0] %}
                | UnionTypeDefinition {% d => d[0] %}
                | EnumTypeDefinition {% d => d[0] %}
                | InputObjectTypeDefinition {% d => d[0] %}

ScalarTypeDefinition -> Description:? %kscalar _ml Name Directives:?
                        {%
                            d => {
                                const r = {
                                    "type": "ScalarTypeDefinition",
                                    "name": d[3]
                                }

                                if(d[0]) r.description = d[0]
                                if(d[4]) r.directives = d[4]

                                return r
                            }
                        %}

ObjectTypeDefinition -> Description:? %ktype _ml Name ImplementsInterfaces:? Directives:? FieldsDefinition:?
                         {%
                             d => {
                                 const r = {
                                    "type": "ObjectTypeDefinition",
                                    "name": d[3]
                                 }

                                 if(d[0]) r.description = d[0]
                                 if(d[4]) r.implements = d[4]
                                 if(d[5]) r.directives = d[5]
                                 if(d[6]) r.fields = d[6]

                                 return r;
                             }
                         %}

InterfaceTypeDefinition -> Description:? %kinterface _ml Name Directives:? FieldsDefinition:?
                           {%
                                d => {
                                     const r = {
                                        "type": "InterfaceTypeDefinition",
                                        "name": d[3]
                                     }

                                     if(d[4]) r.directives = d[4]
                                     if(d[5]) r.fields = d[5]

                                     return r;
                                }
                           %}

UnionTypeDefinition -> Description:? %kunion _ml Name Directives:? UnionMemberTypes:?
                       {%
                            d => {
                                const r = {
                                    "type": "UnionTypeDefinition",
                                    "name": d[3]
                                }

                                if(d[0]) r.description = d[0]
                                if(d[4]) r.directives = d[4]
                                if(d[5]) r.members = d[5]

                                return r;
                            }
                       %}

EnumTypeDefinition -> Description:? %kenum _ml Name Directives:? EnumValuesDefinition:?
                      {%
                        d => {
                            const r = {
                                "type": "EnumTypeDefinition",
                                "name": d[3]
                            }

                            if(d[0]) r.description = d[0]
                            if(d[4]) r.directives = d[4]
                            if(d[5]) r.values = d[5]

                            return r
                        }
                      %}

InputObjectTypeDefinition -> Description:? %kinput _ml Name Directives:? InputFieldsDefinition:?
                             {%
                                d => {
                                    const r = {
                                        "type": "InputObjectTypeDefinition",
                                        "name": d[3]
                                    }

                                    if(d[0]) r.description = d[0]
                                    if(d[4]) r.directives = d[4]
                                    if(d[5]) r.fields = d[5]

                                    return r
                                }
                             %}

InputFieldsDefinition -> %lbrace _ml InputValueDefinition:? %rbrace _ml {% d => d[2] %}

EnumValuesDefinition -> %lbrace _ml EnumValueDefinitions %rbrace _ml {% d => d[2] %}

EnumValueDefinitions -> EnumValueDefinition EnumValueDefinitions {% d => [d[0]].concat(d[1]) %}
                      | EnumValueDefinition {% d => d[0] %}

EnumValueDefinition -> Description:? EnumValue Directives:?
                        {%
                            d => {
                                const r = {
                                    "value": d[1]
                                }

                                if(d[0]) r.description = d[0]
                                if(d[2]) r.directives = d[2]

                                return r
                            }
                        %}

UnionMemberTypes -> %equals _ml ListOfMemberTypes {% d => d[2] %}

ListOfMemberTypes -> NamedType %or _ml ListOfMemberTypes {% d => [d[0]].concat(d[3]) %}
                   | NamedType {% d => [d[0]] %}

NamedType -> Name {% d => d[0] %}

EnumValue -> Name {% d => d[0] %}

Name -> %name _ml {% d => d[0].value %}

ImplementsInterfaces -> %kimplements _ml Interfaces {% d => d[2] %}

Interfaces -> Name %and _ml Interfaces {% d => [d[0]].concat(d[3]) %}
            | Name {% d => [d[0]] %}

FieldsDefinition -> %lbrace _ml Fields:? %rbrace _ml {% d => d[2] %}

Fields -> Field Fields {% d => [d[0]].concat(d[1]) %}
        | Field {% d => [d[0]] %}

Field -> Description:? %name _ml ArgumentsDefinition:? %colon _ml Type Directives:?
        {%
            d => {
                const r = {
                    "name": d[1].text,
                    "type": d[6]
                };
                if(d[0]) r.description = d[0]
                if(d[3]) r.argumentsDefinition = d[3]
                if(d[7]) r.directives = d[7]

                return r;
            }
        %}

Type -> Name Mandatory:?
        {%
            d => {
                return {
                    "name": d[0],
                    "nullable": d[1] ? false : true
                }
            }
        %}
      | %lbracket _ml Type %rbracket _ml Mandatory:?
        {%
            d => {
                return {
                    "listOf": d[2],
                    "nullable": d[5] ? false : true
                }
            }
        %}

Mandatory -> %exclamation _ml

Directives -> Directive Directives {% d => [d[0]].concat(d[1]) %}
            | Directive {% d => [d[0]] %}

Directive -> %at %name _ml Arguments:?
             {%
                d => {
                    const r = {
                        "name": d[1].value
                    };
                    if(d[3]) r.arguments = d[3];
                    return r;
                }
             %}

Arguments -> %lparen _ml ListOfArguments:? %rparen _ml {% d => d[2] ? d[2] : null %}

ListOfArguments -> Argument ListOfArguments {% d => [d[0]].concat(d[1]) %}
                   | Argument {% d => [d[0]] %}

Argument -> %name _ml %colon _ml Value _ml
            {%
                d => {
                    return {
                        "name": d[0].value,
                        "value": d[4]
                    }
                }
            %}

ArgumentsDefinition -> %lparen _ml InputValueDefinition:? %rparen _ml {% d => d[2] ? d[2] : null %}

InputValueDefinition -> ArgumentDefinition InputValueDefinition {% d => [d[0]].concat(d[1]) %}
                        | ArgumentDefinition {% d => [d[0]] %}

ArgumentDefinition -> Description:? %name _ml %colon _ml Type DefaultValue:? Directives:?
                       {%
                            d => {
                                const r = {
                                    "name": d[1].value,
                                    "type": d[5]
                                }
                                if(d[0]) r.description = d[0]
                                if(d[6]) r.defaultValue = d[6]
                                if(d[7]) r.directives = d[7]
                                return r
                            }
                       %}

DefaultValue -> %equals _ml Value _ml {% d => d[2] %}

Value -> %number_literal {% d => d[0].value %}
       | %string_literal {% d => d[0].value %}
       | %ktrue {% d => true %}
       | %kfalse {% d => false %}

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> %ws
    |  "\n"

__ -> %ws:+

_ -> %ws:*

Description -> comment Description {% d => d[0] + '\n' + d[1] %}
             | comment _ml {% d => d[0] %}

comment -> %pound_comment {% d => d[0].value %}
         | %ml_comment {%  d => d[0].value %}
         | %string_literal {% d => d[0].value %}

