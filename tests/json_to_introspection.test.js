const fs = require("fs").promises;
const toIntrospection = require("../json-to-introspection");

test("I can convert JSON to introspection JSON", async () => {
  const json = JSON.parse(
    await fs.readFile("tests/resources/schema00.json", "utf8")
  );

  const introspection = toIntrospection(json);

  console.log(JSON.stringify(introspection, null, 2));
});
