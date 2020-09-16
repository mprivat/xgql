#!/usr/bin/env node

const nearley = require("nearley");
const graphqlGrammar = require("./graphql_grammar");
const fs = require("fs").promises;
require("colors");

const program = require("commander");

program
  .description(
    "Validates one or more schema files at the syntax level. Exits with code 1 if errors are found."
  )
  .action(function () {
    run(process.argv.slice(2));
  })
  .option("-j --json", "Outputs the JSON structure", 0)
  .usage("[options] <path> [morePaths ...]")
  .parse(process.argv);

async function run(args) {
  if (args.length == 0) {
    console.log("At least one file to validate is needed");
    process.exit(1);
  }

  let errors = 0;
  for (let filename of args) {
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(graphqlGrammar)
    );

    try {
      const schema = await fs.readFile(filename, "utf8");
      const result = parser.feed(schema);
      console.log(`- ${filename}: ${"OK".green}`);
      if (program.json) {
        console.log(JSON.stringify(result.results[0], null, 2));
      }
    } catch (err) {
      errors++;
      let message = err.message;
      const idx = message.lastIndexOf("Unexpected input");
      if (idx >= 0) {
        message = message.substring(0, idx);
      }
      console.log(`- ${filename}: ${"ERROR".red}`);
      console.log(message);
    }
  }

  process.exit(errors == 0 ? 0 : 1);
}
