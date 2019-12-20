const debug = require('debug')
const log = debug('democracyos:ext:api:topics-ext')

const express = require('express')
const filter = require('mout/object/filter')

const validate = require('lib/api-v2/validate')
const middlewares = require('lib/api-v2/middlewares')
const dbApi = require('lib/api-v2/db-api')
const scopes = require('lib/api-v2/db-api/topics/scopes')

const app = module.exports = express.Router()

const updatableKeys = [
  'action.method',
  'action.results',
  'author',
  'authorUrl',
  'clauses',
  'closingAt',
  'coverUrl',
  'links',
  'mediaTitle',
  'source',
  'tag',
  'tags',
  'topicId',
  'extra.problema'
]
// traído de lib/api-v2/middlewares/topics.js para no tener que pisar todo
function parseUpdateableKeys (req, res, next) {
  const custom = (req.forum.topicsAttrs || []).map((attr) => {
    return `attrs.${attr.name}`
  })

  const updatable = updatableKeys.concat(custom)
  
  // req.body['action.method'] va a ser "cause", hardcodeado en el post, por ende:
  req.body['action.results'] = [{ value: 'support', percentage: 0, votes: 0 }]
  
  const attrs = filter(req.body, (v, k) => updatable.includes(k))

  req.forum.topicsAttrs.forEach((attr) => {
    const key = `attrs.${attr.name}`

    if (!attrs.hasOwnProperty(key)) return

    if (attr.kind === 'Number') {
      attrs[key] = parseInt(attrs[key], 10) || attr.min
      if (attrs[key] < attr.min || attrs[key] > attr.max) {
        attrs[key] = undefined
      }
    } else if (attr.kind === 'String') {
      attrs[key] = String(attrs[key])
      if (attrs[key].length < attr.min || attrs[key].length > attr.max) {
        attrs[key] = undefined
      }
    } else if (attr.kind === 'Enum') {
      const selected = attr.options.find((opt) => opt.name === attrs[key])
      if (!selected) attrs[key] = undefined
    } else if (attr.kind === 'Boolean') {
      if (!attrs[key] || attrs[key] === 'false' || attrs[key] === 'off') {
        attrs[key] = undefined
      } else {
        attrs[key] = true
      }
    }
  })

  req.keysToUpdate = attrs

  next()
}

// Crear propuesta ciudadana
app.post('/llamado',
middlewares.users.restrict,
middlewares.forums.findFromBody,
middlewares.forums.privileges.canCreateTopics,
//middlewares.topics.parseUpdateableKeys,
parseUpdateableKeys,
middlewares.topics.autoPublish,
function postTopics (req, res, next) {  
  // esto hace que aparezca el botón "<3 Apoyar"
  req.keysToUpdate['action.method'] = 'cause'
  
  req.keysToUpdate.extra = {}
  if (req.keysToUpdate['extra.problema'])
    req.keysToUpdate.extra.problema = req.keysToUpdate['extra.problema']
  
  log('Creating new topic/llamado')

  // en ext/lib/backend/db-api/index.js agregamos la key "extra" a las expose/updateables
  dbApi.topics.create({
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})

// Editar propuesta ciudadana
app.put('/llamado/:id',
middlewares.users.restrict,
middlewares.topics.findById,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canCreateTopics,
middlewares.topics.privileges.canEdit,
//middlewares.topics.parseUpdateableKeys,
parseUpdateableKeys,
middlewares.topics.autoPublish,
function putTopics (req, res, next) {
  req.keysToUpdate.extra = {}
  if (req.keysToUpdate['extra.problema'])
    req.keysToUpdate.extra.problema = req.keysToUpdate['extra.problema']
  
  log('Updating existing topic/llamado')
  
  // en ext/lib/backend/db-api/index.js agregamos la key "extra" a las expose/updateables
  dbApi.topics.edit({
    id: req.params.id,
    user: req.user,
    forum: req.forum
  }, req.keysToUpdate).then((topic) => {
    res.status(200).json({
      status: 200,
      results: {
        topic: topic
      }
    })
  }).catch(next)
})