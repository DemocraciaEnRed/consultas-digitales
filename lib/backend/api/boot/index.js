/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var visibility = require('lib/frontend/visibility')

var app = module.exports = express()

/*
 * Local signin routes
 */

if (!config.signinUrl) app.use(require('lib/backend/api/signin'))

/*
 * Local signup routes
 */

if (!config.signupUrl) app.use(require('lib/backend/api/signup'))

/*
 * Forgot password routes
 */

app.use(require('lib/backend/api/forgot'))

/**
 * Root API Service
 */

app.use(require('lib/backend/api/boot/version'))

/**
 * User API Service
 */

app.use(require('lib/user'))

/*
 * Restrict private routes if neccesary
 */

app.all(visibility)

/*
 * Account routes
 */

app.use(require('lib/backend/api/settings'))

/**
 * Tag API Service
 */

app.use(require('lib/backend/api/tag'))

/**
 * Topic API Service
 */

app.use(require('lib/backend/api/topic'))

/**
 * Whitelist API Service
 */

app.use(require('lib/backend/api/whitelist'))

/**
 * Forums API Service
 */

app.use(require('lib/backend/api/forum'))

/**
 * Notifications API Service
 */

app.use(require('lib/backend/api/notification'))
