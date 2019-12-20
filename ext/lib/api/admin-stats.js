const express = require('express')
const validate = require('lib/api-v2/validate')
const middlewares = require('lib/api-v2/middlewares')
var forumMiddlewares = require('lib/backend/middlewares/forum-middlewares')
var privileges = require('lib/backend/privileges/forum')

const api = require('lib/api-v2/db-api')
var apiv1 = require('lib/backend/db-api')
var utils = require('lib/backend/utils')
var expose = utils.expose
var restrict = utils.restrict

const app = module.exports = express.Router()

app.get('/comments',
middlewares.topics.findByTopicId,
middlewares.forums.findFromTopic,
middlewares.forums.privileges.canEdit,
function getComments (req, res, next) {
  Promise.all([
    api.comments.adminlist({
      user: req.user,
      topicId: req.query.topicId,
      limit: 100000,
      page: 1,
      sort: '-createdAt'
    }),
    api.comments.listCount(req.query)
  ]).then((results) => {
    res.status(200).json({
      status: 200,
      results: {
        comments: results[0]
      }
    })
  }).catch(next)
})

app.get('/forum/:id/permissions',
  middlewares.forums.findById,
  middlewares.forums.privileges.canEdit,
  function getPermissions (req, res, next) {
    api.forums.find({ deletedAt: null, _id: req.params.id })
    .findOne()
    .select('permissions')
    .populate('permissions.user')
    .exec()
  .then((result) => {
    res.status(200).json(result.permissions)
  }).catch(next)
  }
)

app.post('/comments/:id/mark',
middlewares.users.restrict,
middlewares.comments.findById,
middlewares.topics.findFromComment,
middlewares.forums.findFromTopic,
middlewares.topics.privileges.canEdit,
function postCommentsMark (req, res, next) {
  api.comments.mark({
    id: req.params.id,
    user: req.user,
    mark: req.body.mark
  }).then((comment) => {
    res.status(200).json({
      status: 200,
      results: {
        comment: comment
      }
    })
  }).catch(next)
})

app.post('/comments/:id/unmark',
middlewares.users.restrict,
middlewares.comments.findById,
middlewares.topics.findFromComment,
middlewares.forums.findFromTopic,
middlewares.topics.privileges.canComment,
function postCommentsMark (req, res, next) {
  api.comments.unmark({
    id: req.params.id,
    user: req.user,
    mark: req.body.mark
  }).then((comment) => {
    res.status(200).json({
      status: 200,
      results: {
        comment: comment
      }
    })
  }).catch(next)
})