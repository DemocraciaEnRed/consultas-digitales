const express = require('express')
const debug = require('debug')
const log = debug('democracyos:ext:api:filters')
const api = require('ext/lib/db-api')

const app = module.exports = express()

const limit = 3

app.get(
  '/:byWhat/:page',
  function(req, res, next) {
    const options = {
      limit,
      skip: req.params.page * limit
    }

    switch (req.params.byWhat) {
      case 'byClosed':
        log('Filter by closed')
        api.forum.findByClosed(options, (err, forums) => {
          if(err) return next(err)
          return res.json(forums)
        })
        break
      case 'byPopular':
        log('Filter by relevant')
        api.forum.findByPopular(options, (err, forums) => {
          if(err) return next(err)
          return res.json(forums)
        })
        break
      case 'byDate':
        log('Filter by date')
        api.forum.all(options, (err, forums) => {
          if(err) return next(err)
          return res.json(forums)
        })
        break
      default:
        res.sendStatus(404)
    }
  }
)