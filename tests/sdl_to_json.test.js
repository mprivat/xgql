const nearley = require("nearley");
const graphqlGrammar = require("../graphql_grammar");
const fs = require("fs").promises;

test("I can parse a complete graphQL schema without ambiguity", async () => {
  const schema = await fs.readFile("tests/resources/schema00.graphql", "utf8");

  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(schema);
  expect(parsed.results.length).toBe(1);
});

test("I can parse a type block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("type");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse a schema block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("schema");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse a scalar block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("scalar");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse an interface block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("interface");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse a union block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("union");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse a directive block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("directive");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse an enum block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("enum");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

test("I can parse an input block", async () => {
  const { expectedOutput, actualOutput } = await lookAt("input");
  expect(actualOutput).toStrictEqual(expectedOutput);
});

async function lookAt(name) {
  const expectedOutput = JSON.parse(
    await fs.readFile(`tests/resources/${name}.json`, "utf8")
  );
  const actualOutput = await parse(`tests/resources/${name}.graphql`, "utf8");

  return { expectedOutput, actualOutput };
}

async function parse(path) {
  const sdl = await fs.readFile(path, "utf8");

  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(sdl);
  return parsed.results[0];
}
