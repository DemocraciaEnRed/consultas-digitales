import page from 'page'
import user from '.lib/user/user.js'
import config from 'lib/config/config.js'

let hidden = config.visibility === 'hidden'

export default function (ctx, next) {
  if (!hidden) return next()
  if (user.logged()) return next()

  page('/signin')
}
