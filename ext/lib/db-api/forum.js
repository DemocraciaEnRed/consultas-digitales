var pick = require('mout/object/pick')
var Log = require('debug')
var models = require('lib/backend/models')
var pluck = require('lib/backend/utils').pluck
var log = new Log('democracyos:db-api:forum')
var Forum = models.Forum
var Topic = models.Topic
var Comment = models.Comment

exports.all = function all (options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = undefined
  }

  log('Looking for all forums.')

  var query = Forum
    .find({ deletedAt: null, 'extra.hidden': false })
    .populate('owner')
    .sort('-createdAt')

  if (options) {
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.owner) query.find({ owner: options.owner })

    if (options['privileges.canChangeTopics']) {
      query.find({
        $or: [
          { owner: options['privileges.canChangeTopics'] },
          {
            permissions: {
              $elemMatch: { user: options['privileges.canChangeTopics'] }
            }
          }
        ]
      })
    }
  }

  if (!options || (!options.owner && !options['privileges.canChangeTopics'])) {
    query.find({ visibility: { $ne: 'private' } })
  }

  query.exec(function (err, forums) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering forums %j', pluck(forums, 'id'))
    fn(null, forums)
  })

  return this
}

exports.create = function create (data, fn) {
  log('Creating new forum.')

  var forum = new Forum(data)
  forum.save(onsave)

  function onsave (err) {
    if (err) {
      log('Found error: %s', err)
      return fn(err)
    }

    log('Saved forum with id %s', forum.id)
    fn(null, forum)
  }
}

exports.update = function update (forum, data, fn) {
  var attrs = pick(data, ['visibility'])
  forum.set(attrs)
  return forum.save(fn)
}

exports.del = function del (forum, fn) {
  log('Deleting forum %s', forum.name)
  forum.delete(function (err) {
    if (err) log('Found error: %s', err)
    return fn(err)
  })
}

exports.findOneByOwner = function findOneByOwner (owner, fn) {
  log('Searching forum of owner %j', owner)

  Forum
    .where({ owner: owner, deletedAt: null, 'extra.hidden': false })
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      if (forum) log("Found forum '%s' of %j", forum.name, owner)
      else log('Not Found forum of %j', owner)

      fn(null, forum)
    })

  return this
}

exports.findByOwner = function findByOwner (owner, fn) {
  log('Searching forums of owner %j', owner)

  Forum
    .where({ owner: owner, deletedAt: null, 'extra.hidden': false })
    .populate('owner')
    .find(function (err, forums) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      }

      fn(null, forums)
    })

  return this
}

exports.findById = function findById (id, fn) {
  log('Searching for forum with id %s', id)

  Forum
    .where({ deletedAt: null, _id: id, 'extra.hidden': false })
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      } else if (!forum) {
        log('No forum found with id %s', id)
        return fn()
      }

      log('Found forum %s', forum.id)
      fn(null, forum)
    })

  return this
}

exports.findOneByName = function findOneByName (name, fn) {
  log('Searching for forum with name %s', name)

  var query = { deletedAt: null, 'extra.hidden': false }

  if (name) query.name = name

  Forum
    .where(query)
    .populate('owner')
    .findOne(function (err, forum) {
      if (err) {
        log('Found error: %j', err)
        return fn(err)
      } else if (!forum) {
        log('No forum found with name %s', name)
        return fn()
      }

      log('Forum coverurl %s', forum.coverUrl)
      log('Found forum %s', forum.name)
      fn(null, forum)
    })

  return this
}

exports.nameIsValid = function nameIsValid (name) {
  return Forum.nameIsValid(name)
}

exports.getPermissions = function getPermissions (id, fn) {
  log('Searching for permissions of forum with id %s', id)

  Forum
    .where({ deletedAt: null, _id: id, 'extra.hidden': false })
    .select('permissions')
    .populate('permissions.user')
    .findOne((err, forum) => {
      return fn(err, forum.permissions.toObject())
    })
}

exports.grantPermission = function grantPermission (forumId, user, role) {
  log('Granting permissions as role %s to user %s of forum with id %s', role, user, forumId)
  return new Promise((resolve, reject) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return reject(findError)

      forum.grantPermission(user, role, (saveError) => {
        if (saveError) return reject(saveError)
        return resolve(forum)
      })
    })
  })
}

exports.revokePermission = function revokePermission (forumId, user, role) {
  log(`Revoking permissions to ${user} on forum ${forumId}.`)

  return new Promise((resolve, reject) => {
    Forum.findById(forumId, (findError, forum) => {
      if (findError) return reject(findError)
      forum.revokePermission(user, role, (revokeError) => {
        if (revokeError) return reject(revokeError)
        log(`Permissions revoked to ${user} on forum ${forumId}.`)
        return resolve(forum)
      })
    })
  })
}

exports.exists = function exists (name, fn) {
  name = normalize(name)
  Forum
    .find({ deletedAt: null, name: name, 'extra.hidden': false })
    .limit(1)
    .exec(function (err, forums) {
      return fn(err, !!(forums && forums.length))
    })
}

exports.findByClosed = function findByClosed (options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = undefined
  }

  log(`Get forums order by the newest.`)

  let query = Forum
    .find({ deletedAt: null, 'extra.hidden': false, 'extra.closingAt': { $lte: new Date() } })
    .populate('owner')

    // Copiado lo que hace en export.all con los privileges
    // Copiado lo que hace en export.all con los privileges
    // Copiado lo que hace en export.all con los privileges

  if (options) {
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.owner) query.find({ owner: options.owner })

    if (options['privileges.canChangeTopics']) {
      query.find({
        $or: [
          { owner: options['privileges.canChangeTopics'] },
          {
            permissions: {
              $elemMatch: { user: options['privileges.canChangeTopics'] }
            }
          }
        ]
      })
    }
  }

  if (!options || (!options.owner && !options['privileges.canChangeTopics'])) {
    query.find({ visibility: { $ne: 'private' } })
  }

  query
    .exec(function (err, forums) {
      return fn(err, forums)
    })
}

exports.findByPopular = function findByPopular (options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = undefined
  }

  log(`Get forums order by the popular topics.`)

  let query = Forum
    .find({ deletedAt: null, 'extra.hidden': false })
    .populate('owner')

  // Copiado lo que hace en export.all con los privileges
  // Copiado lo que hace en export.all con los privileges
  // Copiado lo que hace en export.all con los privileges

  if (options) {
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.owner) query.find({ owner: options.owner })

    if (options['privileges.canChangeTopics']) {
      query.find({
        $or: [
          { owner: options['privileges.canChangeTopics'] },
          {
            permissions: {
              $elemMatch: { user: options['privileges.canChangeTopics'] }
            }
          }
        ]
      })
    }
  }

  if (!options || (!options.owner && !options['privileges.canChangeTopics'])) {
    query.find({ visibility: { $ne: 'private' } })
  }
  

  query
    .exec(function (err, forums) {
      Promise.all(forums.map((forum) => {
        forum = forum.toJSON()
        return Topic
          .find({ forum: forum._id })
          .then(getCommentsFromTopics)
          .then((topics) => {
            forum.commentsCount = 0;
            topics.forEach((topic) => {
              forum.commentsCount = forum.commentsCount + topic.commentsCount;
            })
            return forum
          })
      }))
      .then((values) => {
        fn(null, values.sort(sortByCommentsCount).reverse())
      })
      .catch(fn)
    })
}

const sortBy = fn => (a, b) => -(fn(a) < fn(b)) || +(fn(a) > fn(b))
const getCommentsCount = o => o.commentsCount
const sortByCommentsCount = sortBy(getCommentsCount)

function getCommentsFromTopics (topics) {
  const topicPromises = Promise.all(topics.map((topic) => {
    topic = topic.toJSON()
    return Comment.count({ reference: topic.id })
      .then((commentsCount) => {
        topic.commentsCount = commentsCount
        return topic
      })
    }))

  return topicPromises;
}

function normalize (str) {
  return str.trim().toLowerCase()
}
