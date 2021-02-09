# [1.9.0](https://github.com/mprivat/xgql/compare/v1.8.1...v1.9.0) (2021-01-15)


### Features

* fixed schemaless introspection ([7d42985](https://github.com/mprivat/xgql/commit/7d429854cc2964e62994c455987a83d24af4352b))

## [1.8.1](https://github.com/mprivat/xgql/compare/v1.8.0...v1.8.1) (2021-01-15)


### Bug Fixes

* fixed single-entry enums ([31e8c66](https://github.com/mprivat/xgql/commit/31e8c66f567864672fc960437123603f2634df68))

# [1.8.0](https://github.com/mprivat/xgql/compare/v1.7.1...v1.8.0) (2020-12-10)


### Features

* fix version ([e939ba9](https://github.com/mprivat/xgql/commit/e939ba9b70bb461fe0fb2f60ad74c982c3c224d7))

## [1.7.1](https://github.com/mprivat/xgql/compare/v1.7.0...v1.7.1) (2020-12-03)


### Bug Fixes

* set kind to NON_NULL in introspection when not nullable ([b6e4651](https://github.com/mprivat/xgql/commit/b6e46516c613cfec543996e06f7a367f28c32242))

# [1.7.0](https://github.com/mprivat/xgql/compare/v1.6.1...v1.7.0) (2020-09-18)


### Features

* added built-in scalars ([c21f553](https://github.com/mprivat/xgql/commit/c21f553ff75576bfbed153d5aa494ebf1ba9598a))

## [1.6.1](https://github.com/mprivat/xgql/compare/v1.6.0...v1.6.1) (2020-09-18)


### Bug Fixes

* fixed type reference in introspection ([9a0da9f](https://github.com/mprivat/xgql/commit/9a0da9f2099f911eb3d8e9ae44eb861e37b09f69))

# [1.6.0](https://github.com/mprivat/xgql/compare/v1.5.0...v1.6.0) (2020-09-16)


### Features

* added support for unions ([dbb02a9](https://github.com/mprivat/xgql/commit/dbb02a93710e036a25ecdd3792149de1eb89edbd))

# [1.5.0](https://github.com/mprivat/xgql/compare/v1.4.0...v1.5.0) (2020-09-16)


### Bug Fixes

* muted enum values for appsync ([170f6bd](https://github.com/mprivat/xgql/commit/170f6bdc8405f0c0a32f611d1bded928959c163e))


### Features

* added basic introspection query ([2e880f3](https://github.com/mprivat/xgql/commit/2e880f3debbeaa5ff5034ab890a79f8415ee0928))

# [1.4.0](https://github.com/mprivat/xgql/compare/v1.3.0...v1.4.0) (2020-09-16)


### Bug Fixes

* added missing file ([6440827](https://github.com/mprivat/xgql/commit/64408272475c80c4e9f4615ca954c454a99d2e7c))


### Features

* started introspection export ([1ade71b](https://github.com/mprivat/xgql/commit/1ade71b86778d0bfd9f398c35a2940e237a856df))

# [1.3.0](https://github.com/mprivat/xgql/compare/v1.2.1...v1.3.0) (2020-09-15)


### Bug Fixes

* converted paths to absolute for uniqueness ([8b9859a](https://github.com/mprivat/xgql/commit/8b9859a26f64498933cdd232e5ec763ab43283ca))


### Features

* added output option for merge ([c4ba04f](https://github.com/mprivat/xgql/commit/c4ba04f8b59fa3fcb312844d8ffb952f2d2117ea))

## [1.2.1](https://github.com/mprivat/xgql/compare/v1.2.0...v1.2.1) (2020-09-15)


### Bug Fixes

* insert inherited fields in the front ([150c77b](https://github.com/mprivat/xgql/commit/150c77bffffc555e60cf1cc3406665d51d438c89))

# [1.2.0](https://github.com/mprivat/xgql/compare/v1.1.1...v1.2.0) (2020-09-14)


### Features

* auto-fill interface fields ([bb4d5a1](https://github.com/mprivat/xgql/commit/bb4d5a12bc867be676fe53b4bd32d4677c60874a))

## [1.1.1](https://github.com/mprivat/xgql/compare/v1.1.0...v1.1.1) (2020-09-14)


### Bug Fixes

* bumped release ([c7e574b](https://github.com/mprivat/xgql/commit/c7e574b51155d50f29b51663ec2fbf27e3076b8b))

# [1.1.0](https://github.com/mprivat/xgql/compare/v1.0.0...v1.1.0) (2020-09-14)


### Features

* renamed subcommands to line up with the lib name ([12353b6](https://github.com/mprivat/xgql/commit/12353b62702b00ea937b3a4e83518d455d653f4a))

# 1.0.0 (2020-09-14)


### Bug Fixes

* added exit code for validate ([4540d88](https://github.com/mprivat/graphqlx/commit/4540d88b4ed1729ac2912e5da099764a6adb2424))
* added lexer context ([d8ce421](https://github.com/mprivat/graphqlx/commit/d8ce42139cbdc50b7104c99567077f3b81984945))
* added support for directives ([dbe1d13](https://github.com/mprivat/graphqlx/commit/dbe1d137b8d471b2d695cbbfc4c5b691bc245eaa))
* clean up ([64ef6ad](https://github.com/mprivat/graphqlx/commit/64ef6ad86ad09bb9c3dc1629da6a5c1187903221))
* initial setup ([75e653b](https://github.com/mprivat/graphqlx/commit/75e653b6d5515335b8d11d2e194374f3187ec025))
* renamed grammar non-terminals to match specs ([8a33243](https://github.com/mprivat/graphqlx/commit/8a33243f54b8557b8a327d3c4bcf311ef2840338))
* renamed validate to syntax ([3aca887](https://github.com/mprivat/graphqlx/commit/3aca887dc28dec4909330fb6c0df744d70041760))
* started reverse transform ([ee7f2e1](https://github.com/mprivat/graphqlx/commit/ee7f2e1550beb5768ad50c88f1b2a481f7181161))


### Features

* added json to sdl conversion ([f4308ec](https://github.com/mprivat/graphqlx/commit/f4308ec295565bba1c3631b0683471a63718b7db))
* added merge command ([c56e3bc](https://github.com/mprivat/graphqlx/commit/c56e3bcbb103f2820e6296fda1beca399c161c41))
* added type definitions ([d41a628](https://github.com/mprivat/graphqlx/commit/d41a6289ba9e6bfe3ef8c04c4fa2252f777b1219))
