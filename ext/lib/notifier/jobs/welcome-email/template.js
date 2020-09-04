const config = require('lib/config')
const utils = require('lib/backend/utils')

const html = require('es6-string-html-template').html
const raw = require('es6-string-html-template').raw
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName,
  validateUrl
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Ha iniciado el proceso de registro para participar en <strong>${config.organizationName}</strong>. Haz click para validar tu usuario y terminar de registrarte:</p>
    ${buttonTemplate({
      url: validateUrl,
      text: 'Validar mi cuenta'
    })}
    <p>Muchas gracias, ¡Te esperamos!</p>
    <p style='font-size:12px'><i>Si el botón de "Validar mi cuenta" botón no funciona, copiá y pegá el siguiente link en tu navegador: <a href="${validateUrl}" target="_blank">${validateUrl}</a></i></p>
    <p style='font-size:12px'><i>PD: Si no ha creado una cuenta en <a href="${baseUrl}" target="_blank">${baseUrl}</a> no se requiere ninguna acción adicional.</i></p>
  `
})
