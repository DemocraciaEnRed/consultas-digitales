import request from 'lib/frontend/request/request'
import Store from '../store/store'

class TagStore extends Store {
  constructor () {
    super()

    this.getTagImages().then((tagImages) => {
      this.tagImages = tagImages
    })
  }
  
  name () {
    return 'tag'
  }

  getTagImages () {
    let url = this.url() + '/tag-images'

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

export default new TagStore()
