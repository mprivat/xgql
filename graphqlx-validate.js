#!/usr/bin/env node

const nearley = require("nearley");
const graphqlGrammar = require("./graphql_grammar");
const fs = require("fs").promises;
const toSDL = require("./json-to-sql");

const program = require("commander");

program
  .description("Validates one or more schema files")
  .action(function () {
    run(process.argv.slice(2));
  })
  .parse(process.argv);

async function run(args) {
  const schema = await fs.readFile(args[0], "utf8");

  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(schema);

  const json_representation = parsed.results[0];

  console.log(JSON.stringify(json_representation, 0, 2));
  if (parsed.results.length > 1) {
    console.log(`The grammar is ambiguous: ${parsed.results.length} solutions`);
  }

  const sql = toSDL(json_representation, 0);
  console.log(sql);
}
