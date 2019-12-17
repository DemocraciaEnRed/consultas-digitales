import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'

export default class ForumTable extends Component {
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
    Object.keys(this.props.comments).forEach(topicId => {
      let repliesCount = 0
      this.props.comments[topicId].forEach(c => {
        repliesCount += c.repliesCount
      })
      totalCommentsAcrossTopics += this.props.comments[topicId].length
      totalCommentsAndRepliesAcrossTopics += this.props.comments[topicId].length + repliesCount
    })
    this.setState({
      totalCommentsAcrossTopics,
      totalCommentsAndRepliesAcrossTopics
    })
  }

  calculateAverage() {
    let averageCommentsPerTopic = 0
    let totalPrimaryComments = 0
    Object.keys(this.props.comments).forEach(topicId => {
      totalPrimaryComments += this.props.comments[topicId].length
    })
    averageCommentsPerTopic = (totalPrimaryComments / this.props.topics.length)
    this.setState({
      averageCommentsPerTopic
    })
  }

  calculateSpam() {
    let totalSpamComments = 0
    Object.keys(this.props.comments).forEach(topicId => {
      this.props.comments[topicId].forEach(c => {
        if (c.flags.length > 0) totalSpamComments += 1
      })
    })
    this.setState({
      totalSpamComments
    })
  }
  calculateWithoutOfficialReply() {
    let totalComments = 0
    Object.keys(this.props.comments).forEach(topicId => {
      totalComments += this.props.comments[topicId].length
    })
    let totalWithOfficialReply = 0
    let adminsIds = this.props.admins.map(a => a.user._id)
    let uniqueParticipants = []
    Object.keys(this.props.comments).forEach(topicId => {
      this.props.comments[topicId].forEach(c => {
        let foundAtLeastOneOfficial = false
        // ----------
        if (!uniqueParticipants.includes(c.author.id) && !adminsIds.includes(c.author.id)) { uniqueParticipants.push(c.author.id) }
        c.replies.forEach(r => {
          if (!uniqueParticipants.includes(r.author.id) && !adminsIds.includes(r.author.id)) { uniqueParticipants.push(r.author.id) }
        })
        // ----------
        if (adminsIds.includes(c.author.id)) { foundAtLeastOneOfficial = true }
        else {
          c.replies.forEach(r => {
            if (adminsIds.includes(r.author.id)) { foundAtLeastOneOfficial = true }
          })
        }
        if (foundAtLeastOneOfficial) totalWithOfficialReply += 1
      })
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
      Object.keys(this.props.comments).forEach(topicId => {
        this.props.comments[topicId].forEach(c => {
          if (c.adminMarks.includes(m)) markCount += 1
        })
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
    let { forum, topics, admins, comments } = this.props
    return (
      <div className="general-stats-container">
        <h4 className="forum-subtitle">Consulta</h4>
        <h1 className="forum-title">{forum.title}</h1>
        <table className="table">
          <thead>
            <tr>
              <th colSpan="2" className="bg-primary">Estadisticas generales de la consulta en general</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Cantidad de comentarios y respuestas en total
                </td>
              <td className="bg-light text-center">
                {this.state.totalCommentsAndRepliesAcrossTopics}
              </td>
            </tr>
            <tr>
              <td>
                Cantidad de comentarios primarios
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
                Media de comentarios por eje
                </td>
              <td className="bg-light text-center">
                {this.state.averageCommentsPerTopic}
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
              this.state.marksCount.map(markCount => (
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
    )
  }
}