function toIntrospection(obj) {
  const types = [];
  const inputs = [];
  const directives = [];
  const enums = [];
  const unions = [];
  const interfaces = [];
  const scalars = [];

  const names = {};
  const refs = {};

  let schema;

  // Sort everything
  for (const block of obj) {
    switch (block.type) {
      case "SchemaDefinition":
        schema = block;
        break;
      case "InputObjectTypeDefinition":
        inputs.push(block);
        break;
      case "DirectiveDefinition":
        directives.push(block);
        break;
      case "EnumTypeDefinition":
        enums.push(block);
        break;
      case "UnionTypeDefinition":
        unions.push(block);
        break;
      case "InterfaceTypeDefinition":
        interfaces.push(block);
        names[block.name] = "INTERFACE";
        break;
      case "ScalarTypeDefinition":
        scalars.push(block);
        break;
      case "ObjectTypeDefinition":
        types.push(block);
        names[block.name] = "OBJECT";
        break;
      default:
        console.log(`Unexpected type: ${block}`);
        return null;
    }
    refs[block.name] = block;
  }

  const members = {
    types,
    inputs,
    directives,
    enums,
    unions,
    interfaces,
    scalars,
  };

  return compose(schema, members, names, refs);
}

function compose(schema, members, names, refs) {
  const introspection = {};

  introspection.data = {};
  if (schema) {
    const s = {
      queryType: null,
      mutationType: null,
      subscriptionType: null,
    };

    introspection.data.__schema = s;
    if (schema.operations) {
      for (const op of schema.operations) {
        switch (op.operation) {
          case "query":
            s.queryType = {
              name: op.type,
            };
            break;
          case "mutation":
            s.mutationType = {
              name: op.type,
            };
            break;
          case "subscription":
            s.subscriptionType = {
              name: op.type,
            };
        }
      }
    }

    addTypes(s, members.types, names, refs);
  }

  return introspection;
}

function addTypes(schema, types, names, refs) {
  schema.types = [];
  for (const t of types) {
    const kind = names[t.name];
    const fields = [];
    const type = {
      name: t.name,
      kind: kind ? kind : "SCALAR",
      description: t.description,
      fields,
    };
    for (const field of t.fields) {
      fields.push(createField(field, names, refs));
    }
    schema.types.push(type);
  }
}

function createField(field, names, refs) {
  const f = {
    name: field.name,
    description: field.description,
  };

  if (field.type) {
    f.type = createType(field.type, names, refs);
  }

  return f;
}

function createType(type, names, refs) {
  const result = {};
  let t = result;

  if (!type.nullable) {
    t = {};
    result.kype = "NON_NULL";
    result.name = null;
    result.ofType = t;
  }

  if (type.listOf) {
    t.kind = "LIST";
    t.name = null;
    t.ofType = createType(type.listOf, names, refs);
  } else {
    const kind = names[t.name];
    t.kind = kind ? kind : "SCALAR";
    t.name = type.name;
    t.ofType = kind ? refs[t.name] : null;
  }
  return t;
}

module.exports = toIntrospection;
