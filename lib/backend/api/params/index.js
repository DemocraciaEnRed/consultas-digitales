var express = require('express')
var log = require('debug')('democracyos:params-api')
var accepts = require('lib/backend/accepts')
var utils = require('lib/backend/utils')
var restrict = utils.restrict
var _handleError = utils._handleError

var app = module.exports = express()

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'))

app.get('/params/regexps', function (req, res, next) {
  var regexps = require('lib/backend/regexps')
  log('Delivering regexps')
  res.status(200).json(regexps.strings)
})
