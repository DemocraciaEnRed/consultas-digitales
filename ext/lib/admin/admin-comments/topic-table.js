import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/backend/url-builder'
import CommentContainer from './comment-container'
import ActionContainer from './action-container'


export default class TopicTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCommentsAcrossTopics: 0,
      totalCommentsAndRepliesAcrossTopics: 0,
      averageCommentsPerTopic: 0,
      totalSpamComments: 0,
      totalWithoutOfficialReply: 0,
      uniqueParticipants: 0,
      marksCount: [],
    }
  }

  componentWillMount() {
    this.calculateTotals()
    this.calculateAverage()
    this.calculateSpam()
    this.calculateWithoutOfficialReply()
    this.calculateMarkers()
  }

  calculateTotals() {
    let totalCommentsAcrossTopics = 0
    let totalCommentsAndRepliesAcrossTopics = 0
    let repliesCount = 0
    this.props.comments.forEach(c => {
      repliesCount += c.repliesCount
    })
    totalCommentsAcrossTopics += this.props.comments.length
    totalCommentsAndRepliesAcrossTopics += this.props.comments.length + repliesCount
    this.setState({
      totalCommentsAcrossTopics,
      totalCommentsAndRepliesAcrossTopics
    })
  }

  calculateAverage() {
    let averageCommentsPerTopic = 0
    let totalPrimaryComments = 0
    totalPrimaryComments += this.props.comments.length
    averageCommentsPerTopic = (totalPrimaryComments / this.props.topic.length)
    this.setState({
      averageCommentsPerTopic
    })
  }
  calculateSpam() {
    let totalSpamComments = 0
    this.props.comments.forEach(c => {
      if (c.flags.length > 0) totalSpamComments += 1
    })
    this.setState({
      totalSpamComments
    })
  }
  calculateWithoutOfficialReply() {
    let totalComments = this.props.comments.length
    let totalWithOfficialReply = 0
    let adminsIds = this.props.admins.map(a => a.user._id)
    let uniqueParticipants = []
    this.props.comments.forEach(c => {
      let foundAtLeastOneOfficial = false
      if (!uniqueParticipants.includes(c.author.id) && !adminsIds.includes(c.author.id)) { uniqueParticipants.push(c.author.id) }
      c.replies.forEach(r => {
        if (!uniqueParticipants.includes(r.author.id) && !adminsIds.includes(r.author.id)) { uniqueParticipants.push(r.author.id) }
      })
      // --------
      if (adminsIds.includes(c.author.id)) { foundAtLeastOneOfficial = true }
      else {
        c.replies.forEach(r => {
          if (adminsIds.includes(r.author.id)) { foundAtLeastOneOfficial = true }
          if (!uniqueParticipants.includes(r.author.id) && !adminsIds.includes(r.author.id)) { uniqueParticipants.push(r.author.id) }
        })
      }
      // --------
      if (foundAtLeastOneOfficial) totalWithOfficialReply += 1
    })
    this.setState({
      totalWithoutOfficialReply: totalComments - totalWithOfficialReply,
      uniqueParticipants: uniqueParticipants.length
    })
  }
  calculateMarkers() {
    let marksCount = this.state.marksCount
    this.props.availableMarks.forEach(m => {
      let markCount = 0;
      this.props.comments.forEach(c => {
        if (c.adminMarks.includes(m)) markCount += 1
      })
      if (markCount > 0) {
        let aux = {}
        aux.name = m
        aux.count = markCount
        marksCount.push(aux)
      }
    })
    this.setState({
      marksCount: marksCount
    })
  }

  render() {
    let { forum, topic, admins, comments, showNotifyChanges, updateAll, availableMarks   } = this.props
    let { marksCount } = this.state
    return (
      <div>
        <div className="topic-name-container">
          <h5 className="topic-subtitle">Eje de la consulta</h5>
          <a
            href={`/${forum.name}/consulta/${topic.id}`}
          >
            <h4 className="topic-title">{topic.mediaTitle}</h4>
          </a>
        </div>
        <div className="general-stats-container">
          <table className="table">
            <thead>
              <tr>
                <th colSpan="2" className="bg-primary">Estadisticas generales del eje</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Comentarios y respuestas en total
                </td>
                <td className="bg-light text-center">
                  {this.state.totalCommentsAndRepliesAcrossTopics}
                </td>
              </tr>
              <tr>
                <td>
                  Comentarios primarios
                </td>
                <td className="bg-light text-center">
                  {this.state.totalCommentsAcrossTopics}
                </td>
              </tr>
              <tr>
                <td>
                  Cantidad participantes únicos
                </td>
                <td className="bg-light text-center">
                  {this.state.uniqueParticipants}
                </td>
              </tr>
              <tr>
                <td>
                  Comentarios marcados como ⚑ SPAM
                </td>
                <td className="bg-light text-center">
                  {this.state.totalSpamComments}
                </td>
              </tr>
              <tr>
                <td>
                  Comentarios sin respuestas por oficiales
                </td>
                <td className="bg-light text-center">
                  {this.state.totalWithoutOfficialReply}
                </td>
              </tr>
              <tr>
                <td>
                  Porcentaje de comentarios atendidos
                </td>
                <td className="bg-light text-center">
                  {Math.ceil(((this.state.totalCommentsAcrossTopics - this.state.totalWithoutOfficialReply) / this.state.totalCommentsAcrossTopics) * 100)} %
                </td>
              </tr>
              {
                marksCount.map(markCount => (
                  <tr>
                    <td>
                      Comentarios marcados como <span className="badge-mark">#{markCount.name}</span>
                    </td>
                    <td className="bg-light text-center">
                      {markCount.count}
                    </td>
                  </tr>
                )
                )
              }
            </tbody>
          </table>
        </div>
        <div>
          {topic.action && topic.action.method != '' &&
            <ActionContainer topic={topic}></ActionContainer>
          }
        </div>
        <div>
          {
            comments.map(c => (
              <CommentContainer comment={c} admins={admins} showNotifyChanges={showNotifyChanges} updateAll={updateAll} availableMarks={availableMarks} />
            )
            )
          }
        </div>
      </div>
    )
  }
}