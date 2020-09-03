const config = require('lib/config')
const utils = require('lib/backend/utils')

const html = require('es6-string-html-template').html
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName, topicTitle, comment, url
}, {
  lang
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>El usuario <strong>${comment.author.fullName}</strong> comentó en <strong>${topicTitle}</strong>:</p>
    <div style='padding:15px;border-radius: 5px;'><i>${comment.text}</i></div>
    <br />
    ${buttonTemplate({
      url: url,
      text: 'Ver comentario'
    })}
    <p>Saludos,<br /><strong>${config.organizationName}</strong></p>

  `
})
