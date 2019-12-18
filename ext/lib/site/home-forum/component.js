import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Link } from 'react-router'
import Jump from 'jump.js'
import urlBuilder from 'lib/backend/url-builder'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import Footer from 'ext/lib/site/footer/component'
import TopicCard from 'ext/lib/site/cards-slider/topic-card/component'
import ForumDescription from './forum-description/component'
import ForumStat from './forum-stats/component'

export default class HomeForum extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: []
    }
  }

  componentDidMount () {
    const name = this.props.params.forum
    forumStore.findOneByName(name)
      .then((forum) => {
        this.setState({ forum })

        return Promise.all([
          forum,
          topicStore.findAll({ forum: forum.id })
        ])
      })
      .then(([forum, [ topics, pagination ]]) => {
        // ordenamos topics por abiertos y cerrados, y por fechas de cierre
        // mismo sort utilizado en cards-slider
        topics = topics.sort((a,b) => {  
          // si uno está abierto y el otro cerrado, ordenar por abierto
          if (a.closed && !b.closed)
            return 1
          if (!a.closed && b.closed)
            return -1  
          //// si los dos están abiertos o los dos cerrados
          // si los dos tienen fecha de cierre, ordenar por eso
          if (a.closingAt && b.closingAt)
            if (a.closed && b.closed)
              return new Date(a.closingAt) < new Date(b.closingAt) ? 1 : -1     
            if (!a.closed && !b.closed)
              return new Date(a.closingAt) > new Date(b.closingAt) ? 1 : -1    
          // si alguno tiene fecha de cierre, poner último
          if (a.closingAt)
            return 1
          if (b.closingAt)
            return -1
          // finalmente, si nada de lo anterior se cumple, ordenar por fecha de publicación
          return new Date(a.publishedAt) < new Date(b.publishedAt) ? 1 : -1
        })
        this.setState({
          forum,
          topics
        })
      })
      .catch((err) => {
        if (err.status === 404) browserHistory.push('/404')
        if (err.status === 401) browserHistory.push('/401')
        throw err
      })
  }

  handleScroll = () => {
    Jump('#anchor', { offset: -40 })
  }

  handleCargarPropuesta = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.state.forum.name
    })
  }

  render () {
    if (!this.state.forum) return null

    const { forum } = this.state

    let author = null
    if (forum.extra.owner) {
      let authorName
      if (forum.extra.ownerUrl) {
        authorName = (
          <a
            href={forum.extra.ownerUrl}
            target='_blank'
            rel='noopener noreferrer'>
            {forum.extra.owner}
          </a>
        )
      } else {
        authorName = forum.extra.owner
      }
      author = <span>{ authorName }</span>
    }
    
    const isClosed = forum.extra.closingAt && new Date(forum.extra.closingAt) < new Date()
    
    const tipoConsulta = forum.extra.contentType === 'llamado' && 'convocatoria' || 'consulta'
    
    return (
      <div className='ext-forum-home'>
        <section
          className='cover jumbotron'
          style={(forum.coverUrl && {
            backgroundImage: 'linear-gradient(rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url("' + forum.coverUrl + '")'
          }) || null}>
          <div className='jumbotron_bar'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12'>
                  <ol className='breadcrumb'>
                    <li className='breadcrumb-item'>
                      <Link to='/'>Consultas</Link>
                    </li>
                    <li className='breadcrumb-item active'>
                      <span>{forum.title}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className='jumbotron_body'>
            <div className='container'>
              <h1>{forum.title}</h1>
              { (forum.extra.contentType === 'ejes' || forum.extra.contentType === undefined) &&
              <a
                className='btn btn-primary'
                onClick={this.handleScroll} >
                Elegí un eje y participá
              </a>
              }
              { forum.extra.contentType === 'propuestas' && 
                <a
                  className='btn btn-primary'
                  onClick={this.handleScroll} >
                  Mirá las propuestas y participá
                </a>
              }
              { forum.extra.contentType === 'llamado' && 
                <a
                  className='btn btn-primary'
                  onClick={this.handleScroll} >
                   { !isClosed && 'Proponé' || 'Conocé las propuestas' }
                </a>
              }
            </div>
          </div>
        </section>
        { (forum.extra && forum.extra.owner) &&
          <div className='container'>
            <div className='row'>
              <div className='col-md-8 offset-md-2 autor-container'>
                <span>
                  <strong>Autor:</strong>
                </span>
                { author }
              </div>
            </div>
          </div>
        }
        { isClosed && 
          <div className='container forum-description'>
            <div className='row'>
              <div className='col-md-8 offset-md-2'>
                <div className="consulta-cerrada">
                  <img className="lock-icon" src='/ext/lib/boot/lock.png' />
                  <h5>La {tipoConsulta} se encuentra cerrada</h5>
                  {forum.extra.palabrasCierre && 
                    <p>{forum.extra.palabrasCierre}</p>
                  }
                  {forum.extra.linkCierre && 
                    <a
                      className='btn btn-primary btn-informe-cierre'
                      target='_blank'
                      rel='noopener noreferrer'
                      href={forum.extra.linkCierre} >
                      Ver informe de cierre
                    </a>
                  }
                  <p>La {tipoConsulta} ya no está abierta a votaciones o aportes.</p>
                </div>
              </div>
            </div>
          </div>
        }
        { (forum.extra && forum.extra.richSummary) ?
          <ForumDescription content={forum.extra.richSummary} />
        :
          <div className='container summary-container'>
            {forum.summary}
          </div>
        }
        { !isClosed && forum.extra.contentType === 'llamado' && 
         <div className='container cargar-propuesta' id='anchor'>
          <a
            className='btn btn-primary'
            onClick={this.handleCargarPropuesta} >
            Subí tu propuesta
          </a>
         </div>
        }
        <ForumStat forum={forum}/>
        <div className='container topics-container' >
          {this.state.topics.length > 0 && (forum.extra.contentType === 'ejes' || forum.extra.contentType === undefined) &&
            <h5 id='anchor'>{`${this.state.topics.length} ${this.state.topics.length > 1 ? 'ejes comprenden' : 'eje comprende'} esta consulta`}</h5>
          }
          {this.state.topics.length > 0 && forum.extra.contentType === 'propuestas' &&
            <h5 id='anchor'>{`${this.state.topics.length} ${this.state.topics.length > 1 ? 'propuestas comprenden' : 'propuesta comprende'} esta consulta`}</h5>
          }
          {this.state.topics.length > 0 && forum.extra.contentType === 'llamado' &&
            <h5 id={!isClosed && forum.extra.contentType === 'llamado' ? '' : 'anchor'}>Hay {this.state.topics.length} propuestas en esta convocatoria</h5>
          }
          <div className='topics-card-wrapper'>
            {this.state.topics
              .map((topic) => <TopicCard key={topic.id} topic={topic} />)
            }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
