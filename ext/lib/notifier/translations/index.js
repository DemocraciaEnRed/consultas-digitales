const translations = require('democracyos-notifier/lib/translations')
const config = require('lib/config')

const t = translations.t

const overrides = {
  'templates.email.greeting': 'Estimado/a, {userName}',
  'templates.email.signature': config.organizationName,

  'templates.welcome-email.subject': 'Bienvenido a ' + config.organizationName,
  'templates.welcome-email.body': 'Para completar su registro haga <a href=\"{validateUrl}\">click aquí.</a>',
  'templates.welcome-email.ps': 'Si no ha sido usted quien se registró, por favor ignore este correo electrónico.',

  'templates.comment-reply.subject': 'Alguien respondió tu comentario',
  'templates.comment-reply.body': 'Tienes una nueva respuesta a tu comentario.',
  'templates.comment-reply.body2': 'Por favor <a href=\"{url}\">cliquea aquí</a> para verla.',

  'templates.topic-published.subject': 'Nuevo tema publicado',
  'templates.topic-published.body': 'Un nuevo tema fue publicado:',
  'templates.topic-published.body2': 'Por favor <a href=\"{url}\">cliquea aquí</a> para verlo.'
}

Object.assign(t.es, overrides)
Object.assign(t.en, overrides)
