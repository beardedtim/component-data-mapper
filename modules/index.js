const utils = require('./utils.js')
const { defaultActions, configureFromTypes } = utils
const React = require('react');

const configuredWith = ({
  configuration,
  Component,
  actions = defaultActions,
  ...passedProps
}) => class extends React.Component {
  configureData = configureFromTypes(actions)(configuration)
  render(){
    return (
      <Component
        {...this.configureData(this.props)}
        {...passedProps}
      />
    )
  }
}

module.exports = {
  utils,
  configuredWith,
}
