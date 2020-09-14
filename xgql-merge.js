#!/usr/bin/env node

const nearley = require("nearley");
const graphqlGrammar = require("./graphql_grammar");
const fs = require("fs").promises;
require("colors");

const toSDL = require("./json-to-sdl");

const program = require("commander");

program
  .description(
    "Combines multiple graphQL schema files into one. Exits with code 1 if any error was found."
  )
  .arguments("[morePaths...]")
  .option(
    "-s --style [style]",
    "The output style (default|appsync)",
    /^(default|appsync)$/i
  )
  .option("-f --fill", "Fill in missing fields from inherited interfaces", 0)
  .action(function (args) {
    run(args);
  })
  .parse(process.argv);

async function run(args) {
  if (args.length == 0) {
    console.log("At least one file to validate is needed");
    process.exit(1);
  }

  const members = {};

  let errors = 0;
  for (const filename of args) {
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(graphqlGrammar)
    );

    try {
      const schema = await fs.readFile(filename, "utf8");
      members[filename] = parser.feed(schema).results[0];
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

  if (errors != 0) process.exit(1);

  // Check only one schema declaration
  const schemaDefinitions = Object.keys(members).filter((k) =>
    members[k].find((def) => def.type === "SchemaDefinition")
  );

  if (schemaDefinitions.length > 1)
    fail("Too many schema declarations: " + schemaDefinitions);

  // Only types that are in the schema block are allowed to be merged. Otherwise it gets too confusing.
  const mergeableTypes = [];
  if (schemaDefinitions.length > 0) {
    const schemaBlock = members[schemaDefinitions].filter(
      (s) => s.type === "SchemaDefinition"
    )[0];

    for (const operation of schemaBlock.operations) {
      mergeableTypes.push(operation.type);
    }
  }

  // Check that there are no colliding names
  const names_registry = {};
  for (const filename of Object.keys(members)) {
    for (const definition of members[filename]) {
      if (definition.name && !mergeableTypes.includes(definition.name)) {
        if (names_registry[definition.name])
          fail(
            `Name ${definition.name} is defined in ${
              names_registry[definition.name]
            } and ${filename}`
          );

        names_registry[definition.name] = filename;
      }
    }
  }

  const combinations = {}; // For mergeable types

  const merged = []; // The end product
  for (const filename of Object.keys(members)) {
    const schema = members[filename];
    for (const definition of schema) {
      if (
        definition.type === "ObjectTypeDefinition" &&
        mergeableTypes.includes(definition.name)
      ) {
        // This needs to be a merge
        let existing = combinations[definition.name];
        if (!existing) combinations[definition.name] = definition;
        else {
          if (definition.fields) {
            if (existing.fields)
              existing.fields = existing.fields.concat(definition.fields);
            else existing.fields = definition.fields;
          }
        }
      } else {
        // Straight add
        merged.push(definition);
      }
    }
  }

  for (const entry of Object.keys(combinations)) {
    merged.push(combinations[entry]);
  }

  if (program.fill) fillInheritedFields(merged);

  let style = 0;
  switch (program.style) {
    case "appsync":
      style = 1;
      break;
    default:
      style = 0;
      break;
  }

  const result = toSDL(merged, style);
  console.log(result);
}

function fail(message) {
  console.log(message);
  process.exit(1);
}

function fillInheritedFields(blocks) {
  // Gather all the interfaces
  const interfaces = {};
  const types = [];
  for (const entry of blocks) {
    if (entry.type === "InterfaceTypeDefinition") {
      interfaces[entry.name] = entry;
    } else if (entry.type === "ObjectTypeDefinition") {
      types.push(entry);
    }
  }

  // Go through all the types
  for (const type of types) {
    if (type.implements) {
      for (const interface of type.implements) {
        const def = interfaces[interface];
        if (!def)
          fail(
            `type ${type.name} implements ${interface} but that interface is unknown`
          );
        if (def.fields) {
          if (!type.fields) type.fields = [];
          for (const field of def.fields) {
            if (!type.fields.find((f) => f.name === field.name))
              type.fields.push(field);
          }
        }
      }
    }
  }
}
