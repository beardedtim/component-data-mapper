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

ArrayConfigObject = { type = 'list', values, ...props }

MasterConfig = { [FINAL_KEY]: ConfigureObject | ArrayConfigObject }

configureObject: MasterConfig -> Object -> Object
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


## configuredWith

This method takes two arguments: `configurationObject` and a `React Component`. It returns the component wrapped and transforms any props given to it using the configurationObject. For a basic prop that we want to transform, we can use `list` or `basic`. If the prop is an object and we want to change those values as well, we have a `nested` type that we can use. To use the `nested` type, you must have the nested configuration object under the `value` for the main key. Example:

I have `document` coming in as a prop to the component I want to configure. I want to configure the `document` keys and values using this function. This is what my `configurationObject` would look like:

```
{
  document: {
    type: 'nested',
    key: 'document',
    value: {
      id: {
        type: 'basic',
        key: 'docId'
      }
    }
  }
}
```

And if I was given this as props:

```
{
  document: {
    docId: 1
  }
}
```

I would get passed to the wrapped component this:

```
{
  document: {
    id: {
      value: 1,
    }
  }
}
```

And we can use this like so:

```
import { configuredWith } from '@beardedtim/component-data-mapper'

const DEMO = ({ document }) => {
  const { id: {value: id}, title: {value: title} } = document;
  return (
    <div>I have the id of {id} and title of {title}</h2>
  )

}
const Configured = configuredWith(
  {
     document: {
       key: 'document',
       type: 'nested',
       value: {
         id: {
           key: 'docType'
         },
         title: {
           key: 'title'
         }
       }
     }
  },
  DEMO
)
<Configured document={{id: 1, title: 'A title!'}}/>
// <div>I have the id of 1 and title of 'A title!'</h2>
```
