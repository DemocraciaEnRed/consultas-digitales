import request from 'lib/request/request'
import Store from 'lib/stores/store/store'

class UserStore extends Store {
  name () {
    return 'user'
  }

  search (query) {
    //const url = this.url('search', { q: query })
    const url = `/ext/api/user-verify/search?q=${query}`
    console.log('search url', url)

    const fetch = new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          console.log('search end', err, res)
          if (err) return reject(err)
          resolve(res.body)
        })
    })

    return fetch
  }

  requestUserVerify (id) {
    const promise = new Promise((resolve, reject) => {
      const url = `/ext/api/user-verify/${id}`
      
      request
        .post(url)
        .end((err, res) => {
          console.log('requestAccountVerification end', err, res)
          if (err || !res.ok) return reject(err)
          if (res.body.error) return reject(res.body.error)
          resolve(res)
        })
    })

    return promise
  }
}

export default new UserStore()
