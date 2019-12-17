const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TextSchema = new Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  text: { type: String, maxlength: 2000, default: '' },
})

TextSchema.statics.findByName = function (name, cb) {
  return this.findOne({ name: name }).exec(cb)
}

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

TextSchema.set('toObject', { getters: true })
TextSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('Text', TextSchema)
}
