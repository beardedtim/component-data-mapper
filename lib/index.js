'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var utils = require('./utils.js');
var defaultActions = utils.defaultActions,
    configureFromTypes = utils.configureFromTypes;

var React = require('react');

var configuredWith = function configuredWith(_ref) {
  var configuration = _ref.configuration,
      Component = _ref.Component,
      _ref$actions = _ref.actions,
      actions = _ref$actions === undefined ? defaultActions : _ref$actions,
      passedProps = _objectWithoutProperties(_ref, ['configuration', 'Component', 'actions']);

  return function (_React$Component) {
    _inherits(_class2, _React$Component);

    function _class2() {
      var _temp, _this, _ret;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.configureData = configureFromTypes(actions)(configuration), _temp), _possibleConstructorReturn(_this, _ret);
    }

    _class2.prototype.render = function render() {
      return React.createElement(Component, _extends({}, this.configureData(this.props), passedProps));
    };

    return _class2;
  }(React.Component);
};

module.exports = {
  utils: utils,
  configuredWith: configuredWith
};