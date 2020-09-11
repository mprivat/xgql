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
    variable_name: {
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
    {"name": "main", "symbols": ["_ml", "definitions", "_ml"], "postprocess": d => d[1]},
    {"name": "definitions", "symbols": ["definition", "_ml", "definitions"], "postprocess": d => d[2].concat([d[0]])},
    {"name": "definitions", "symbols": ["definition"], "postprocess": d => [d[0]]},
    {"name": "definition$ebnf$1", "symbols": ["description"], "postprocess": id},
    {"name": "definition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "definition", "symbols": ["definition$ebnf$1", "type_system_definition"], "postprocess": 
        d => {
            if(d[0]) {
                d[1].description = d[0]
            }
            return {
                "objectTypeDefinition": d[1]
            }
        }
                    },
    {"name": "type_system_definition", "symbols": ["type_definition"], "postprocess": d => d[0]},
    {"name": "type_definition", "symbols": ["object_type_definition"], "postprocess": d => d[0]},
    {"name": "object_type_definition$ebnf$1", "symbols": ["implements_interfaces"], "postprocess": id},
    {"name": "object_type_definition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object_type_definition$ebnf$2", "symbols": ["directives"], "postprocess": id},
    {"name": "object_type_definition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object_type_definition", "symbols": [(lexer.has("ktype") ? {type: "ktype"} : ktype), "_ml", "type_name", "object_type_definition$ebnf$1", "object_type_definition$ebnf$2", "fields_definition"], "postprocess": 
        d => {
            r = {
               "name": d[2],
               "fields": d[5]
            }
        
            if(d[3]) r.implements = d[3]
            if(d[4]) r.directives = d[4]
        
            return r;
        }
                 },
    {"name": "type_name", "symbols": [(lexer.has("variable_name") ? {type: "variable_name"} : variable_name), "_ml"], "postprocess": d => d[0].value},
    {"name": "implements_interfaces", "symbols": [(lexer.has("kimplements") ? {type: "kimplements"} : kimplements), "_ml", "list_of_interfaces"], "postprocess": d => d[2]},
    {"name": "list_of_interfaces", "symbols": ["type_name", (lexer.has("and") ? {type: "and"} : and), "_ml", "list_of_interfaces"], "postprocess": d => [d[0]].concat(d[3])},
    {"name": "list_of_interfaces", "symbols": ["type_name"], "postprocess": d => [d[0]]},
    {"name": "fields_definition$ebnf$1", "symbols": ["list_of_fields"], "postprocess": id},
    {"name": "fields_definition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "fields_definition", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_ml", "fields_definition$ebnf$1", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": d => d[2]},
    {"name": "list_of_fields", "symbols": ["field", "list_of_fields"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "list_of_fields", "symbols": ["field"], "postprocess": d => [d[0]]},
    {"name": "field$ebnf$1", "symbols": ["description"], "postprocess": id},
    {"name": "field$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "field$ebnf$2", "symbols": ["arguments_definition"], "postprocess": id},
    {"name": "field$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "field", "symbols": ["field$ebnf$1", (lexer.has("variable_name") ? {type: "variable_name"} : variable_name), "_ml", "field$ebnf$2", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "type"], "postprocess": 
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
    {"name": "type$ebnf$1", "symbols": ["mandatory"], "postprocess": id},
    {"name": "type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "type", "symbols": ["type_name", "type$ebnf$1"], "postprocess": 
        d => {
            return {
                "name": d[0],
                "nullable": d[1] ? false : true
            }
        }
                },
    {"name": "mandatory", "symbols": [(lexer.has("exclamation") ? {type: "exclamation"} : exclamation), "_ml"]},
    {"name": "directives", "symbols": ["directive", "directives"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "directives", "symbols": ["directive"], "postprocess": d => [d[0]]},
    {"name": "directive$ebnf$1", "symbols": ["arguments"], "postprocess": id},
    {"name": "directive$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "directive", "symbols": [(lexer.has("at") ? {type: "at"} : at), (lexer.has("variable_name") ? {type: "variable_name"} : variable_name), "_ml", "directive$ebnf$1"], "postprocess": 
        d => {
            const r = {
                "name": d[1].value
            };
            if(d[3]) r.arguments = d[3];
            return r;
        }
                     },
    {"name": "arguments$ebnf$1", "symbols": ["list_of_arguments"], "postprocess": id},
    {"name": "arguments$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_ml", "arguments$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_ml"], "postprocess": d => d[2] ? d[2] : null},
    {"name": "list_of_arguments", "symbols": ["argument", "list_of_arguments"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "list_of_arguments", "symbols": ["argument"], "postprocess": d => [d[0]]},
    {"name": "argument", "symbols": [(lexer.has("variable_name") ? {type: "variable_name"} : variable_name), "_ml", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "value", "_ml"], "postprocess": 
        d => {
            return {
                "name": d[0].value,
                "value": d[4]
            }
        }
                    },
    {"name": "arguments_definition$ebnf$1", "symbols": ["input_value_definition"], "postprocess": id},
    {"name": "arguments_definition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "arguments_definition", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "_ml", "arguments_definition$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen), "_ml"], "postprocess": d => d[2] ? d[2] : null},
    {"name": "input_value_definition", "symbols": ["argument_definition", "input_value_definition"], "postprocess": d => [d[0]].concat(d[1])},
    {"name": "input_value_definition", "symbols": ["argument_definition"], "postprocess": d => [d[0]]},
    {"name": "argument_definition$ebnf$1", "symbols": ["description"], "postprocess": id},
    {"name": "argument_definition$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_definition$ebnf$2", "symbols": ["default_value"], "postprocess": id},
    {"name": "argument_definition$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_definition$ebnf$3", "symbols": ["directives"], "postprocess": id},
    {"name": "argument_definition$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "argument_definition", "symbols": ["argument_definition$ebnf$1", (lexer.has("variable_name") ? {type: "variable_name"} : variable_name), "_ml", (lexer.has("colon") ? {type: "colon"} : colon), "_ml", "type", "argument_definition$ebnf$2", "argument_definition$ebnf$3"], "postprocess": 
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
    {"name": "default_value", "symbols": [(lexer.has("equals") ? {type: "equals"} : equals), "_ml", "value", "_ml"], "postprocess": d => d[2]},
    {"name": "value", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": d => d[0].value},
    {"name": "value", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": d => d[0].value},
    {"name": "value", "symbols": [(lexer.has("ktrue") ? {type: "ktrue"} : ktrue)], "postprocess": d => true},
    {"name": "value", "symbols": [(lexer.has("kfalse") ? {type: "kfalse"} : kfalse)], "postprocess": d => false},
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
    {"name": "description", "symbols": ["comment", "description"], "postprocess": d => d[0] + '\n' + d[1]},
    {"name": "description", "symbols": ["comment", "_ml"], "postprocess": d => d[0]},
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
