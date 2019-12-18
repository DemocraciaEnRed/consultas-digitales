var express = require('express')
var urlBuilder = require('lib/url-builder')
var visibility = require('lib/backend/visibility')

var app = module.exports = express()

app.get(urlBuilder.for('site.forum'), visibility, require('lib/site/layout'))
