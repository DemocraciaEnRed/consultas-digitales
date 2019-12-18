var urlBuilder = require('lib/backend/url-builder')

module.exports = function () {
  urlBuilder.register('site.topic', '/:forum/consulta/:id')
  urlBuilder.register('site.help', '/ayuda')
  urlBuilder.register('site.help.article', '/ayuda/:article')
  urlBuilder.register('site.notifications', '/notificaciones')

  urlBuilder.register('settings', '/ajustes')
  urlBuilder.register('settings.profile', '/ajustes/perfil')
  urlBuilder.register('settings.password', '/ajustes/contrasena')
  urlBuilder.register('settings.notifications', '/ajustes/notificaciones')
  urlBuilder.register('settings.forums', '/ajustes/administrar')
  urlBuilder.register('settings.user-badges', '/ajustes/user-badges')

  urlBuilder.register('user-verify', '/user-verify')
  urlBuilder.register('topics-ext', '/topics-ext')
}
