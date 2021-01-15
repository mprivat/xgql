const fs = require("fs").promises;
const toIntrospection = require("../json-to-introspection");

test("I can convert JSON to introspection JSON", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );

  const introspection = toIntrospection(json);
  expect(introspection).toBeDefined()
});

test("I set kind to NON-NULL when not nullable", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );

  const introspection = toIntrospection(json);
  expect(introspection.data.__schema.types[0].fields[0].type.kind).toBe(
    "NON_NULL"
  );
});

test("I can convert a basic JSON file to introspection JSON", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/simple.json", "utf8")
  );

  const introspection = toIntrospection(json);
  expect(introspection.data["__schema"]).toBeDefined()
});