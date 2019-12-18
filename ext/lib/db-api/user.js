const debug = require('debug')
const escapeStringRegexp = require('escape-string-regexp')
const User = require('lib/models').User
const utils = require('lib/backend/utils')
const pluck = utils.pluck
const expose = utils.expose
const config = require('lib/config')
const urlBuilder = require('lib/backend/url-builder')

const log = debug('democracyos:db-api:user')

const notifier = require('democracyos-notifier')

/**
 * Get all users
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list items found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.all = function all (fn) {
  log('Looking for all users.')

  User
    .find()
    .sort('-createdAt')
    .exec(function (err, users) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all users %j', pluck(users, 'id'))
      fn(null, users)
    })
  return this
}

/**
 * Get User for `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id User's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' single object created or `undefined`
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for User %s', id)

  User
    .findById(id)
    .exec(function (err, user) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering User %j', user)
      fn(null, user)
    })
  return this
}

/**
 * Search `User` objects from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.search = function search (text, fn) {
  log('Searching for users matching %s', text)

  if (typeof text !== 'string') return fn(new Error('Invalid search term.'))

  if (text.length >= 256) return fn(new Error('Search term too long.'))

  let query = User.find().limit(10)

  if (text.includes('@')) {
    query = query.where({ email: text })
  } else {
    const searchTerm = escapeStringRegexp(text).replace(/\s+/g, '|')
    const regex = new RegExp(searchTerm, 'ig')

    query = query.or([
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } }
    ])
  }

  query.exec(function (err, users) {
    if (err) {
      log('Found error: %j', err)
      return fn(err)
    }

    log('Found users %j for text "%s"', users.length, text)
    fn(null, users)
  })

  return this
}

/**
 * Get `User` objects whose email has been validated
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'users' list of `User` objects found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.findEmailValidated = function findEmailValidated (fn) {
  log('Searching for email validated users matching')

  User.find({ emailValidated: true })
    .exec(function (err, users) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      log('Found %d email validated users', users.length)
      fn(null, users)
    })

  return this
}

/**
 * Find `User` object by email
 *
 * @param {String} The email of the user
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'user' the `User` object found or `undefined`
 * @return {Module} `user` module
 * @api public
 */

exports.getByEmail = function search (email, fn) {
  log('Searching for User with email %s', email)

  User.findOne({ email: email })
    .select('firstName lastName fullName email avatar profilePictureUrl notifications emailValidated extra')
    .exec(function (err, user) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      if (!user) {
        log('User not found for email %s', email)
        return fn(null, false)
      }

      log('Found User %j for email %s', user.id, email)
      fn(null, user)
    })

  return this
}

/**
 * User interfaces functions.
 */

exports.expose = {}

/**
 * Expose user attributes to be used on a private manner.
 * e.g.: '/api/user/me' call from an authenticated user.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.confidential = function exposeConfidential (user) {
  return expose(exports.expose.confidential.keys)(user)
}

exports.expose.confidential.keys = [
  'id',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'avatar',
  'staff',
  'notifications',
  'locale',
  'privileges',
  'extra'
]

/**
 * Expose user attributes to be used publicly.
 * e.g.: Search calls, users listings.
 *
 * @param {User} user.
 * @return {Hash} user attributes
 * @api public
 */

exports.expose.ordinary = function exposeOrdinary (user) {
  return expose(exports.expose.ordinary.keys)(user)
}

exports.expose.ordinary.keys = [
  'id',
  'fullName',
  'displayName',
  'avatar',
  'badge',
  'locale',
  'extra'
]

////// HASTA ACÁ ERA EL ORIGINAL

exports.requestVerify = function requestVerify (id, fn) {
  log('Requesting verify for User %s', id)
  const { VERIFY_USER_REQUEST_EMAIL } = process.env

  if (!VERIFY_USER_REQUEST_EMAIL){
    log('Must provide environment variable VERIFY_USER_REQUEST_EMAIL to send this mail')
    fn({status:500, error:'Bad server configuration. Check error logs.'})
  }

  this.get(id, function (err, user) {
    const {protocol, host} = config
    const verifyConfigUrl = `${protocol}://${host}${urlBuilder.for('settings.user-badges')}`

    let mailSubject = `Consultas Digitales - Solicitud de verificación de cuenta`
    let mailBodyHtml = `
      <p>El usuario <strong>${user.displayName}</strong> solicitó la verificación de su cuenta en la plataforma Consultas Digitales.</p>
      <p>Podés contactarlo a su correo electrónico <a href="mailto:${user.email}">${user.email}</a> para solicitar información.</p>
      <p>Para verificar su cuenta entrá a la sección de <a href="${verifyConfigUrl}">Gestión de usuarios</a> de la plataforma, buscá el usuario y clickeá en <em>Verificar Usuario.</em></p>
    `
    // NOTA: el mailer puede enviar "bien" el mail pero el smtp server no, entonces nunca sale el mail y no nos enteramos
    // Eso solo se puede ver en los logs de smtp server

    notifier.mailer.send({
        to: VERIFY_USER_REQUEST_EMAIL,
        subject: mailSubject,
        html: mailBodyHtml
      }).then(() => {
        log('Notifier mailer send OK')
        fn(null, user)
      }).catch((err) => {
        log('Notifier mailer send error: %j', err)
        fn(err)
      })
  })

  return this
}

exports.verifyUser = function verifyUser (id) {
  log('Verifying User with id %s', id)

  return new Promise((resolve, reject) => {
    User
      .findOneAndUpdate({_id : id}, { $set: { 'extra.verified': true } }, function (err, user) {
        if (err) {
          log('Verify User error: %s', err)
          return reject(err)
        }
        log('Verify User OK')
        const {protocol, host} = config
        const homeUrl = `${protocol}://${host}`

        let mailSubject = `Consultas Digitales - Cuenta verificada`
        let mailBodyHtml = `
          <p>¡Su cuenta ha sido verificada con éxito!</p>
          <p>Puede volver a Consultas Digitales haciendo click <a href="${homeUrl}">acá</a></p>
        `

        // NOTA: el mailer puede enviar "bien" el mail pero el smtp server no, entonces nunca sale el mail y no nos enteramos
        // Eso solo se puede ver en los logs de smtp server

        notifier.mailer.send({
            to: user.email,
            subject: mailSubject,
            html: mailBodyHtml
          }).then(() => {
            log('Notifier mailer send OK')
            resolve(1)
          }).catch((err) => {
            log('Notifier mailer send error: %j', err)
            resolve(1)
          })
      })
  })
}

exports.editExtra = function edit (id, extras) {
  log('Updating extra fields for user %s', id)

  return new Promise((resolve, reject) => {
    Object.keys(extras).forEach((key) => {
      if (!key.startsWith('extra.'))
        return reject('Can\'t update non-extra fields')
    })

    User.findOneAndUpdate({_id : id}, { $set: extras }, function (err, user) {
      if (err) {
        log('Update of user\'s extra fields failed: %s', err)
        return reject(err)
      }
      resolve(user)
    })

  })
}
