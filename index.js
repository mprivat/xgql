#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const path = require("path");

const appHome = path.dirname(require.main.filename);

fs.readFile(`${appHome}/package.json`, "utf8", function (err, data) {
  if (err) throw err;
  const package = JSON.parse(data);

  program
    .version(package.version, "-v, --version")
    .description("A GraphQL schema manipulation tool.")
    .command("merge", "Merges multiple graphQL schema files into one")
    .command("syntax", "Syntax validation of the specified schema file(s)")
    .command(
      "introspect",
      "Simulates a basic introspection query of the specified schema file"
    )
    .parse(process.args);
});
