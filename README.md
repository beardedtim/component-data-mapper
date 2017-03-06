#Component Mapper

> blah


## Utils


### Common Errors

If you get `TypeError: Cannot read property 'indexOf' of undefined` it is probably because you don't have your `config` object set correctly. A correctly set `config` object will have as its root keys, keys that match the desired output object. Each key on the `config` object **MUST** have at least 2 keys: `type` and `key`. `type` tells the function how to handle the value and `key` tells the function where on the `data` object we want to get the value from.

### configureFromTypes

This is a way to pass in custom `types` to the configuration function. This must be an array of objects with the schema `{ type: 'some type', method: function }`

The `method` will be called with the following arguments:

```
method.call(null, config[k], data, config)
```

- `config[k]` is the value at the current `config` key. `k` corresponds with the final key/root key from the `config` object.
- `data` is the whole object we are configuring.
- `config` is the whole `configuration` object in case the method needs to know something special about the configuration.

Whatever this method returns will be set on the final object at the key corresponding to `k` in the above.

### configureObject

This has the default types of `list`, `basic`, `nested`, and `flat`. You can look in `./modules/utils.js` to see what those methods are. This is a curried version of `configureFromTypes`.

```
ConfigureObject = { type, key, ...props}

ArrayConfigObject = { type = 'list', value, ...props }

NestedConfigObject = { type = 'nested', value, ...props }

MasterConfig = { [FINAL_KEY]: ConfigureObject | ArrayConfigObject }

configureObject: MasterConfig -> Object -> Object
```

_**ConfigureObject:**_

- `type` key is the string to tell the function how to handle your request
- Anything else besides `key` will be copied over flat

_**ArrayConfigObject:**_

- `type` is `'list'`
- `value` is an array of `ConfigureObject`s

_**MasterConfig:**_

- `string` keys that correspond to the target object's keys
- Each key will be processed through the `type`

## Default Types

The following are the default types that come with `configureObject`:

* `list`: This config must be

```
{
  type: 'list',
  key: [KEY_ON_INCOMING_OBJECT],
  value: [
    {
      key: [KEY_ON_INCOMING_OBJECT],
      // ...passedProps
    }
  ]
}
```

  - `list` returns an array of `{ value, ...passedProps }`

* `flat`: This config must be:

```
{
  key: [KEY_ON_INCOMING_OBJECT],
  type: 'flat'
}
```

  - `flat` does not copy any props and just sets the value

* `nested`: This config must be

```
{
  key: [KEY_ON_INCOMING_OBJECT],
  type: 'nested',
  value: {
    // Config Object
  }
}
```

  - `nested` allows for custom nested values

* `basic`: This config must be:

```
{
  key: [KEY_ON_INCOMING_OBJECT],
  type: 'basic',
  // ...passedProps
}
```
  - `basic` returns values underneath the `value` key.

## Rules

* Every default type except for `flat` returns the mapped values under a `value` key in the newly created object.
* The key of the configuration is the desired final key:
  - Example: `{ name: { ... } }` as config would return `{ name: ... }` object.
* The `key` inside of the config, as in `{ key: 'abc' }`, is the key we are wanting to look for in the incoming object
