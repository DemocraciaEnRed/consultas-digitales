const config = require('lib/config')
const monk = require('monk')
const t = require('t-component')
const template = require('./template')
const utils = require('democracyos-notifier/lib/utils')
const log = require('debug')('democracyos:notifier:new-comment')
//const { ObjectID } = require('mongodb')

const jobName = 'new-comment'
const jobNameForSingleUser = 'new-comment-single-recipient'

module.exports = function topicPublished (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')
  const comments = db.get('comments')
  const forums = db.get('forums')

  agenda.define(jobName, (job, done) => {
    log('Ejecutando notifier job %s', jobName)
    const { topic, comment, url } = job.attrs.data
    forums.findOne({_id: topic.forum})
      .then((forum) => {
        /*const moderators = forum.permissions && forum.permissions
          .filter((p) => ['admin', 'collaborator'].indexOf(p.role) != -1)
          .map((r) => r.user)*/

        return users.find({
          $and: [
            { _id: topic.owner },
            { _id: { $ne: monk.id(comment.author.id) } }
          ]
        }).each((user, { pause, resume }) => {
          pause()

          agenda.now(jobNameForSingleUser, {
            topicTitle: topic.mediaTitle,
            comment,
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
      url,
      to,
      locale
    } = job.attrs.data

    const html = template({
      userName: to.name,
      topicTitle,
      comment,
      url
    }, {
      lang: locale
    })

    log('Enviando mail a %o', to)
    return mailer.send({
      to,
      subject: `[${config.organizationName}] Nuevo comentario en "${topicTitle}"`,
      html
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  })
}
