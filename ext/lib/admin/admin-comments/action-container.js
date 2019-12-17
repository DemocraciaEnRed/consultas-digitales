import React, { Component } from 'react'
import { Link } from 'react-router'

import Vote from './actions/vote'
import Poll from './actions/poll'
import Cause from './actions/cause'
import Slider from './actions/slider'
import Hierarchy from './actions/hierarchy'

export default class ActionContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topicCopy: this.props.topic,
      shrinked: true,
    }
    this.toggleShrink = this.toggleShrink.bind(this);
  }

  componentWillMount() {
    this.state.topicCopy.closed = true
  }

  toggleShrink() {
    this.setState((state) => ({
      shrinked: !state.shrinked
    }))
  }

  render() {
    let { topicCopy, shrinked } = this.state
    return (
      <div className="action-topic-container">
        {
          !shrinked &&
          <div>
            {(() => {
              switch (topicCopy.action.method) {
                case 'vote':
                  return <Vote topic={topicCopy}/>
                case 'poll':
                  return <Poll topic={topicCopy} />
                case 'cause':
                  return <Cause topic={topicCopy} />
                case 'slider':
                  return <Slider topic={topicCopy} />
                case 'hierarchy':
                  return <Hierarchy topic={topicCopy} />
              }
            })()}
          </div>
        }
        <div>
          {
            shrinked ?
              <h5 className="toggle-title text-primary" onClick={this.toggleShrink}>▼ Mostrar los resultados ▼</h5>
              : <h5 className="toggle-title text-primary" onClick={this.toggleShrink}>▲ Ocultar los resultados ▲</h5>
          }
        </div>
      </div>
    )
  }
}