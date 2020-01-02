const express = require('express')
const json2csv = require('json-2-csv').json2csv
const moment = require('moment')
const config = require('lib/config')
const urlBuilder = require('lib/backend/url-builder')
const middlewares = require('lib/backend/api-v2/middlewares')
const api = require('lib/backend/api-v2/db-api')
const User = require('lib/backend/models').User

const app = module.exports = express()

const titles = [
  'Topic ID',
  'Topic Title',
  'Topic URL',
  'Comment ID',
  'Comment Date',
  'Comment Time',
  'Comment Date-time',
  'Comment Text',
  'Comment Author Fullname',
  'Comment Author Email',
  'Reply ID',
  'Reply Date',
  'Reply Time',
  'Reply Date-time',
  'Reply Text',
  'Reply Author Fullname',
  'Reply Author Email'
]

const emptyReply = {
  createdAt: '',
  id: '',
  text: '',
  author: { fullName: '' }
}

function fullUrl (topicId, forumName) {
  return config.protocol + '://' + config.host + urlBuilder
    .for('site.topic', {
      id: topicId,
      forum: forumName
    })
}

function escapeTxt (text) {
  if (!text) return ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/comments.csv',
middlewares.users.restrict,
middlewares.forums.findByName,
middlewares.topics.findAllFromForum,
middlewares.forums.privileges.canChangeTopics,
function getCsv (req, res, next) {
  api.comments.populateTopics(req.topics)
    .then((topicsComments) => {
      const commentsData = [ titles ]
      const users = topicsComments
        .map((topic) => {
          return topic.comments
            .map((comment) => {
              return comment.replies
                .map((reply) => {
                  return reply.author.id
                }).concat(comment.author.id)
              })
          })
          .reduce((acc, i) => acc.concat(
            i.reduce((acc, i) => acc.concat(i), [])
          ), [])

      User.find({ _id: { $in: users } })
        .then((usersRaw) => {
          topicsComments.forEach((topic) => {
            topic.comments.forEach((comment) => {
              (comment.replies.length === 0 ? [emptyReply] : comment.replies)
              .forEach((reply) => {
                commentsData.push([
                  topic.id,
                  `"${escapeTxt(topic.mediaTitle)}"`,
                  fullUrl(topic.id, req.forum.name),
                  comment.id,
                  `"${escapeTxt(moment(comment.createdAt, '', req.locale).format('LL'))}"`,
                  `"${escapeTxt(moment(comment.createdAt, '', req.locale).format('LT'))}"`,
                  comment.createdAt,
                  `"${escapeTxt(comment.text)}"`,
                  `"${escapeTxt(comment.author.fullName)}"`,
                  `"${usersRaw.find((u) => u.id === comment.author.id).email}"`,
                  reply.id,
                  `"${(reply.createdAt && escapeTxt(moment(reply.createdAt, '', req.locale).format('LL')))}"`,
                  `"${(reply.createdAt && escapeTxt(moment(reply.createdAt, '', req.locale).format('LT')))}"`,
                  reply.createdAt,
                  `"${escapeTxt(reply.text)}"`,
                  `"${escapeTxt(reply.author.fullName)}"`,
                  `"${!reply.author.id ? '' : usersRaw.find((u) => u.id === reply.author.id).email}"`
                ])
              })
            })
          })

          json2csv(commentsData, function (err, csv) {
            if (err) throw new Error('comments.csv: array to csv error')
            res.status(200)
            res.set({
              'Content-Type': 'text/csv; charset=utf-8',
              'Content-Disposition': 'attachment; filename=' + req.forum.name.replace(/\s/g, '-') + '.csv'
            })
            res.write(csv)
            res.end()
          }, { prependHeader: false })
        })
        .catch(next)

    }).catch(next)
})
