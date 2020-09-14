# graphqlx

graphqlx is a GraphQL schema manipulation tool and extensions. The idea is to parse graphQL schemas and extend the grammar to support other nice things such as includes. This is a useful tool to include in your CI pipeline in order to assemble your schemas into a single file.

# Commands

Run `graphqlx --help` to get general help or `graphqlx <command> --help` to get help about a particular command.

# Validate a GraphQL schema

```bash
graphqlx validate tests/resources/type.graphql tests/resources/type-invalid.graphql
```

will output something like:

```bash
tests/resources/type.graphql: OK
tests/resources/type-invalid.graphql: ERROR
invalid syntax at line 3 col 25:

    variable(): Date! What's this doing here?
```
