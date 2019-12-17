const debug = require('debug')
const log = debug('democracyos:ext:db-api:text')

const utils = require('lib/utils')
const pluck = utils.pluck

// para esto hay que agregar el modelo a dos-overrides! (y rebuildear)
const Text = require('lib/models').Text

exports.all = function all (fn) {
  log('Looking for all texts.')

  Text
    .find()
    .sort('name')
    .exec(function (err, objs) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering all texts %j', pluck(objs, 'id'))
      fn(null, objs)
    })
  return this
}

exports.get = function get (id, fn) {
  log('Looking for Text with id %s', id)

  Text
    .findById(id)
    .exec(function (err, obj) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering Text %j', obj)
      fn(null, obj)
    })
  return this
}

exports.getByName = function getByName (name, fn) {
  log('Looking for Text with name %s', name)

  Text
    .findOne({ name: name })
    .exec(function (err, obj) {
      if (err) {
        log('Found error %j', err)
        return fn(err)
      }

      log('Delivering Text %j', obj)
      fn(null, obj)
    })
  return this
}

exports.create = function create (data, fn) {
  log('Creating new text')
  
  var text = new Text(data)
  text.save(function (err) {
    if (err) {
      log('Found error: %s', err)
      return fn(err)
    }

    log('Saved text with id %s', text.id)
    fn(null, text)
  })
}

exports.update = function update (forum, data, fn) {
  forum.set(data)
  return forum.save(fn)
}