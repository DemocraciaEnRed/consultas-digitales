import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/backend/url-builder'
import userConnector from 'lib/frontend/site/connectors/user'

class CommentContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
     shrinked: true,
     showReply: false,
     answeredByOficial: false,
     textReply: null,
     flagedByOficial: false,
     meFlaggedIt: false,
    }
    this.recheck = this.recheck.bind(this);
    this.toggleShrink = this.toggleShrink.bind(this);
    this.toggleReply = this.toggleReply.bind(this);
    this.closeReply = this.closeReply.bind(this);
    this.checkIfAnswered = this.checkIfAnswered.bind(this);
    this.checkIfFlaged = this.checkIfFlaged.bind(this);
    this.submitReply = this.submitReply.bind(this);
    this.markFlag = this.markFlag.bind(this);
    this.unmarkFlag = this.unmarkFlag.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
    this.isOfficial = this.isOfficial.bind(this);
    this.didIFlaggedIt = this.didIFlaggedIt.bind(this);
    this.markComment = this.markComment.bind(this);
    this.unmarkComment = this.unmarkComment.bind(this);
  }
    
  componentDidMount(){
    this.checkIfAnswered()
    this.checkIfFlaged()
    this.didIFlaggedIt()
  }

  recheck(){
    this.checkIfAnswered()
    this.checkIfFlaged()
    this.didIFlaggedIt()
  }

  getClassNameContainer(){
    if(this.state.shrinked) return 'comment-container clearfix shrink'
    return 'comment-container clearfix'
  }

  toggleShrink() {
    this.setState((state) => ({
      shrinked: !state.shrinked
    }))
  }

  toggleReply(e) {
    e.preventDefault();
    this.setState((state) => ({
      shrinked: false,
      showReply: !state.showReply
    }))
  }
  closeReply(e) {
    this.setState((state) => ({
      showReply: false
    }))  
  }

  handleTextChange = (evt) => {
    const text = evt.currentTarget.value || ''
    this.setState({
      textReply: text
    })
  }

  submitReply(){
    fetch(`/api/v2/comments/${this.props.comment.id}/reply`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: this.state.textReply
        })
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges('Respuesta guardada')
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }

    markFlag(){
    fetch(`/api/v2/comments/${this.props.comment.id}/flag`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(res => {
        if(res.error && res.error.code === 'NO_AUTO_FLAG'){
          this.props.showNotifyChanges('No podes marcar tu propio comentario como Spam')
        } else {
        this.props.showNotifyChanges('Comentario marcado como Spam')
        this.props.updateAll()
        }
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }
    deleteComment(){
    fetch(`/api/v2/comments/${this.props.comment.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges('Comentario eliminado')
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }
    deleteReply(replyId){
    fetch(`/api/v2/comments/${this.props.comment.id}/replies/${replyId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges('Respuesta eliminada')
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }

    unmarkFlag(){
    fetch(`/api/v2/comments/${this.props.comment.id}/unflag`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges('Comentario dejo de marcarse como spam')
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }

  checkIfAnswered() {
    let answered = false
    this.props.admins.forEach(a => {
      if(a.user._id == this.props.comment.author.id) answered = true
    })
    if(!answered){
      let replyAuthorsId = this.props.comment.replies.map(reply => {
        return reply.author.id
      })
      this.props.admins.forEach(a => {
        if(replyAuthorsId.includes(a.user._id)) answered = true
      })
    }
    this.setState({
      answeredByOficial: answered
    })
  }

  checkIfFlaged() {
    let flaged = false
    let flaggersIds = this.props.comment.flags.map(flag => {
      return flag.author
    })
    this.props.admins.forEach(a => {
      if(flaggersIds.includes(a.user._id)) flaged = true
    })
    this.setState({
      flagedByOficial: flaged
    })
  }

  didIFlaggedIt() {
    let flaged = false
    let flaggersIds = this.props.comment.flags.map(flag => {
      return flag.author
    })
    if(flaggersIds.includes(this.props.user.state.value.id)){
      flaged = true
    }
    this.setState({
      meFlaggedIt: flaged
    })
  }

  isOfficial(author){
    return this.props.admins.find(a => {
      return a.user._id == author.id
    })
  }

markComment(mark){
    fetch(`/ext/api/admin-stats/comments/${this.props.comment.id}/mark`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mark: mark
        })
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges(`El comentario se marcó como ${mark}`)
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }
  unmarkComment(mark){
    fetch(`/ext/api/admin-stats/comments/${this.props.comment.id}/unmark`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mark: mark
        })
    }).then(res => res.ok && res.json())
      .then(res => {
        this.props.showNotifyChanges(`Se quitó el marcado #${mark} del comentario`)
        this.props.updateAll()
      })
      .catch(err => {
        console.error(err)
      })
    // url: `/api/v2/comments/${data.id}/reply`,
    //   method: 'POST',
    //   force: true,
    //   body: JSON.stringify({

    }


  render() {
    let { comment, user, availableMarks } = this.props
    return (
      <div>
      <div className={this.getClassNameContainer()}>
      
        <button className="btn btn-xs btn-toggle-shrink" onClick={this.toggleShrink}>
        { this.state.shrinked ? "▼" : "▲" }
        </button>
        <div className="overflow-effect" onClick={this.toggleShrink}></div>
        {
            this.state.showReply &&
          <div className="reply-comment-container">
            <textarea className="form-control" rows="3" onChange={this.handleTextChange} 
            maxLength='4096' minLength='1' placeholder="Escriba su respuesta..."></textarea>
            <button className="btn btn-xs btn-primary pull-right" onClick={this.submitReply}>Responder</button>
            <button className="btn btn-xs btn-default pull-left" onClick={this.closeReply}>X</button>
          </div>
          }
        <div className="media">
          <div className="media-left">
            <img
            className='the-avatar'
            src={comment.author.avatar}
            alt={comment.author.fullName}/>
          </div>
          <div className="media-body">
          <p className="comment-text"><b>{comment.author.displayName}</b>
          {
            this.isOfficial(comment.author) && <span className="text-primary"><b>&nbsp;&nbsp;★ Cuenta oficial</b></span>
          }
          &nbsp;&nbsp;
          {comment.text}</p>
          </div>
        </div>
          <div className="actions">
            <a className="anchor" onClick={this.toggleReply}>↵ Responder</a>
            {
              this.state.meFlaggedIt ?
               <a className="anchor" onClick={this.unmarkFlag}>⚑ Quitar spam</a>
               : <a className="anchor" onClick={this.markFlag}>⚑ Marcar como spam</a>

            }
            <a className="anchor" onClick={this.deleteComment}>✗ Eliminar</a>
          </div>
          {
            comment.replies.map( r => (
              <div className="reply-container">
                <p className="reply-text"><b>{r.author.displayName}</b>
                {
                  this.isOfficial(r.author) && <span className="text-primary"><b>&nbsp;&nbsp;★ Cuenta oficial</b></span>
                }
                &nbsp;&nbsp;{r.text} - <a className="delete-anchor" onClick={() => this.deleteReply(r._id)}>✗ Eliminar</a></p>
              </div>
              )
            )
          }
          <div className="markers">
            <p>Marcar comentario como...</p>
            {
              availableMarks.map( m => {
                if(comment.adminMarks.includes(m)){
                  return <a className="marker-anchor unmark-anchor" onClick={() => this.unmarkComment(m)}>#{m}</a>
                } 
                return <a className="marker-anchor mark-anchor" onClick={() => this.markComment(m)}>#{m}</a>
              })
            }
          </div>
          
        </div>
        <div className="info-comment">
        Publicado el {(new Date(comment.createdAt)).toLocaleString()} - {comment.replies.length} Respuestas - {comment.score} Puntos&nbsp;&nbsp;
        {
          this.state.answeredByOficial ?
          <span className="badge-answered">✔ Contestado por un oficial</span>
          : <span className="badge-not-answered">✖ Sin contestar por un oficial</span>

        }
        {
          this.state.flagedByOficial &&
          <span className="badge-not-answered">⚑ Marcado SPAM por un oficial</span>
        }
        {
          comment.adminMarks && comment.adminMarks.length > 0 && (
            <div>
              <br/>
              {
                comment.adminMarks.map( m => <span className="badge-marker">#{m}</span>)
              }
              </div>
          )
        }
        </div>
      </div>
    )
  }
}

export default userConnector(CommentContainer)