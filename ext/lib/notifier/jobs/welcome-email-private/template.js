const config = require('lib/config')
const utils = require('lib/backend/utils')

const html = require('es6-string-html-template').html
const raw = require('es6-string-html-template').raw
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice')

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName,
  userEmail,
  password
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Te damos la bienvenida a <strong>${config.organizationName}</strong>. Han hecho tu registro para que comiences a participar.</p>
    <p>Para ingresar, accede entrando a la plataforma e ingresando tu dirección de correo (<strong>${userEmail}</strong>) y la siguiente contraseña: <strong>${password}</strong></p>
    ${buttonTemplate({
      url: baseUrl,
      text: 'Entrar a la plataforma'
    })}
    <p style='font-size:16px'><strong>¡Te pedimos que la primera acción que hagas sea cambiar la contraseña entrando a tu perfil!</strong></p>
    <p>Muchas gracias, ¡Te esperamos!</p>
    <p style='font-size:12px'><i>Si el botón de "Entrar a la plataforma" botón no funciona, copiá y pegá el siguiente link en tu navegador: <a href="${baseUrl}" target="_blank">${baseUrl}</a></i></p>
  `
})
