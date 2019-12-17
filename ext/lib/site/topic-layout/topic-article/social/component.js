import React, { PureComponent } from 'react'
import t from 't-component'
import config from 'lib/config'
const moment = require('moment')

export default ({ topic }) => {
  const { url, mediaTitle, action } = topic

  const socialLinksUrl = window.location.origin + url
  const twitterText = encodeURIComponent(
    config.tweetText ? t(config.tweetText, { topic }) : mediaTitle
  )
  
  const preventClickBehind = e => {
    e.stopPropagation()
  }

  return (
    <div className='topic-article-content topic-social'>
      <div className='participants-box'>
        <span className='paticipants-box-published'>Publicado</span>
        <span>{
          moment(topic.publishedAt).format('D [de] MMMM YYYY')
        }</span>
        <span className={ topic.closed ? 'icon-lock' : 'icon-lock-open'} style={{marginRight: '5px'}}></span>
        <span className={ topic.closed ? 'closed' : 'open'} >{topic.closed ? 'Cerrada' : 'Disponible'}</span>
        <span>Compartir en redes sociales</span>
      </div>
      <div className='share-links'>
        <a
          href={`http://www.facebook.com/sharer.php?u=${socialLinksUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={preventClickBehind}
          className='icon-social-facebook' />
        <a
          href={`http://twitter.com/share?text=${twitterText}&url=${socialLinksUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          onClick={preventClickBehind}
          className='icon-social-twitter' />
      </div>
    </div>
  )
}
