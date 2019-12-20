const express = require('express')
const visibility = require('lib/backend/visibility')
const urlBuilder = require('lib/backend/url-builder')

const app = module.exports = express()

app.get(urlBuilder.for('forums.new'), visibility, require('lib/frontend/settings/layout'))
