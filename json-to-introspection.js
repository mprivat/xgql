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

  const defaultTypes = require("./references/default.json");
  obj = obj.concat(defaultTypes);

  // Sort everything
  for (const block of obj) {
    switch (block.type) {
      case "SchemaDefinition":
        schema = block;
        break;
      case "InputObjectTypeDefinition":
        inputs.push(block);
        names[block.name] = "INPUT_OBJECT";
        break;
      case "DirectiveDefinition":
        directives.push(block);
        break;
      case "EnumTypeDefinition":
        enums.push(block);
        names[block.name] = "ENUM";
        break;
      case "UnionTypeDefinition":
        unions.push(block);
        names[block.name] = "UNION";
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

    s.types = [];
    s.directives = [];

    const implementations = {};

    addTypes(s.types, members.types, names, refs, implementations);
    addInterfaces(s.types, members.interfaces, names, refs, implementations);
    addScalars(s.types, members.scalars);
    addInputs(s.types, members.inputs, names, refs);
    addEnums(s.types, members.enums);
    addUnions(s.types, members.unions, names);
  }

  return introspection;
}

function addTypes(list, types, names, refs, implementations) {
  for (const t of types) {
    const fields = [];
    const type = {
      name: t.name,
      kind: "OBJECT",
      description: t.description,
      fields,
      inputFields: null,
      enumValues: null,
      possibleTypes: null,
      interfaces: [],
    };
    if (t.implements) {
      for (const name of t.implements) {
        type.interfaces.push({
          kind: "INTERFACE",
          name: name,
          ofType: null,
        });
        let backRef = implementations[name];
        if (backRef) backRef.push(t);
        else implementations[name] = [t];
      }
    }
    for (const field of t.fields) {
      fields.push(createField(field, names, refs));
    }
    list.push(type);
  }
}

function addInputs(list, inputs, names, refs) {
  for (const t of inputs) {
    const fields = [];
    const type = {
      name: t.name,
      kind: "INPUT_OBJECT",
      description: t.description,
      fields: null,
      inputFields: fields,
      enumValues: null,
      possibleTypes: null,
      interfaces: null,
    };
    for (const field of t.fields) {
      fields.push(createField(field, names, refs));
    }
    list.push(type);
  }
}

function addInterfaces(list, interfaces, names, refs, implementations) {
  for (const t of interfaces) {
    const fields = [];
    const type = {
      name: t.name,
      kind: "INTERFACE",
      description: t.description,
      fields,
      inputFields: null,
      enumValues: null,
      possibleTypes: [],
      interfaces: null,
    };
    for (const field of t.fields) {
      fields.push(createField(field, names, refs));
    }
    const possibleTypes = implementations[t.name];
    if (possibleTypes) {
      type.possibleTypes = possibleTypes.map((p) => {
        return {
          kind: "OBJECT",
          name: p.name,
          ofType: null,
        };
      });
    }
    list.push(type);
  }
}

function addScalars(list, scalars) {
  for (const t of scalars) {
    const type = {
      name: t.name,
      kind: "SCALAR",
      description: t.description,
      fields: null,
      inputFields: null,
      enumValues: null,
      possibleTypes: null,
      interfaces: null,
    };
    list.push(type);
  }
}

function addEnums(list, enums) {
  for (const t of enums) {
    const type = {
      name: t.name,
      kind: "ENUM",
      description: t.description,
      fields: null,
      inputFields: null,
      enumValues: null,
      possibleTypes: null,
      interfaces: null,
    };

    type.enumValues = t.values.map((v) => {
      const deprecation = getDeprecationInfo(type.directives);
      return {
        name: v.value,
        description: v.description ? v.description : null,
        isDeprecated: deprecation.isDeprecated,
        deprecationReason: deprecation.deprecationReason,
      };
    });

    list.push(type);
  }
}

function addUnions(list, unions, names) {
  for (const t of unions) {
    const type = {
      name: t.name,
      kind: "UNION",
      description: t.description,
      fields: null,
      inputFields: null,
      enumValues: null,
      possibleTypes: null,
      interfaces: null,
    };
    if (t.members) {
      t.possibleTypes = t.members.map((m) => {
        const kind = names[m.name];
        return {
          kind: kind ? kind : "SCALAR",
          name: m.name,
          ofType: null,
        };
      });
    }
    list.push(type);
  }
}

function getDeprecationInfo(directives) {
  if (!directives) {
    return { isDeprecated: false, deprecationReason: null };
  }

  const d = directives.find((v) => v.name === "deprecated");
  if (!d) {
    return { isDeprecated: false, deprecationReason: null };
  } else {
    let reason = null;
    if (d.arguments) {
      const r = d.arguments.find((a) => a.name === "reason");
      if (r) reason = r.value;
    }
    return { isDeprecated: true, deprecationReason: reason };
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

  f.args = [];
  if (field.argumentsDefinition) {
    for (const arg of field.argumentsDefinition) {
      f.args.push(createArgumentDefinition(arg, names, refs));
    }
  }

  const deprecation = getDeprecationInfo(field.directives);
  f.isDeprecated = deprecation.isDeprecated;
  f.deprecationReason = deprecation.deprecationReason;

  return f;
}

function createType(type, names, refs) {
  const result = {};
  let t = result;

  if (!type.nullable) {
    t = {};
    result.kind = "NON_NULL";
    result.name = null;
    result.ofType = t;
  }

  if (type.listOf) {
    t.kind = "LIST";
    t.name = null;
    t.ofType = createType(type.listOf, names, refs);
  } else {
    const kind = names[type.name];
    t.kind = kind !== undefined ? kind : "SCALAR";
    t.name = type.name;
    //t.ofType = kind ? refs[type.name] : null;
    t.ofType = null;
  }
  return result;
}

function createArgumentDefinition(arg, names, refs) {
  const a = {
    name: arg.name,
    description: arg.description,
    type: createType(arg.type, names, refs),
    defaultValue: null,
  };

  if (arg.defaultValue) a.defaultValue = arg.defaultValue;

  return a;
}
module.exports = toIntrospection;
