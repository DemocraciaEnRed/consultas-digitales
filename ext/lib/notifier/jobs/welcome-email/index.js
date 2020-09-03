const config = require('lib/config')
const utils = require('democracyos-notifier/lib/utils')
const template = require('./template')

const jobName = 'welcome-email'
const subject = `[${config.organizationName}] ¡Validá tu cuenta para comenzar!`
const log = require('debug')(`democracyos:notifier:${jobName}`)

module.exports = function welcomeEmail (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')

  agenda.define(jobName, { priority: 'high' }, welcomeEmailJob)
  agenda.define('signup', { priority: 'high' }, welcomeEmailJob)
  agenda.define('resend-validation', { priority: 'high' }, welcomeEmailJob)

  function welcomeEmailJob (job, done) {
    const data = job.attrs.data

    users.findOne({ email: data.to }).then((user) => {
      if (!user) throw new Error(`User not found for email "${data.to}"`)

      const html = template({
        userName: user.firstName,
        validateUrl: data.validateUrl
      })

      return mailer.send({
        to: utils.emailAddress(user),
        subject,
        html
      })
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  }
}
