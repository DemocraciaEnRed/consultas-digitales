import page from 'page'
import urlBuilder from 'lib/backend/url-builder'
import whitelists from 'lib/frontend/whitelists/whitelists'
import { privileges } from 'lib/backend/middlewares/forum-middlewares/forum-middlewares'
import View from './view'

page(urlBuilder.for('admin.users'),
  privileges('canEdit'),
  whitelists.middleware,
  (ctx) => {
    const view = new View(whitelists.get())
    view.replace('.admin-content')
    ctx.sidebar.set('users')
  }
)
