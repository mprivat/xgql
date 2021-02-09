const fs = require("fs").promises;
const nearley = require("nearley");
const graphqlGrammar = require("../graphql_grammar");
const toSDL = require("../json-to-sdl");

test("I can reverse JSON back to SDL", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );
  const result = toSDL(json, 0);

  // Make sure the output is valid
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(result);
  expect(parsed.results.length).toBe(1);

  expect(
    result.includes(await fs.readFile("tests/resources/type-gen.sdl", "utf8"))
  ).toBe(true);

  expect(
    result.includes(
      await fs.readFile("tests/resources/interface-gen.sdl", "utf8")
    )
  ).toBe(true);

  expect(
    result.includes(await fs.readFile("tests/resources/enum-gen.sdl", "utf8"))
  ).toBe(true);

  expect(
    result.includes(
      await fs.readFile("tests/resources/directive-gen.sdl", "utf8")
    )
  ).toBe(true);

  expect(
    result.includes(await fs.readFile("tests/resources/scalar-gen.sdl", "utf8"))
  ).toBe(true);

  expect(
    result.includes(await fs.readFile("tests/resources/union-gen.sdl", "utf8"))
  ).toBe(true);

  expect(
    result.includes(await fs.readFile("tests/resources/schema-gen.sdl", "utf8"))
  ).toBe(true);
});

test("I can reverse JSON back to SDL with appsync comments", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );
  const result = toSDL(json, 1);

  // Make sure the output is valid
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(result);
  expect(parsed.results.length).toBe(1);

  expect(
    result.includes(
      await fs.readFile("tests/resources/type-gen-appsync.sdl", "utf8")
    )
  ).toBe(true);
});

test("I can reverse AWS-annotated JSON back to SDL", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/aws.json", "utf8")
  );
  const result = toSDL(json, 0);

  // Make sure the output is valid
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(graphqlGrammar)
  );
  const parsed = parser.feed(result);
  expect(parsed.results.length).toBe(1);

  expect(
    result.includes(await fs.readFile("tests/resources/aws-mutation-gen.sdl", "utf8"))
  ).toBe(true);

  expect(
    result.includes(await fs.readFile("tests/resources/aws-subscription-gen.sdl", "utf8"))
  ).toBe(true);
});