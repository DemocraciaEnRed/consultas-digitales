var express = require('express')
var app = module.exports = express()

app.use(require('lib/frontend/settings/settings'))
app.use(require('lib/frontend/settings/forum-new'))
