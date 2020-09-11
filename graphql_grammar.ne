# EBNF grammar based on this doc:
# https://spec.graphql.org/June2018/#sec-Schema

@{%

const moo = require('moo')
let lexer = moo.compile({
    ws: /[ \t,]+/,
    nl: { match: "\n", lineBreaks: true },
    pound_comment: {
        match: /#[^\n]*/,
    },
    ml_comment: {
        match: /\"\"\"[\s\S]*?\"\"\"/,
        value: s => s.substring(3, s.length-3).trim()
    },
    string_literal: {
        match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
        value: s => JSON.parse(s)
    },    
    ktype: "type",
    kimplements: "implements",
    ktrue: "true",
    kfalse: "false",
    name: {
        match: /[a-zA-Z_][a-zA-Z_0-9]*/
    },
    number_literal: {
        match: /[0-9]+(?:\.[0-9]+)?/,
        value: s => JSON.parse(s)
    },
    lbrace: "{",
    rbrace: "}",
    colon: ":",
    and: "&",
    exclamation: "!",
    at: "@",
    lparen: "(",
    rparen: ")",
    equals: "="
})

%}

@lexer lexer

main -> _ml Definitions _ml {% d => d[1] %}
        
Definitions -> definition _ml Definitions {% d => d[2].concat([d[0]]) %}
             | definition {% d => [d[0]] %}

definition -> TypeSystemDefinition {% d => d[0] %}

TypeSystemDefinition -> TypeDefinition {% d => d[0] %}

TypeDefinition -> ObjectTypeDefinition {% d => d[0] %}

ObjectTypeDefinition -> Description:? %ktype _ml TypeName ImplementsInterfaces:? Directives:? FieldsDefinition
         {%
             d => {
                 r = {
                    "type": "ObjectTypeDefinition",
                    "name": d[3],
                    "fields": d[6]
                 }

                 if(d[0]) r.description = d[0]
                 if(d[4]) r.implements = d[4]
                 if(d[5]) r.directives = d[5]

                 return r;
             }
         %}

TypeName -> %name _ml {% d => d[0].value %}

ImplementsInterfaces -> %kimplements _ml Interfaces {% d => d[2] %}

Interfaces -> TypeName %and _ml Interfaces {% d => [d[0]].concat(d[3]) %}
            | TypeName {% d => [d[0]] %}

FieldsDefinition -> %lbrace _ml Fields:? %rbrace {% d => d[2] %}

Fields -> Field Fields {% d => [d[0]].concat(d[1]) %}
        | Field {% d => [d[0]] %}

Field -> Description:? %name _ml ArgumentsDefinition:? %colon _ml Type
        {%
            d => {
                const r = {
                    "name": d[1].text,
                    "type": d[6]
                };
                if(d[0]) r.description = d[0]
                if(d[3]) r.argumentsDefinition = d[3]
                return r;
            }
        %}

Type -> TypeName Mandatory:?
        {%
            d => {
                return {
                    "name": d[0],
                    "nullable": d[1] ? false : true
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
                                    "value": d[1].value,
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

comment -> %pound_comment {% d => d[0] %}
         | %ml_comment {%  d => d[0].value %}
         | %string_literal {% d => d[0].value %}

