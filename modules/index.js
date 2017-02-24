const utils = require('./utils.js')
const React = require('react');

const configuredWith = (configuration, Wrapped, ...passedProps) => class extends React.Component {
  configureData = utils.configureObject(configuration)
  render(){
    return (
      <Wrapped
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
