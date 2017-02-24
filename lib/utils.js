'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('ramda'),
    curry = _require.curry;

/**
 * Maps data from one object to another, passing props
 *
 * @param {Object} configuration - { key, ...props} - the key we want data from
 * @param {Object} data - the object we want data from.
 * @return {Object} { value, ...props}
 */
var handleObjectValue = curry(function (_ref, data) {
  var key = _ref.key,
      type = _ref.type,
      props = _objectWithoutProperties(_ref, ['key', 'type']);

  return data.hasOwnProperty(key) ? _extends({ value: data[key] }, props) : _extends({ value: null }, props);
});

/**
 * Maps multiple keys to a single array, passing props
 *
 * @param {Object} configuration -
 *            { values: [ {key, ...props} ] } - list of keys we want data from
 *
 * @param {Object} data - the object we want data from.
 * @return {Array} [ { value, ...props } ]
 */
var handleArrayValue = curry(function (_ref2, data) {
  var values = _ref2.values;
  return values.map(function (obj) {
    return handleObjectValue(obj, data);
  });
});

/**
 * Shallow copies data from the input object
 *
 * @param {Object} config - { key } - no props carried
 * @param {Object} data - the object to grab values from
 * @return {*} - value from data at given key
 */
var handleFlatValue = curry(function (_ref3, data) {
  var key = _ref3.key;
  return data[key];
});

/**
 * Takes a MasterConfig object and returns a configured object
 *
 * @param {MasterConfig} config - A config object whose keys are the desired keys
 * @param {Object} data - The object we want to get data from
 * @return {Object} - An object of the same structure as config with data from data
 */
var configureFromTypes = curry(function (types, config, data) {
  // Let's get the keys
  var finalKeys = Object.keys(config);
  // Now go over each of the keys, building our final object
  return finalKeys.reduce(function (final, k) {
    // And grab the type at this key
    var type = config[k].type;
    // Find out if we have a way to handle that type/action

    var typeIndex = types.map(function (_ref4) {
      var t = _ref4.type;
      return t;
    }).findIndex(function (t) {
      return ~type.indexOf(t);
    });
    if (~typeIndex) {
      // If we do, grab the method
      var method = types[typeIndex].method;
      // And set the key to the result of the 'reducer' function

      final[k] = method.call(null, config[k], data, config);
    } else {
      // If we don't know how to handle it, just set it whatever data is
      final[k] = {
        value: data[k]
      };
    }
    return final;
  }, {});
});

/**
 * Our 'reducers'
 */
var TYPES = [{
  type: 'basic',
  method: handleObjectValue
}, {
  type: 'list',
  method: handleArrayValue
}, {
  type: 'nested',
  method: function method(currentConfig, input, fullConfig) {
    var value = currentConfig.value,
        key = currentConfig.key;

    return configureFromTypes(TYPES)(value, input[key]);
  }
}, {
  type: 'flat',
  method: handleFlatValue
}];

var configureObject = configureFromTypes(TYPES);

module.exports = {
  defaultActions: TYPES,
  configureFromTypes: configureFromTypes,
  configureObject: configureObject,
  handleArrayValue: handleArrayValue,
  handleObjectValue: handleObjectValue,
  handleFlatValue: handleFlatValue
};