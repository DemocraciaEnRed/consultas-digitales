const config = require('lib/config')
const monk = require('monk')
const t = require('t-component')
const template = require('./template')
const utils = require('democracyos-notifier/lib/utils')
const log = require('debug')('democracyos:notifier:comment-reply')
//const { ObjectID } = require('mongodb')

const jobName = 'comment-reply'
const jobNameForSingleUser = 'comment-reply-single-recipient'

// original en: https://github.com/DemocracyOS/notifier/blob/master/lib/jobs/lib/comment-reply.js
module.exports = function topicPublished (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')
  const comments = db.get('comments')

  agenda.define(jobName, (job, done) => {
    log('Ejecutando notifier job %s', jobName)
    const { topic, comment, reply, url } = job.attrs.data

    comments.distinct('replies.author', {
      _id: monk.id(comment.id)
    }).then((usersToNotify) => {
      usersToNotify.push(monk.id(comment.author.id))

      return users.find({
        $and: [
          {
            _id: { $in: usersToNotify },
            'notifications.replies': true
          },
          { _id: { $ne: monk.id(reply.author.id) } }
        ]
      }).each((user, { pause, resume }) => {
        pause()

        agenda.now(jobNameForSingleUser, {
          topicTitle: topic.mediaTitle,
          comment,
          reply,
          url,
          to: utils.emailAddress(user),
          locale: user.locale
        }, (err) => {
          if (err) return done(err)
          resume()
        })
      })
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  })

  agenda.define(jobNameForSingleUser, (job, done) => {
    const {
      topicTitle,
      comment,
      reply,
      url,
      to,
      locale
    } = job.attrs.data

    const html = template({
      userName: to.name,
      topicTitle,
      comment,
      reply,
      url
    }, {
      lang: locale
    })


    log('Enviando mail a %o', to)
    return mailer.send({
      to,
      subject: `[${config.organizationName}] Respondieron tu comentario en "${topicTitle}"`,
      html
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  })
}
