#Component Mapper

> blah


## Utils

### Configure Object

```
ConfigureObject = { type, key, ...props}

ArrayConfigObject = { type = 'list', values, ...props }

MasterConfig = { [FINAL_KEY]: ConfigureObject | ArrayConfigObject }

ConfigureObject: MasterConfig -> Object -> Object
```

_**ConfigureObject:**_

- `type` key is the string to tell the function how to handle your request
- Anything else besides `key` will be copied over flat

_**ArrayConfigObject:**_

- `type` is `'list'`
- `values` is an array of `ConfigureObject`s

_**MasterConfig:**_

- `string` keys that correspond to the target object's keys
- Each key will be processed through the `type`
