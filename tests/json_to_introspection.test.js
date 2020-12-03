const fs = require("fs").promises;
const toIntrospection = require("../json-to-introspection");

test("I can convert JSON to introspection JSON", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );

  const introspection = toIntrospection(json);

  console.log(JSON.stringify(introspection, null, 2));
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
