/**
 * Module dependencies.
 */

var express = require('express')
var urlBuilder = require('lib/backend/url-builder')
var visibility = require('lib/backend/visibility')

/**
 * Exports Application
 */

var app = module.exports = express()

app.use(urlBuilder.for('admin.wild'), visibility)
app.get(urlBuilder.for('admin'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.topics'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.topics.id'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.topics.create'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.tags'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.tags.id'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.tags.create'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.users'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.users.create'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.users.id'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.permissions'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.comments'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.tags-moderation'), require('lib/frontend/admin/layout'))
app.get(urlBuilder.for('admin.forum.edit'), require('lib/frontend/admin/layout'))
