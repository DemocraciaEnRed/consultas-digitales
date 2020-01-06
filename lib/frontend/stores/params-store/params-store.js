import request from 'lib/frontend/request/request'
import Store from '../store/store'

class ParamsStore extends Store {
  constructor () {
    super()

    this.getRegexps().then((regexps) => {
      this.regexps = {}
      for (var key in regexps) {
        if (typeof regexps[key] === 'string' && regexps[key][0] == '/') {
          this.regexps[key] = eval(regexps[key])
        }else if (typeof regexps[key] === 'object' && Object.keys(regexps[key])){
          var keys = Object.keys(regexps[key])
          for (var i in keys){
            var subkey = keys[i]
            if (typeof regexps[key][subkey] === 'string' && regexps[key][subkey][0] == '/') {
              if (this.regexps[key] === undefined)
                this.regexps[key] = {}
              this.regexps[key][subkey] = eval(regexps[key][subkey])
            }
          }
        }
      }
    })
  }
  
  name () {
    return 'params'
  }

  getRegexps () {
    let url = this.url() + '/regexps'

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

export default new ParamsStore()
