import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import bus from 'bus'
import forumStore from 'lib/frontend/stores/forum-store/forum-store'
import topicStore from 'lib/frontend/stores/topic-store/topic-store'
import userConnector from 'lib/frontend/site/connectors/user'
import TopicArticle from './topic-article/component'
import Carrusel from 'ext/lib/site/cards-slider/component'
import Footer from 'ext/lib/site/footer/component'

class TopicLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      forum: null,
      topic: null
    }
  }

  componentDidMount () {
    bus.on(`topic-store:update:${this.props.params.id}`, (topic) => {
      this.setState({ topic })
    })

    Promise.all([
      forumStore.findOneByName(this.props.params.forum),
      topicStore.findOne(this.props.params.id)
    ]).then(([forum, topic]) => {
      
      if (forum.extra && forum.extra.contentType == 'llamado')
        topic.closingAt = forum.extra.closingAt
      
      this.setState({ forum, topic })
      
    }).catch((err) => {
      if (err.status === 404) return browserHistory.push('/404')
      throw err
    })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      topicStore.findOne(this.props.params.id)
      .then((topic) => this.setState({ topic: topic }, () => window.scrollTo(0, 500)))
    }
  }

  componentWillUnmount () {
    bus.off(`topic-store:update:${this.props.params.id}`)
  }

  render () {
    const { forum, topic } = this.state

    if (!forum || !topic) return null

    return (
      <div className='ext-topic-layout'>
        <section
          className='jumbotron jumboarticle'
          style={{
            backgroundImage: `url("${topicStore.getCoverUrl(topic)}")`
          }}>
          <div className='jumbotron_bar'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12'>
                  <ol className='breadcrumb'>
                    <li className='breadcrumb-item'>
                      <Link to='/'>Consultas</Link>
                    </li>
                    <li className='breadcrumb-item'>
                      <Link to={forum.url}>{forum.title}</Link>
                    </li>
                    <li className='breadcrumb-item active'>
                      <span>{topic.mediaTitle}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
        {this.state.forum && this.state.topic && (
          <TopicArticle topic={this.state.topic} forum={this.state.forum} />
        )}
        {this.state.forum && this.state.topic && (
          <div className='seccion-proyectos container-fluid'>
            <Carrusel
              forum={this.state.forum}
              topic={this.state.topic} />
          </div>
        )}
        <Footer />
      </div>
    )
  }
}

export default userConnector(TopicLayout)