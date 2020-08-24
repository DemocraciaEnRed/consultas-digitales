var crypto = require('crypto')
var path = require('path')
var log = require('debug')('democracyos:config')
var democracyosConfig = require('democracyos-config')
var normalizeEmail = require('lib/backend/normalize-email/normalize-email')
const fs = require('fs')

var env = process.env
var environment = env.NODE_ENV || 'development'

var config = democracyosConfig({
  path: path.join(__dirname, '..', '..', 'config')
})

var defaultToken = 'Generate a secret token and paste it here.'
if (!config.jwtSecret || config.jwtSecret === defaultToken) {
  log('WARNING: Set the config jwtSecret to be able to keep user sessions on restart.')
  var token = crypto.randomBytes(32).toString('hex')
  config.jwtSecret = token
}

config.env = environment

config.staff = config.staff.map(function (email) {
  return normalizeEmail(email, {
    allowEmailAliases: config.allowEmailAliases
  })
})

config.mongoUrl = env.MONGO_URL || env.MONGODB_URI || config.mongoUrl

if (!env.NOTIFICATIONS_MAILER_SERVICE) {
  if (env.SENDGRID_USERNAME && env.SENDGRID_PASSWORD) {
    config.notifications = {
      mailer: {
        service: 'sendgrid',
        auth: {
          user: env.SENDGRID_USERNAME,
          pass: env.SENDGRID_PASSWORD
        },
        name: config.notifications.mailer.name,
        email: config.notifications.mailer.email
      }
    }
  }
}

/*
/* AUTODETECCIÓN DE IMÁGENES
*/
const extensiones = ['svg', 'png', 'jpg', 'jpeg', 'gif', 'ico']

for (const key in config.imgs){

  let path = config.imgs[key]
  const barritaIndex = path.lastIndexOf('/')

  // solo si no tiene extensión
  if (path && path.lastIndexOf('.') < barritaIndex){
    path = path.substr(0, barritaIndex) + '/assets' + path.substr(barritaIndex)
    // le sacamos la barrita del principio
    path = path.substr(1)

    extensiones.forEach(ext => {
      let testPath = `${path}.${ext}`
      // probamos si existe con esta extensión
      if (fs.existsSync(testPath)) {
        log('Imagen autodetectada', testPath);
        //deshacemos operaciones anteriores sobre el path
        testPath = '/' + testPath.replace('/assets', '')

        config.imgs[key] = testPath
      }
    })

  }
}

// las configuraciones que se exponen al front son las que están en el array "client"
// dentro de la configuración; para el back todas son accesibles
module.exports = config
