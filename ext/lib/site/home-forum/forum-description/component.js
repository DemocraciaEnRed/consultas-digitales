import React, { Component } from 'react'

export default class extends Component {
  render () {
    let { content } = this.props
    content = content.replace(/<a/g, '<a rel="noopener noreferer" target="_blank"')

    return (
      <div className='container forum-description'>
        <div className='row'>
          <div
            className={`col-md-8 offset-md-2 content`}
            ref='content'
            dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    )
  }
}