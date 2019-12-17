const express = require('express')
const debug = require('debug')
const log = debug('democracyos:ext:api:search')
const models = require('lib/models')
const api = require('../db-api')

const Topic = models.Topic
const Forum = models.Forum

const app = module.exports = express()

app.get(
  '/authors',
  function(req, res, next) {
    log('Find authors')
    return Promise.all([Forum.find().distinct('extra.owner'), Topic.find().distinct('author')])
      .then((response) => {
        const authors = [...response[0], ...response[1]]
          .filter( author => author !== '')
        return res.json(authors)
      })
      .catch(next)
  }
)

app.get(
  '/:string/:kind/:author?',
  function(req, res, next) {
    log('Find by text on Forums and Topics')

    const {
      string,
      kind,
      author
    } = req.params

    const isConsulta = kind.includes('consulta')
    const isEje = kind.includes('eje')

    if (!(isConsulta || isEje)) next(new Error('Invalid kind argument'))

    const regex = createRegex(string)
    const regexAuthor = createRegex(author || '')

    const mainQuery = { '$and': [] }
    const simpleQuery = { '$or' : [] }
    const authorQuery = { '$or': [] }

    if (isConsulta) {
      simpleQuery['$or'].push({ name: regex })
      simpleQuery['$or'].push({ title: regex })
      simpleQuery['$or'].push({ summary: regex })
      simpleQuery['$or'].push({ 'extra.richSummary': regex })
      if (author) {
        authorQuery['$or'].push({ 'extra.owner': regexAuthor })
      }
    }

    if (isEje) {
      simpleQuery['$or'].push({ mediaTitle: regex })
      if (author) {
        authorQuery['$or'].push({ 'author': regexAuthor })
      }
    }

    mainQuery['$and'].push(simpleQuery)
    if (authorQuery['$or'].length) {
      mainQuery['$and'].push(authorQuery)
    }

    return Promise.all([Forum.find(mainQuery), Topic.find(mainQuery).populate('forum')])
      .then((response) => {
        return res.json([...response[0], ...response[1]])
      })
      .catch(next)
  }
)

const createRegex = (string) => ({ '$regex': string, '$options': 'i' })
