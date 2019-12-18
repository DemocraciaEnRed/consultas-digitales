import render from 'lib/backend/render/render'
import template from './template.jade'

export function verifyForumAccess (ctx, next) {
  if (ctx.forum) return next()
  const content = document.querySelector('#content')
  content.innerHTML = render(template)
}
