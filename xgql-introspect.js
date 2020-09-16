#!/usr/bin/env node

const nearley = require("nearley");
const graphqlGrammar = require("./graphql_grammar");
const fs = require("fs").promises;
const toIntrospection = require("./json-to-introspection");

const program = require("commander");

program
  .description(
    "Simulates a basic introspection query against the schema and outputs as json"
  )
  .option(
    "-o --output <path>",
    "Sends the resulting file to the given file instead of stdout"
  )
  .action(function () {
    run(process.argv.slice(2));
  })
  .usage("[options] <path>")
  .parse(process.argv);

async function run(args) {
  if (args.length != 1) {
    console.log("Please specify exactly one graphQL schema file");
    process.exit(1);
  }

  const filename = args[0];
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );

  try {
    const schema = await fs.readFile(filename, "utf8");
    const parsed = parser.feed(schema);
    const result = JSON.stringify(toIntrospection(parsed.results[0]), null, 2);
    if (program.output) {
      await fs.writeFile(program.output, result, "utf8");
    } else {
      console.log(result);
    }
  } catch (err) {
    let message = err.message;
    const idx = message.lastIndexOf("Unexpected input");
    if (idx >= 0) {
      message = message.substring(0, idx);
    }
    console.log(message);
    process.exit(1);
  }
}
