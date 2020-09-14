const TAB = 4;

const STYLE_DEFAULT = 0;
const STYLE_APPSYNC = 1;

let _style = STYLE_DEFAULT;

function toSDL(obj, style) {
  _style = style;
  const buffer = [];
  for (let block of obj) {
    switch (block.type) {
      case "SchemaDefinition":
        printSchemaDefinition(buffer, block);
        break;
      case "InputObjectTypeDefinition":
        printInputObjectTypeDefinition(buffer, block);
        break;
      case "DirectiveDefinition":
        printDirectiveDefinition(buffer, block);
        break;
      case "EnumTypeDefinition":
        printEnumTypeDefinition(buffer, block);
        break;
      case "UnionTypeDefinition":
        printUnionTypeDefinition(buffer, block);
        break;
      case "InterfaceTypeDefinition":
        printInterfaceTypeDefinition(buffer, block);
        break;
      case "ScalarTypeDefinition":
        printScalarTypeDefinition(buffer, block);
        break;
      case "ObjectTypeDefinition":
        printObjectTypeDefinition(buffer, block);
        break;
      default:
        console.log(`Unexpected type: ${block}`);
    }
  }

  return buffer.join("");
}

function printSchemaDefinition(buffer, schemaDefinition) {
  print(buffer, "schema");
  if (schemaDefinition.directives) {
    for (let directive of schemaDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, " {");
  for (let operation of schemaDefinition.operations) {
    printOperation(buffer, operation, 1);
  }
  println(buffer, "}\n");
}

function printDirective(buffer, directive) {
  print(buffer, " @" + directive.name);
  if (directive.arguments) {
    print(buffer, "(");
    for (let index in directive.arguments) {
      printArgument(buffer, directive.arguments[index]);
      if (index < directive.arguments.length - 1) print(buffer, ", ");
    }
    print(buffer, ")");
  }
}

function printOperation(buffer, operation, indent) {
  tab(buffer, indent);
  println(buffer, operation.operation + ": " + operation.type, indent);
}

function printArgument(buffer, argument) {
  print(buffer, argument.name + ": " + JSON.stringify(argument.value));
}

function printDirectiveDefinition(buffer, directiveDefinition) {
  if (directiveDefinition.description) {
    printDescription(buffer, directiveDefinition.description, 0);
  }
  print(buffer, "directive @" + directiveDefinition.name);
  if (directiveDefinition.argumentsDefinition) {
    println(buffer, "(");
    for (let index in directiveDefinition.argumentsDefinition) {
      printArgumentDefinition(
        buffer,
        directiveDefinition.argumentsDefinition[index],
        1
      );
    }
    print(buffer, ")");
  }
  print(buffer, " on");
  for (let i in directiveDefinition.on) {
    print(buffer, " " + directiveDefinition.on[i]);
    if (i < directiveDefinition.on.length - 1) print(buffer, " |");
  }
  println(buffer, "\n");
}

function printArgumentDefinition(buffer, argumentDefinition, indent) {
  if (argumentDefinition.description) {
    printDescription(buffer, argumentDefinition.description, indent);
  }
  tab(buffer, indent);
  print(buffer, argumentDefinition.name + ": ");
  printType(buffer, argumentDefinition.type);
  if (argumentDefinition.defaultValue) {
    print(buffer, " = " + argumentDefinition.defaultValue);
  }
  if (argumentDefinition.directives) {
    for (let directive of argumentDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, "");
}

function printScalarTypeDefinition(buffer, scalarTypeDefinition) {
  if (scalarTypeDefinition.description) {
    printDescription(buffer, scalarTypeDefinition.description, 0);
  }
  print(buffer, "scalar " + scalarTypeDefinition.name);
  if (scalarTypeDefinition.directives) {
    for (let directive of scalarTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, "\n");
}

function printType(buffer, type) {
  if (type.listOf) {
    print(buffer, "[");
    printType(buffer, type.listOf);
    print(buffer, "]");
  } else {
    print(buffer, type.name);
  }
  if (!type.nullable) print(buffer, "!");
}

function printDescription(buffer, description, indent) {
  if (_style == STYLE_APPSYNC) {
    const lines = description.split("\n");
    for (let i in lines) {
      tab(buffer, indent);
      println(buffer, "# " + lines[i]);
    }
  } else {
    tab(buffer, indent);
    println(buffer, '"""');
    tab(buffer, indent);
    println(buffer, description);
    tab(buffer, indent);
    println(buffer, '"""');
  }
}

function printObjectTypeDefinition(buffer, objectTypeDefinition) {
  if (objectTypeDefinition.description) {
    printDescription(buffer, objectTypeDefinition.description, 0);
  }
  print(buffer, `type ${objectTypeDefinition.name}`);
  if (objectTypeDefinition.implements) {
    print(buffer, " implements");
    for (let i in objectTypeDefinition.implements) {
      print(buffer, ` ${objectTypeDefinition.implements[i]}`);
      if (i < objectTypeDefinition.implements.length - 1) {
        print(buffer, " &");
      }
    }
  }
  if (objectTypeDefinition.directives) {
    for (let directive of objectTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, " {");
  for (let field of objectTypeDefinition.fields) {
    printFieldDefinition(buffer, field, 1);
  }
  println(buffer, "}\n");
}

function printInputObjectTypeDefinition(buffer, inputObjectTypeDefinition) {
  if (inputObjectTypeDefinition.description) {
    printDescription(buffer, inputObjectTypeDefinition.description, 0);
  }
  print(buffer, `input ${inputObjectTypeDefinition.name}`);
  if (inputObjectTypeDefinition.implements) {
    print(buffer, " implements");
    for (let i in inputObjectTypeDefinition.implements) {
      print(buffer, ` ${inputObjectTypeDefinition.implements[i]}`);
      if (i < inputObjectTypeDefinition.implements.length - 1) {
        print(buffer, " &");
      }
    }
  }
  if (inputObjectTypeDefinition.directives) {
    for (let directive of inputObjectTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, " {");
  for (let field of inputObjectTypeDefinition.fields) {
    printArgumentDefinition(buffer, field, 1);
  }
  println(buffer, "}\n");
}

function printFieldDefinition(buffer, fieldDefinition, indent) {
  if (fieldDefinition.description) {
    printDescription(buffer, fieldDefinition.description, indent);
  }
  tab(buffer, indent);
  print(buffer, fieldDefinition.name);
  if (fieldDefinition.argumentsDefinition) {
    println(buffer, "(");
    for (let index in fieldDefinition.argumentsDefinition) {
      printArgumentDefinition(
        buffer,
        fieldDefinition.argumentsDefinition[index],
        2
      );
    }
    tab(buffer, indent);
    print(buffer, ")");
  }
  print(buffer, ": ");
  printType(buffer, fieldDefinition.type);
  println(buffer, "");
}

function printInterfaceTypeDefinition(buffer, interfaceTypeDefinition) {
  if (interfaceTypeDefinition.description) {
    printDescription(buffer, interfaceTypeDefinition.description, 0);
  }
  print(buffer, `interface ${interfaceTypeDefinition.name}`);
  if (interfaceTypeDefinition.directives) {
    for (let directive of interfaceTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, " {");
  for (let field of interfaceTypeDefinition.fields) {
    printFieldDefinition(buffer, field, 1);
  }
  println(buffer, "}\n");
}

function printUnionTypeDefinition(buffer, unionTypeDefinition) {
  if (unionTypeDefinition.description) {
    printDescription(buffer, unionTypeDefinition.description);
  }
  print(buffer, `union ${unionTypeDefinition.name}`);
  if (unionTypeDefinition.directives) {
    for (let directive of unionTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  print(buffer, " =");
  for (let i in unionTypeDefinition.members) {
    print(buffer, ` ${unionTypeDefinition.members[i]}`);
    if (i < unionTypeDefinition.members.length - 1) {
      print(buffer, " |");
    }
  }
  println(buffer, "\n");
}

function printEnumTypeDefinition(buffer, enumTypeDefinition) {
  if (enumTypeDefinition.description) {
    printDescription(buffer, enumTypeDefinition.description);
  }
  print(buffer, `enum ${enumTypeDefinition.name}`);
  if (enumTypeDefinition.directives) {
    for (let directive of enumTypeDefinition.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, " {");
  for (let value of enumTypeDefinition.values) {
    printEnumValue(buffer, value, 1);
  }
  println(buffer, "}\n");
}

function printEnumValue(buffer, value, indent) {
  if (value.description) {
    printDescription(buffer, value.description, indent);
  }
  tab(buffer, indent);
  print(buffer, value.value);
  if (value.directives) {
    for (let directive of value.directives) {
      printDirective(buffer, directive);
    }
  }
  println(buffer, "");
}

function tab(buffer, indent) {
  buffer.push(" ".repeat(indent * TAB));
}

function println(buffer, text) {
  buffer.push(text + "\n");
}

function print(buffer, text) {
  buffer.push(text);
}

module.exports = toSDL;
