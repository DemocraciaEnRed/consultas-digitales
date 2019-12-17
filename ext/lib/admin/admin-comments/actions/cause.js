import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Cause extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let { topic } = this.props
    return (
        <div className="alert alert-warning text-center">
          <b>{topic.action.count}</b> participantes brindaron su apoyo ♥
        </div>
    )
  }
}