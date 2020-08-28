const express = require('express')
// const validate = require('lib/backend/api-v2/validate')
// const middlewares = require('lib/backend/api-v2/middlewares')
// var forumMiddlewares = require('lib/backend/middlewares/forum-middlewares')
// var privileges = require('lib/backend/privileges/forum')

// const api = require('lib/backend/api-v2/db-api')
// var apiv1 = require('lib/backend/db-api')
// var utils = require('lib/backend/utils')
// var expose = utils.expose
// var restrict = utils.restrict
var utils = require('lib/backend/utils')

var models = require('lib/backend/models')
var Forum = models.Forum
var Topic = models.Topic
var Comment = models.Comment


const app = module.exports = express.Router()

app.get('/forum/:forumName',
  function getAllForums(req, res, next) {
    Forum
      .findOne({ $or:[ 
        // { name: req.params.forumName, visibility: 'public', "extra.hidden": false },
        // { name: req.params.forumName, visibility: 'collaborative', "extra.hidden": false }
        { name: req.params.forumName, "extra.hidden": false }
      ]})
      .populate('owner')
      .exec()
      .then((forum) => {
        const legitRoles = ['owner', 'admin', 'collaborator', 'author', 'moderator']
        let officialAdmins = forum.permissions.filter(admin => {
          return legitRoles.includes(admin.role)
        })
        let isOwnerIncluded = officialAdmins.find(admin => {
          return admin.user == forum.owner.id
        })
        if (!isOwnerIncluded) {
          officialAdmins.push({
            role: 'owner',
            user: forum.owner.id
          })
        }
        req.forum = forum
        req.officialRoles = officialAdmins
        next()
      }).catch(next)
  },
  function countAllComments(req, res, next) {
    Topic.find({ forum: req.forum._id }).exec()
      .then(forumTopics => {
        let topicIds = []
        forumTopics.forEach(topic => {
          topicIds.push(topic._id)
        })
        let commentsTopicPromises = topicIds.map(topic => {
          return Comment.find({ reference: topic + '' }).exec()
        });
        Promise.all(commentsTopicPromises)
          .then(commentsTopic => {
            const mergeArrays = (accumulator, currentValue) => accumulator.concat(currentValue)
            let allComments = commentsTopic.reduce(mergeArrays, [])
            let totalWithOfficialReply = 0;
            const allOfficials = req.officialRoles.map(official => official.user.toString())
            let uniqueParticipants = []
            allComments.forEach(comment => {
              let foundAtLeastOneOfficial = false
              // ------
              if (!uniqueParticipants.includes(comment.author.toString())
                && !allOfficials.includes(comment.author.toString())) { uniqueParticipants.push(comment.author.toString()) }
              comment.replies.forEach(reply => {
                if (!uniqueParticipants.includes(reply.author.toString())
                  && !allOfficials.includes(reply.author.toString())) { uniqueParticipants.push(reply.author.toString()) }
              })
              // ------
              if (allOfficials.includes(comment.author.toString())) foundAtLeastOneOfficial = true
              else {
                comment.replies.forEach(reply => {
                  if (allOfficials.includes(reply.author.toString())) foundAtLeastOneOfficial = true
                })
              }
              if (foundAtLeastOneOfficial) totalWithOfficialReply += 1
            })
            res.status(200).json({
              totalWithOfficialReply: totalWithOfficialReply,
              totalComments: allComments.length,
              uniqueParticipants: uniqueParticipants.length
            })
          })
      }).catch(next)
  }
)

app.get('/forums',
  function getAllForums(req, res, next) {
    Forum
      .find({ deletedAt: null, visibility: 'public', "extra.hidden": false })
      .lean()
      .exec()
      .then((forums) => {
        let forumsCopy = []
        const legitRoles = ['owner', 'admin', 'collaborator', 'author', 'moderator']
        forums.forEach(forum => {
          let forumCopy = forum
          let officialAdmins = forum.permissions.filter(admin => {
            return legitRoles.includes(admin.role)
          })
          let isOwnerIncluded = officialAdmins.find(admin => {
            return admin.user.toString() == forum.owner.id.toString()
          })
          if (!isOwnerIncluded) {
            officialAdmins.push({
              role: 'owner',
              user: forum.owner.toString()
            })
          }
          forumCopy['officialAdmins'] = officialAdmins
          forumsCopy.push(forumCopy)
        });
        req.forums = forumsCopy
        next()
      }).catch(next)
  },
  function countAll(req, res, next) {
    let forumsTopicPromises = req.forums.map(forum => {
      return Topic.find({ forum: forum._id }).exec()
    });
    Promise.all(forumsTopicPromises)
      .then(forumsTopics => {
        let totalTopics = 0
        let openTopics = 0
        let closedTopics = 0
        forumsTopics.forEach(forumTopics => {
          forumTopics.forEach(topic => {
            if (!topic.draft && topic.public) {
              totalTopics += 1
              if (topic.open) openTopics += 1
              else if (topic.closed) closedTopics += 1
            }
          })
        })
        req.countTopics = totalTopics
        req.countOpenTopics = openTopics
        req.countClosedTopics = closedTopics
        next()
      }).catch(next)
  },
  function countAllComments(req, res, next) {
    let officialsPerForum = {}
    req.forums.forEach( forum => {
      officialsPerForum[forum._id] = forum.officialAdmins.map(official => official.user.toString())
    })
    let forumsTopicPromises = req.forums.map(forum => {
      return Topic.find({ forum: forum._id }).exec()
    });
    Promise.all(forumsTopicPromises)
      .then(forumsTopics => {
        let officialsPerTopic = {}
        let topicIds = []
        forumsTopics.forEach(forumTopics => {
          forumTopics.forEach(topic => {
            topicIds.push(topic._id)
            officialsPerTopic[topic._id] = officialsPerForum[topic.forum]
          })
        })
        let commentsTopicPromises = topicIds.map(topic => {
          return Comment.find({ reference: topic + '' }).exec()
        });
        Promise.all(commentsTopicPromises)
          .then(commentsTopic => {
            const mergeArrays = (accumulator, currentValue) => accumulator.concat(currentValue)
            let allComments = commentsTopic.reduce(mergeArrays, [])
            let totalWithOfficialReply = 0;
            let uniqueParticipants = []
            allComments.forEach(comment => {
              let foundAtLeastOneOfficial = false
              // ------
              if (!uniqueParticipants.includes(comment.author.toString())
                && !officialsPerTopic[comment.reference].includes(comment.author.toString())) { uniqueParticipants.push(comment.author.toString()) }
              comment.replies.forEach(reply => {
                if (!uniqueParticipants.includes(reply.author.toString())
                  && !officialsPerTopic[comment.reference].includes(reply.author.toString())) { uniqueParticipants.push(reply.author.toString()) }
              })
              // ------
              if (officialsPerTopic[comment.reference].includes(comment.author.toString())) {
                foundAtLeastOneOfficial = true
              }
              else {
                comment.replies.forEach(reply => {
                  if (officialsPerTopic[comment.reference].includes(reply.author.toString())) {
                    foundAtLeastOneOfficial = true
                  }
                })
              }
              //
              if (foundAtLeastOneOfficial) totalWithOfficialReply += 1
            })
            res.status(200).json({
              countForums: req.forums.length,
              countTopics: req.countTopics,
              countOpenTopics: req.countOpenTopics,
              countClosedTopics: req.countClosedTopics,
              totalWithOfficialReply: totalWithOfficialReply,
              totalComments: allComments.length,
              uniqueParticipants: uniqueParticipants.length
            })
          })
      }).catch(next)
  }
  // Promise.all([
  //   apiv1.forum.all({
  //     user: req.user,
  //     topicId: req.query.topicId,
  //     limit: 100000,
  //     page: 1,
  //     sort: 'createdAt'
  //   }),
  //   api.comments.listCount(req.query)
  // ]).then((results) => {
  //   res.status(200).json({
  //     status: 200,
  //     results: {
  //       comments: results[0]
  //     }
  //   })
  // }).catch(next)
)