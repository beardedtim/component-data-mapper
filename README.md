#Component Mapper

> blah


## Utils

**Currently only `list`, `basic`, and `nested` types are supported. Soon I will refactor and make any reducer work**

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
