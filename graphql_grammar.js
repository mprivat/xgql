// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Document", "symbols": ["_ml", "Definitions"], "postprocess": d => d[1]},
    {"name": "Definitions", "symbols": ["Definition", "Definitions"], "postprocess": d => d[1].concat([d[0]])},
    {"name": "Definitions", "symbols": ["Definition"], "postprocess": d => [d[0]]},
    {"name": "Definition", "symbols": ["TypeSystemDefinition"], "postprocess": d => d[0]},
    {"name": "TypeSystemDefinition", "symbols": ["TypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeSystemDefinition", "symbols": ["SchemaDefinition"], "postprocess": d => d[0]},
    {"name": "TypeSystemDefinition", "symbols": ["DirectiveDefinition"], "postprocess": d => d[0]},
    {"name": "DirectiveDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "DirectiveDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DirectiveDefinition$ebnf$2", "symbols": ["ArgumentsDefinition"], "postprocess": id},
    {"name": "DirectiveDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "DirectiveDefinition", "symbols": ["DirectiveDefinition$ebnf$1", (lexer.has("kdirective") ? {type: "kdirective"} : kdirective), "_ml", (lexer.has("at") ? {type: "at"} : at), "Name", "DirectiveDefinition$ebnf$2", (lexer.has("kon") ? {type: "kon"} : kon), "_ml", "DirectiveLocations"], "postprocess": 
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
                                },
    {"name": "DirectiveLocations", "symbols": ["DirectiveLocation", (lexer.has("or") ? {type: "or"} : or), "_ml", "DirectiveLocations"], "postprocess": d => [d[0]].concat(d[3])},
    {"name": "DirectiveLocations", "symbols": ["DirectiveLocation"], "postprocess": d => [d[0]]},
    {"name": "DirectiveLocation", "symbols": [(lexer.has("executable_directive_location") ? {type: "executable_directive_location"} : executable_directive_location), "_ml"], "postprocess": d => d[0].value},
    {"name": "DirectiveLocation", "symbols": [(lexer.has("type_system_directive_location") ? {type: "type_system_directive_location"} : type_system_directive_location), "_ml"], "postprocess": d => d[0].value},
    {"name": "SchemaDefinition$ebnf$1", "symbols": ["Directives"], "postprocess": id},
    {"name": "SchemaDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "SchemaDefinition", "symbols": [(lexer.has("kschema") ? {type: "kschema"} : kschema), "_ml", "SchemaDefinition$ebnf$1", (lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "RootOperationTypeDefinitions", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "_ml"], "postprocess": 
        d => {
            const r = {
                "type": "SchemaDefinition",
                "operations": d[5]
            }
        
            if(d[2]) r.directives = d[2]
        
            return r
        }
                            },
    {"name": "RootOperationTypeDefinitions", "symbols": ["RootOperationTypeDefinition", "RootOperationTypeDefinitions"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "RootOperationTypeDefinitions", "symbols": ["RootOperationTypeDefinition"], "postprocess": d => [d[0]]},
    {"name": "RootOperationTypeDefinition", "symbols": ["OperationType", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "NamedType"], "postprocess": 
        d => {
            return {
                "operation": d[0],
                "type": d[3]
            }
        }
                                       },
    {"name": "OperationType", "symbols": [(lexer.has("kquery") ? {type: "kquery"} : kquery), "_ml"], "postprocess": d => d[0].value},
    {"name": "OperationType", "symbols": [(lexer.has("kmutation") ? {type: "kmutation"} : kmutation), "_ml"], "postprocess": d => d[0].value},
    {"name": "OperationType", "symbols": [(lexer.has("ksubscription") ? {type: "ksubscription"} : ksubscription), "_ml"], "postprocess": d => d[0].value},
    {"name": "TypeDefinition", "symbols": ["ScalarTypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["ObjectTypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["InterfaceTypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["UnionTypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["EnumTypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["InputObjectTypeDefinition"], "postprocess": d => d[0]},
    {"name": "ScalarTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "ScalarTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ScalarTypeDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "ScalarTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ScalarTypeDefinition", "symbols": ["ScalarTypeDefinition$ebnf$1", (lexer.has("kscalar") ? {type: "kscalar"} : kscalar), "_ml", "Name", "ScalarTypeDefinition$ebnf$2"], "postprocess": 
        d => {
            const r = {
                "type": "ScalarTypeDefinition",
                "name": d[3]
            }
        
            if(d[0]) r.description = d[0]
            if(d[4]) r.directives = d[4]
        
            return r
        }
                                },
    {"name": "ObjectTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition$ebnf$2", "symbols": ["ImplementsInterfaces"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition$ebnf$3", "symbols": ["Directives"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition$ebnf$4", "symbols": ["FieldsDefinition"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition", "symbols": ["ObjectTypeDefinition$ebnf$1", (lexer.has("ktype") ? {type: "ktype"} : ktype), "_ml", "Name", "ObjectTypeDefinition$ebnf$2", "ObjectTypeDefinition$ebnf$3", "ObjectTypeDefinition$ebnf$4"], "postprocess": 
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
                                 },
    {"name": "InterfaceTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "InterfaceTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InterfaceTypeDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "InterfaceTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InterfaceTypeDefinition$ebnf$3", "symbols": ["FieldsDefinition"], "postprocess": id},
    {"name": "InterfaceTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InterfaceTypeDefinition", "symbols": ["InterfaceTypeDefinition$ebnf$1", (lexer.has("kinterface") ? {type: "kinterface"} : kinterface), "_ml", "Name", "InterfaceTypeDefinition$ebnf$2", "InterfaceTypeDefinition$ebnf$3"], "postprocess": 
        d => {
             const r = {
                "type": "InterfaceTypeDefinition",
                "name": d[3]
             }
        
             if(d[0]) r.description = d[0]
             if(d[4]) r.directives = d[4]
             if(d[5]) r.fields = d[5]
        
             return r;
        }
                                   },
    {"name": "UnionTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "UnionTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "UnionTypeDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "UnionTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "UnionTypeDefinition$ebnf$3", "symbols": ["UnionMemberTypes"], "postprocess": id},
    {"name": "UnionTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "UnionTypeDefinition", "symbols": ["UnionTypeDefinition$ebnf$1", (lexer.has("kunion") ? {type: "kunion"} : kunion), "_ml", "Name", "UnionTypeDefinition$ebnf$2", "UnionTypeDefinition$ebnf$3"], "postprocess": 
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
                               },
    {"name": "EnumTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "EnumTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EnumTypeDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "EnumTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EnumTypeDefinition$ebnf$3", "symbols": ["EnumValuesDefinition"], "postprocess": id},
    {"name": "EnumTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EnumTypeDefinition", "symbols": ["EnumTypeDefinition$ebnf$1", (lexer.has("kenum") ? {type: "kenum"} : kenum), "_ml", "Name", "EnumTypeDefinition$ebnf$2", "EnumTypeDefinition$ebnf$3"], "postprocess": 
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
                              },
    {"name": "InputObjectTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "InputObjectTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InputObjectTypeDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "InputObjectTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InputObjectTypeDefinition$ebnf$3", "symbols": ["InputFieldsDefinition"], "postprocess": id},
    {"name": "InputObjectTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InputObjectTypeDefinition", "symbols": ["InputObjectTypeDefinition$ebnf$1", (lexer.has("kinput") ? {type: "kinput"} : kinput), "_ml", "Name", "InputObjectTypeDefinition$ebnf$2", "InputObjectTypeDefinition$ebnf$3"], "postprocess": 
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
                                     },
    {"name": "InputFieldsDefinition$ebnf$1", "symbols": ["InputValueDefinition"], "postprocess": id},
    {"name": "InputFieldsDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "InputFieldsDefinition", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "InputFieldsDefinition$ebnf$1", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "_ml"], "postprocess": d => d[2]},
    {"name": "EnumValuesDefinition", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "EnumValueDefinitions", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "_ml"], "postprocess": d => d[2]},
    {"name": "EnumValueDefinitions", "symbols": ["EnumValueDefinition", "EnumValueDefinitions"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "EnumValueDefinitions", "symbols": ["EnumValueDefinition"], "postprocess": d => d[0]},
    {"name": "EnumValueDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "EnumValueDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EnumValueDefinition$ebnf$2", "symbols": ["Directives"], "postprocess": id},
    {"name": "EnumValueDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "EnumValueDefinition", "symbols": ["EnumValueDefinition$ebnf$1", "EnumValue", "EnumValueDefinition$ebnf$2"], "postprocess": 
        d => {
            const r = {
                "value": d[1]
            }
        
            if(d[0]) r.description = d[0]
            if(d[2]) r.directives = d[2]
        
            return r
        }
                                },
    {"name": "UnionMemberTypes", "symbols": [(lexer.has("equals") ? {type: "equals"} : equals), "_ml", "ListOfMemberTypes"], "postprocess": d => d[2]},
    {"name": "ListOfMemberTypes", "symbols": ["NamedType", (lexer.has("or") ? {type: "or"} : or), "_ml", "ListOfMemberTypes"], "postprocess": d => [d[0]].concat(d[3])},
    {"name": "ListOfMemberTypes", "symbols": ["NamedType"], "postprocess": d => [d[0]]},
    {"name": "NamedType", "symbols": ["Name"], "postprocess": d => d[0]},
    {"name": "EnumValue", "symbols": ["Name"], "postprocess": d => d[0]},
    {"name": "Name", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_ml"], "postprocess": d => d[0].value},
    {"name": "ImplementsInterfaces", "symbols": [(lexer.has("kimplements") ? {type: "kimplements"} : kimplements), "_ml", "Interfaces"], "postprocess": d => d[2]},
    {"name": "Interfaces", "symbols": ["Name", (lexer.has("and") ? {type: "and"} : and), "_ml", "Interfaces"], "postprocess": d => [d[0]].concat(d[3])},
    {"name": "Interfaces", "symbols": ["Name"], "postprocess": d => [d[0]]},
    {"name": "FieldsDefinition$ebnf$1", "symbols": ["Fields"], "postprocess": id},
    {"name": "FieldsDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FieldsDefinition", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "FieldsDefinition$ebnf$1", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace), "_ml"], "postprocess": d => d[2]},
    {"name": "Fields", "symbols": ["Field", "Fields"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "Fields", "symbols": ["Field"], "postprocess": d => [d[0]]},
    {"name": "Field$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "Field$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Field$ebnf$2", "symbols": ["ArgumentsDefinition"], "postprocess": id},
    {"name": "Field$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Field$ebnf$3", "symbols": ["Directives"], "postprocess": id},
    {"name": "Field$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Field", "symbols": ["Field$ebnf$1", (lexer.has("name") ? {type: "name"} : name), "_ml", "Field$ebnf$2", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "Type", "Field$ebnf$3"], "postprocess": 
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
                },
    {"name": "Type$ebnf$1", "symbols": ["Mandatory"], "postprocess": id},
    {"name": "Type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Type", "symbols": ["Name", "Type$ebnf$1"], "postprocess": 
        d => {
            return {
                "name": d[0],
                "nullable": d[1] ? false : true
            }
        }
                },
    {"name": "Type$ebnf$2", "symbols": ["Mandatory"], "postprocess": id},
    {"name": "Type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Type", "symbols": [(lexer.has("lbracket") ? {type: "lbracket"} : lbracket), "_ml", "Type", (lexer.has("rbracket") ? {type: "rbracket"} : rbracket), "_ml", "Type$ebnf$2"], "postprocess": 
        d => {
            return {
                "listOf": d[2],
                "nullable": d[5] ? false : true
            }
        }
                },
    {"name": "Mandatory", "symbols": [(lexer.has("exclamation") ? {type: "exclamation"} : exclamation), "_ml"]},
    {"name": "Directives", "symbols": ["Directive", "Directives"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "Directives", "symbols": ["Directive"], "postprocess": d => [d[0]]},
    {"name": "Directive$ebnf$1", "symbols": ["Arguments"], "postprocess": id},
    {"name": "Directive$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Directive", "symbols": [(lexer.has("at") ? {type: "at"} : at), (lexer.has("name") ? {type: "name"} : name), "_ml", "Directive$ebnf$1"], "postprocess": 
        d => {
            const r = {
                "name": d[1].value
            };
            if(d[3]) r.arguments = d[3];
            return r;
        }
                     },
    {"name": "Arguments$ebnf$1", "symbols": ["ListOfArguments"], "postprocess": id},
    {"name": "Arguments$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Arguments", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_ml", "Arguments$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_ml"], "postprocess": d => d[2] ? d[2] : null},
    {"name": "ListOfArguments", "symbols": ["Argument", "ListOfArguments"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "ListOfArguments", "symbols": ["Argument"], "postprocess": d => [d[0]]},
    {"name": "Argument", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_ml", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "Value", "_ml"], "postprocess": 
        d => {
            return {
                "name": d[0].value,
                "value": d[4]
            }
        }
                    },
    {"name": "ArgumentsDefinition$ebnf$1", "symbols": ["InputValueDefinition"], "postprocess": id},
    {"name": "ArgumentsDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ArgumentsDefinition", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_ml", "ArgumentsDefinition$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_ml"], "postprocess": d => d[2] ? d[2] : null},
    {"name": "InputValueDefinition", "symbols": ["ArgumentDefinition", "InputValueDefinition"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "InputValueDefinition", "symbols": ["ArgumentDefinition"], "postprocess": d => [d[0]]},
    {"name": "ArgumentDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "ArgumentDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ArgumentDefinition$ebnf$2", "symbols": ["DefaultValue"], "postprocess": id},
    {"name": "ArgumentDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ArgumentDefinition$ebnf$3", "symbols": ["Directives"], "postprocess": id},
    {"name": "ArgumentDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ArgumentDefinition", "symbols": ["ArgumentDefinition$ebnf$1", (lexer.has("name") ? {type: "name"} : name), "_ml", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "Type", "ArgumentDefinition$ebnf$2", "ArgumentDefinition$ebnf$3"], "postprocess": 
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
                               },
    {"name": "DefaultValue", "symbols": [(lexer.has("equals") ? {type: "equals"} : equals), "_ml", "Value", "_ml"], "postprocess": d => d[2]},
    {"name": "Value", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": d => d[0].value},
    {"name": "Value", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": d => d[0].value},
    {"name": "Value", "symbols": [(lexer.has("ktrue") ? {type: "ktrue"} : ktrue)], "postprocess": d => true},
    {"name": "Value", "symbols": [(lexer.has("kfalse") ? {type: "kfalse"} : kfalse)], "postprocess": d => false},
    {"name": "_ml$ebnf$1", "symbols": []},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "multi_line_ws_char", "symbols": [{"literal":"\n"}]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "Description", "symbols": ["comment", "Description"], "postprocess": d => d[0] + '\n' + d[1]},
    {"name": "Description", "symbols": ["comment", "_ml"], "postprocess": d => d[0]},
    {"name": "comment", "symbols": [(lexer.has("pound_comment") ? {type: "pound_comment"} : pound_comment)], "postprocess": d => d[0].value},
    {"name": "comment", "symbols": [(lexer.has("ml_comment") ? {type: "ml_comment"} : ml_comment)], "postprocess": d => d[0].value},
    {"name": "comment", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": d => d[0].value}
]
  , ParserStart: "Document"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
