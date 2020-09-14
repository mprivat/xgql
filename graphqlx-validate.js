#!/usr/bin/env node

const nearley = require("nearley");
const graphqlGrammar = require("./graphql_grammar");
const fs = require("fs").promises;
require("colors");

const program = require("commander");

program
  .description("Validates one or more schema files")
  .action(function () {
    run(process.argv.slice(2));
  })
  .usage("[options] <path> [morePaths ...]")
  .parse(process.argv);

async function run(args) {
  for (let filename of args) {
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(graphqlGrammar)
    );

    try {
      const schema = await fs.readFile(filename, "utf8");
      parser.feed(schema);
      console.log(`${filename}: ${"OK".green}`);
    } catch (err) {
      let message = err.message;
      const idx = message.lastIndexOf("Unexpected input");
      if (idx >= 0) {
        message = message.substring(0, idx);
      }
      console.log(`${filename}: ${"ERROR".red}`);
      console.log(message);
    }
  }
}
