// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_ml", "Definitions", "_ml"], "postprocess": d => d[1]},
    {"name": "Definitions", "symbols": ["definition", "_ml", "Definitions"], "postprocess": d => d[2].concat([d[0]])},
    {"name": "Definitions", "symbols": ["definition"], "postprocess": d => [d[0]]},
    {"name": "definition", "symbols": ["TypeSystemDefinition"], "postprocess": d => d[0]},
    {"name": "TypeSystemDefinition", "symbols": ["TypeDefinition"], "postprocess": d => d[0]},
    {"name": "TypeDefinition", "symbols": ["ObjectTypeDefinition"], "postprocess": d => d[0]},
    {"name": "ObjectTypeDefinition$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition$ebnf$2", "symbols": ["ImplementsInterfaces"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition$ebnf$3", "symbols": ["Directives"], "postprocess": id},
    {"name": "ObjectTypeDefinition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ObjectTypeDefinition", "symbols": ["ObjectTypeDefinition$ebnf$1", (lexer.has("ktype") ? {type: "ktype"} : ktype), "_ml", "TypeName", "ObjectTypeDefinition$ebnf$2", "ObjectTypeDefinition$ebnf$3", "FieldsDefinition"], "postprocess": 
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
                 },
    {"name": "TypeName", "symbols": [(lexer.has("name") ? {type: "name"} : name), "_ml"], "postprocess": d => d[0].value},
    {"name": "ImplementsInterfaces", "symbols": [(lexer.has("kimplements") ? {type: "kimplements"} : kimplements), "_ml", "Interfaces"], "postprocess": d => d[2]},
    {"name": "Interfaces", "symbols": ["TypeName", (lexer.has("and") ? {type: "and"} : and), "_ml", "Interfaces"], "postprocess": d => [d[0]].concat(d[3])},
    {"name": "Interfaces", "symbols": ["TypeName"], "postprocess": d => [d[0]]},
    {"name": "FieldsDefinition$ebnf$1", "symbols": ["Fields"], "postprocess": id},
    {"name": "FieldsDefinition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FieldsDefinition", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "FieldsDefinition$ebnf$1", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": d => d[2]},
    {"name": "Fields", "symbols": ["Field", "Fields"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "Fields", "symbols": ["Field"], "postprocess": d => [d[0]]},
    {"name": "Field$ebnf$1", "symbols": ["Description"], "postprocess": id},
    {"name": "Field$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Field$ebnf$2", "symbols": ["ArgumentsDefinition"], "postprocess": id},
    {"name": "Field$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Field", "symbols": ["Field$ebnf$1", (lexer.has("name") ? {type: "name"} : name), "_ml", "Field$ebnf$2", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "Type"], "postprocess": 
        d => {
            const r = {
                "name": d[1].text,
                "type": d[6]
            };
            if(d[0]) r.description = d[0]
            if(d[3]) r.argumentsDefinition = d[3]
            return r;
        }
                },
    {"name": "Type$ebnf$1", "symbols": ["Mandatory"], "postprocess": id},
    {"name": "Type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Type", "symbols": ["TypeName", "Type$ebnf$1"], "postprocess": 
        d => {
            return {
                "name": d[0],
                "nullable": d[1] ? false : true
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
                "value": d[1].value,
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
    {"name": "comment", "symbols": [(lexer.has("pound_comment") ? {type: "pound_comment"} : pound_comment)], "postprocess": d => d[0]},
    {"name": "comment", "symbols": [(lexer.has("ml_comment") ? {type: "ml_comment"} : ml_comment)], "postprocess": d => d[0].value},
    {"name": "comment", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": d => d[0].value}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
