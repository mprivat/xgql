#!/usr/bin/env node

const program = require("commander");

program
  .description("Validates one or more schema files")
  .action(function () {
    run(process.argv.slice(2));
  })
  .parse(process.argv);

async function run(args) {
  console.log("Validation");
  console.log(args);
}
