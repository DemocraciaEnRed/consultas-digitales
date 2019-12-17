/**
 * Expose forums database api
 */

exports.forum = require('./forum')
exports.user = require('./user')
exports.text = require('./text')

const topicScopes = require('lib/api-v2/db-api/topics/scopes')
topicScopes.ordinary.keys.expose.push('extra')
topicScopes.ordinary.select += ' extra'

const userDbApi = require('lib/db-api/user')
userDbApi.expose.confidential.keys.push('extra')