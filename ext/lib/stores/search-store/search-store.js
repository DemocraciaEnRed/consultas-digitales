import request from 'lib/frontend/request/request'
import Store from 'lib/stores/store/store'
import urlBuilder from 'lib/backend/url-builder'

class SearchStore extends Store {
  constructor () {
    super()
  }

  name () {
    return 'search'
  }

  findBy(term, kind = 'eje,consulta', author = '') {
    const url = `/ext/api/search/${term}/${kind}/${author}`
    const fetch = new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
        })
    })

    return fetch
  }

  findAuthors() {
    const url = `/ext/api/search/authors`
    const fetch = new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
        })
    })

    return fetch
  }
}

export default new SearchStore()