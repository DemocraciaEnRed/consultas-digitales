const debug = require('debug')
const log = debug('democracyos:ext:api:text')

const express = require('express')
var utils = require('lib/backend/utils')
var restrict = utils.restrict
var maintenance = utils.maintenance

const dbApi = require('../db-api')

const app = module.exports = express.Router()

app.get('/:textName', function (req, res) {
  log('Getting text by name %s', req.params.textName)

  dbApi.text.getByName(req.params.textName, function (err, obj) {
    if(err) {      
      log('Error found: %s', err)
      next(err)
    }
    
    if (obj){
      log('Serving text %s', obj.text)
      res.status(200).json(obj.toJSON())
    }else{
      log('No text found')
      res.status(200).json({})
    }
  })
})
        
app.post('/',
  //restrict,
  //maintenance,
  function (req, res) {
    if (!req.body.name) return res.status(400).send({ error: 'No name' })
    if (typeof req.body.name !== 'string') return res.status(400).send({ error: 'Bad name' })
  
    var data = {
      name: req.body.name,
      text: req.body.text
    }
  
    log('Trying to create text with name %s', data.name)
  
    dbApi.text.create(data, function (err, obj) {
      if(err) {      
        log('Error found: %s', err)
        next(err)
      }

      log('Created text with id %s', obj.id)
      res.status(200).json(obj.toJSON())
    })
  }
)

app.put('/:id',
  //restrict,
  //maintenance,
  function (req, res) {
    if (!req.body.name) return res.status(400).send({ error: 'No name' })
    if (typeof req.body.name !== 'string') return res.status(400).send({ error: 'Bad name' })
  
    const id = req.params.id
    log('Trying to update text with id %s', id)
  
    dbApi.text.get(id, function (err, text) {
      if(err) {      
        log('Error found (1): %s', err)
        next(err)
      }
  
      var data = {
        name: req.body.name,
        text: req.body.text
      }
      dbApi.text.update(text, data, function (err, obj) {
        if(err) {      
          log('Error found (2): %s', err)
          next(err)
        }

        log('Updated text with id %s', obj.id)
        res.status(200).json(obj.toJSON())
      })
      
    })
  }
)