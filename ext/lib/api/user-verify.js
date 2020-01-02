const debug = require('debug')
const log = debug('democracyos:ext:api:user-verify')
const express = require('express')

const validate = require('lib/backend/api-v2/validate')
const middlewares = require('lib/backend/api-v2/middlewares')
var privileges = require('lib/backend/privileges/forum')
var utils = require('lib/backend/utils')
var expose = utils.expose
var restrict = utils.restrict
var pluck = utils.pluck
var models = require('lib/backend/models')
var User = models.User

const dbApi = require('ext/lib/db-api')
const dbApiOriginal = require('lib/backend/db-api')

const app = module.exports = express.Router()

app.post('/:id',
middlewares.users.restrict,
function requestUserVerify(req, res, next) {
  let verifyId = req.params.id
  let fromId = req.user._id
  
  if (fromId != verifyId)
    next(new Error('Can\'t request user verify for another user'))
  
  log('Sending user verify request for id %s', verifyId)
  
  dbApi.user.requestVerify(verifyId, function (err, user) {
    if(err)
      next(err)
    log('User verify request sent successfully for id %s', user.id)
    dbApi.user.editExtra(fromId, { 'extra.verificationRequest': Date.now() }).then((user) => {
      return res.status(200).json({
        status: 200,
        results: {
          user: user
        }
      })
    }).catch(next)
  })
})

app.post('/verify/:id',
middlewares.users.restrict,
function requestUserVerify(req, res, next) {
  if (!req.user.staff) return res.send(401)
  
  let verifyId = req.params.id
  
  log('Verifying user with id %s', verifyId)
  
  dbApi.user.verifyUser(verifyId)
    .then(() => {
      res.status(200).json({status: 200})
    })
    .catch(next)
})

// Creamos un search aparte para no tener que pisar toda la Web API de user (lib/user/index.js)
// Necesitaba exponer el campo 'extra', y para eso tenía que apuntar al search de nuestra Db API
app.get('/search', restrict, function (req, res) {
  var q = req.param('q')

  log('Request user/search %j', q)

  dbApi.user.search(q, function (err, users) {
    if (err) next(err)

    log('Serving users %j', pluck(users, 'id'))
    res.status(200).json(users.map(dbApi.user.expose.ordinary))
  })
})