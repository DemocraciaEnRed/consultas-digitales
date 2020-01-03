import React from 'react'
import t from 't-component'
import { Link } from 'react-router'
import topicStore from 'lib/frontend/stores/topic-store/topic-store'

export default ({ topic }) => (
  <Link
    to={topic.url}
    className='topic-card panel panel-default panel-md'>
    <div
      className='panel-heading'
      style={{
        backgroundImage: `url("${topicStore.getCoverUrl(topic)}")`
      }} />
    <div className='panel-body'>
      <h3>{topic.mediaTitle}</h3>
      <p className='text-muted'>
        {`${topic.commentersCount} ${t('proposal-article.participant.plural')}`}
      </p>
    </div>
  </Link>
)
