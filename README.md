# xgql

xgql is a GraphQL schema manipulation tool and extensions. The idea is to parse graphQL schemas and extend the grammar to support other nice things such as includes. This is a useful tool to include in your CI pipeline in order to assemble your schemas into a single file.

# Commands

Run `xgql --help` to get general help or `xgql <command> --help` to get help about a particular command.

## Merge multiple GraphQL schemas

It's often useful if you need sanity, to break down large schemas into multiple files. The `merge` command merges the files back together into a single schema. The following command outputs the merged schema to stdout:

```bash
xgql merge tests/resources/schema1.graphql tests/resources/schema2.graphql
```

Some graphql vendors want comments formatted a certain way (I'm looking at you AWS). So you can use the `--style` option to format comments appropriately. AppSync in particular does not like enum values to have a desription so they will get scrubbed.

```bash
xgql merge --style appsync tests/resources/schema1.graphql tests/resources/schema2.graphql
```

### Example

**schema1.graphql**

```graphql
type Person {
  id: ID!
  name: String!
  age: Int!
  dob: MyDate!
}

type Query {
  allPersons(last: Int): [Person!]!
}

type Mutation {
  createPerson(name: String!, age: Int!): Person!
}

type Subscription {
  newPerson: Person!
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

**schema2.graphql**

```graphql
"""
Custom definition of a date
"""
scalar MyDate

type Post {
  id: ID!
  title: String!
  author: Person!
}

input PostInput {
  title: String!
  author: Person!
}

type Query {
  # Lists all posts
  allPosts(title: String!): [Post!]!
}

type Mutation {
  """
  Creates a new post
  """
  createPost(post: PostInput!): Post!
}
```

Results in:

```graphql
schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
}

type Person {
    id: ID!
    name: String!
    age: Int!
    dob: MyDate!
}

input PostInput {
    title: String!
    author: Person!
}

type Post {
    id: ID!
    title: String!
    author: Person!
}

"""
Custom definition of a date
"""
scalar MyDate

type Subscription {
    newPerson: Person!
}

type Mutation {
    createPerson(
        name: String!
        age: Int!
    ): Person!
    """
    Creates a new post
    """
    createPost(
        post: PostInput!
    ): Post!
}

type Query {
    allPersons(
        last: Int
    ): [Person!]!
    """
    Lists all posts
    """
    allPosts(
        title: String!
    ): [Post!]!
}
```

### The --fill option

If the --fill option is set, `xgql` will automatically add missing fields from interfaces inherited by a type. Example:

```graphql
interface Person {
  id: ID!
  first_name: String
  last_name: String!
}

type Employee implements Person {
  employee_id: String!
}
```

becomes:

```graphql
interface Person {
    id: ID!
    first_name: String
    last_name: String!
}

type Employee implements Person {
    employee_id: String!
    id: ID!
    first_name: String
    last_name: String!
}
```

## Syntax [check](check) a GraphQL schema

The `syntax` command simply checks that the content of the file is well formatted. It does not try to check that any of the types are valid, etc...

```bash
xgql syntax tests/resources/type.graphql tests/resources/type-invalid.graphql
```

will output something like:

```
- tests/resources/type.graphql: OK
- tests/resources/type-invalid.graphql: ERROR
invalid syntax at line 3 col 25:

    variable(): Date! What's this doing here?
```

The `syntax` command will exit with code 1 is any error was found, 0 otherwise. This can be useful for CI.

## Introspection query

The `introspect` command simulates running a basic introspection query against the schema. It produces a value instrospection JSON from the schema file.

```bash
xgql introspect schema.graphql
```


