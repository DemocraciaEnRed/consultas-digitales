var express = require('express')
var urlBuilder = require('lib/backend/url-builder')
var visibility = require('lib/visibility')

var app = module.exports = express()

app.get(urlBuilder.for('site.topic'), visibility, require('lib/frontend/site/layout'))
