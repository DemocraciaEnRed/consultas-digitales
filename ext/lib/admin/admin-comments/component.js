import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'
import ForumTable from './forum-table'
import TopicTable from './topic-table'

export default class AdminComments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFetching: true,
      topics: [],
      comments: [],
      error: '',
      admins: [],
      availableAdmins: [],
      availableRoles: ['owner','admin','collaborator','author','participant','moderator'],
      officialRoles: ['owner','admin','collaborator','author','moderator'],
      availableMarks: ['Destacado','Derivar','No aplica','Alerta','Pregunta'],
      notifyChange: false,
      notifyMessage: ''
    }
    this.toggleNotifyChanges = this.toggleNotifyChanges.bind(this);
    this.showNotifyChanges = this.showNotifyChanges.bind(this);
    this.updateAll = this.updateAll.bind(this);

  }

  componentDidMount () {
    this.fetchTopics()
  }

  updateAll(){
    this.setState( (state) => ({
      isFetching: true
    }), () => {
      this.fetchTopics()
    })
  }

  toggleNotifyChanges() {
    this.setState( (state) => ({
      notifyChange: !state.notifyChange
    }))
  }

  showNotifyChanges(msg) {
    setTimeout( () => {
      this.setState( (state) => ({
      notifyChange: false
      })
      )
    },3000)
    this.setState( (state) => ({
      notifyMessage: msg,
      notifyChange: true
    }))
  }

  fetchTopics () {
    fetch('/api/v2/topics?forum=' + this.props.forum.id, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.ok && res.json())
      .then(topics => {
        if (!topics.results.topics) return console.log('no topics')
        this.setState({topics: topics.results.topics, error: ''}, () => {
          this.fetchCommentsTopics()
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({error: 'fetch topics error'})
      })
  }

  fetchCommentsTopics () {
    // if(this.state.topics.length === 0) return
    let promisesArr = this.state.topics.map( topic => {
      return fetch('/ext/api/admin-stats/comments?topicId=' + topic.id, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
    })
    let topicKeys = this.state.topics.map( topic => {
      return topic.id
    })
    Promise.all(promisesArr)
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(responses => {
        let comments = {}
        responses.forEach((res,index) => {
          comments[topicKeys[index]] = res.results.comments
        });
        this.setState({
          comments: comments
        }, () => {
          this.fetchOtherAdmins()
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({error: 'fetch comments error'})
      })
  }

  fetchOtherAdmins () {
    fetch(`/ext/api/admin-stats/forum/${this.props.forum.id}/permissions`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.ok && res.json())
      .then(res => {
        if (!res) return console.log('no admins')
        let admins = res.filter(a => {
          return this.state.officialRoles.includes(a.role)
        })
        let isOwnerIncluded = admins.find( a => {
          return a.user._id == this.props.forum.owner.id
        })
        if(!isOwnerIncluded) {
          let owner = this.props.forum.owner
          owner._id = this.props.forum.owner.id
          admins.push({
            role: 'owner',
            user: owner
          })
        }
        this.setState({
          availableAdmins: res,
          admins: admins,
          isFetching: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({error: 'fetch admins error'})
      })
  }
  

  render() {
    let { forum } = this.props
    let { isFetching, topics, comments, admins , officialRoles, notifyMessage, notifyChange, availableMarks } = this.state
    return (
      <div className="comments-admin">
       <a href={urlBuilder.for('admin.comments.csv', { forum: forum.name })}
            className='btn btn-primary btn-sm'>
            Comentarios - { t('admin-comments.dowload-as-csv') }
          </a>
        {
          isFetching ? 
          <div className="well well-sm">
            Cargando...
          </div>
          : (
            <div>
              <ForumTable forum={forum} topics={topics} comments={comments} admins={admins} availableMarks={availableMarks} />
              {
                topics.map(t => 
                <TopicTable forum={forum} topic={t} comments={comments[t.id]} admins={admins} showNotifyChanges={this.showNotifyChanges} updateAll={this.updateAll} availableMarks={availableMarks}/>                
                )
              }
            </div>
          )
        }
        {
          notifyChange &&
        <div className="notify-change">
        <button className="btn btn-primary btn-xs pull-right" onClick={this.toggleNotifyChanges}>Cerrar</button>
        {notifyMessage}
        </div>
        }
      </div>
    )
  }
}