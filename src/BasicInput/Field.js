import React, { Component } from 'react';

class FieldComponent extends Component {
  state = {
    value: this.props.value,
    error: false
  }  
  componentWillReceiveProps(update) {
    this.setState({ value: update.value });
  }
  onChange = (evt) => {
    const { name, validate } = this.props    
    const value = evt.target.value
    const error = validate ? validate(value) : false
    this.setState({ value, error })

    this.props.onChange({ name, value, error })
  }
  render() {
    return (
      <div>
        <input
          placeholder={this.props.placeholder}
          value = {this.state.value}
          onChange={this.onChange}
          type={this.props.type ? this.props.type : null}
        />
        <span style={{ color: 'red' }}>{this.state.error}</span>
      </div>
    )
  }
}

export default FieldComponent;