# graphqlx

graphqlx is a GraphQL schema manipulation tool and extensions. The idea is to parse graphQL schemas and extend the grammar to support other nice things such as includes. This is a useful tool to include in your CI pipeline in order to assemble your schemas into a single file.

# Commands

Run `graphqlx --help` to get general help or `graphqlx <command> --help` to get help about a particular command.

## Merge multiple GraphQL schemas

It's often useful if you need sanity, to break down large schemas into multiple files. The `merge` command merges the files back together into a single schema. The following command outputs the merged schema to stdout:

```bash
graphqlx merge tests/resources/schema1.graphql tests/resources/schema2.graphql
```

Some graphql vendors want comments formatted a certain way (I'm looking at you AWS). So you can use the `--style` option to format comments appropriately.

```bash
graphqlx merge --style appsync tests/resources/schema1.graphql tests/resources/schema2.graphql
```

## Syntax check a GraphQL schema

The `syntax` command simply checks that the content of the file is well formatted. It does not try to check that any of the types are valid, etc...

```bash
graphqlx syntax tests/resources/type.graphql tests/resources/type-invalid.graphql
```

will output something like:

```
- tests/resources/type.graphql: OK
- tests/resources/type-invalid.graphql: ERROR
invalid syntax at line 3 col 25:

    variable(): Date! What's this doing here?
```

The `syntax` command will exit with code 1 is any error was found, 0 otherwise. This can be useful for CI.


