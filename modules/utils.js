// @flow
const { curry } = require('ramda')

interface TransformedObject {
  value: *
}

interface ConfigureObject {
  key: string,
  type: string
}

interface ArrayConfigObject {
  values: Array<ConfigureObject>,
  type: string
}

interface MasterConfig  {
  [string]: ConfigureObject | ArrayConfigObject
}

/**
 * Maps data from one object to another, passing props
 *
 * @param {Object} configuration - { key, ...props} - the key we want data from
 * @param {Object} data - the object we want data from.
 * @return {Object} { value, ...props}
 */
const handleObjectValue = curry(({key, type, ...props}: ConfigureObject , data: Object): TransformedObject =>
	data.hasOwnProperty(key)
		? ({ value: data[key], ...props })
		: ({ value: null, ...props }))

/**
 * Maps multiple keys to a single array, passing props
 *
 * @param {Object} configuration -
 *            { values: [ {key, ...props} ] } - list of keys we want data from
 *
 * @param {Object} data - the object we want data from.
 * @return {Array} [ { value, ...props } ]
 */
const handleArrayValue = curry(({ values }: ArrayConfigObject, data: Object): Array<TransformedObject> =>
  values
	.map((obj) => handleObjectValue(obj,data)))

/**
 * Our 'reducers'
 */
const TYPES = [
  {
    type: 'basic',
    method: handleObjectValue
  },
  {
    type: 'list',
    method: handleArrayValue
  }
];

/**
 * Takes a MasterConfig object and returns a configured object
 *
 * @param {MasterConfig} config - A config object whose keys are the desired keys
 * @param {Object} data - The object we want to get data from
 * @return {Object} - An object of the same structure as config with data from data
 */
const configureObject = curry((config: MasterConfig, data: Object): Object => {
  // Let's get the keys
	const finalKeys = Object.keys(config)
  // Now go over each of the keys, building our final object
  return finalKeys.reduce((final, k) => {
    // And grab the type at this key
    const { type } = config[k]
    // Find out if we have a way to handle that type/action
    const typeIndex = TYPES.map(({ type: t }) => t).findIndex(t => ~type.indexOf(t))
    if (~typeIndex) {
      // If we do, grab the method
      const { method } = TYPES[typeIndex]
      // And set the key to the result of the 'reducer' function
      final[k] = method.call(null, config[k], data)
    } else {
      // If we don't know how to handle it, just set it whatever data is
      final[k] = {
        value: data[k]
      }
    }
    return final
  }, {})
})

module.exports = {
  configureObject,
  handleArrayValue,
  handleObjectValue
}
