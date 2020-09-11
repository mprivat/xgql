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

%}

@lexer lexer

main -> _ml definitions _ml {% d => d[1] %}
        
definitions -> definition _ml definitions {% d => d[2].concat([d[0]]) %}
             | definition {% d => [d[0]] %}

definition -> description:? type_system_definition
            {%
                d => {
                    if(d[0]) {
                        d[1].description = d[0]
                    }
                    return {
                        "objectTypeDefinition": d[1]
                    }
                }
            %}

type_system_definition -> type_definition {% d => d[0] %}

type_definition -> object_type_definition {% d => d[0] %}

object_type_definition -> %ktype _ml type_name implements_interfaces:? directives:? fields_definition
         {%
             d => {
                 r = {
                    "name": d[2],
                    "fields": d[5]
                 }

                 if(d[3]) r.implements = d[3]
                 if(d[4]) r.directives = d[4]

                 return r;
             }
         %}

type_name -> %variable_name _ml {% d => d[0].value %}

implements_interfaces -> %kimplements _ml list_of_interfaces {% d => d[2] %}

list_of_interfaces -> type_name %and _ml list_of_interfaces {% d => [d[0]].concat(d[3]) %}
                    | type_name {% d => [d[0]] %}

fields_definition -> %lbrace _ml list_of_fields:? %rbrace {% d => d[2] %}

list_of_fields -> field list_of_fields {% d => [d[0]].concat(d[1]) %}
                  | field {% d => [d[0]] %}

field -> description:? %variable_name _ml arguments_definition:? %colon _ml type
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

type -> type_name mandatory:?
        {%
            d => {
                return {
                    "name": d[0],
                    "nullable": d[1] ? false : true
                }
            }
        %}

mandatory -> %exclamation _ml

directives -> directive directives {% d => [d[0]].concat(d[1]) %}
            | directive {% d => [d[0]] %}

directive -> %at %variable_name _ml arguments:?
             {%
                d => {
                    const r = {
                        "name": d[1].value
                    };
                    if(d[3]) r.arguments = d[3];
                    return r;
                }
             %}

arguments -> %lparen _ml list_of_arguments:? %rparen _ml {% d => d[2] ? d[2] : null %}

list_of_arguments -> argument list_of_arguments {% d => [d[0]].concat(d[1]) %}
                   | argument {% d => [d[0]] %}

argument -> %variable_name _ml %colon _ml value _ml
            {%
                d => {
                    return {
                        "name": d[0].value,
                        "value": d[4]
                    }
                }
            %}

arguments_definition -> %lparen _ml input_value_definition:? %rparen _ml {% d => d[2] ? d[2] : null %}

input_value_definition -> argument_definition input_value_definition {% d => [d[0]].concat(d[1]) %}
                        | argument_definition {% d => [d[0]] %}

argument_definition -> description:? %variable_name _ml %colon _ml type default_value:? directives:?
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

default_value -> %equals _ml value _ml {% d => d[2] %}

value -> %number_literal {% d => d[0].value %}
       | %string_literal {% d => d[0].value %}
       | %ktrue {% d => true %}
       | %kfalse {% d => false %}

_ml -> multi_line_ws_char:*

multi_line_ws_char
    -> %ws
    |  "\n"

__ -> %ws:+

_ -> %ws:*

description -> comment description {% d => d[0] + '\n' + d[1] %}
             | comment _ml {% d => d[0] %}

comment -> %pound_comment {% d => d[0] %}
         | %ml_comment {%  d => d[0].value %}
         | %string_literal {% d => d[0].value %}

