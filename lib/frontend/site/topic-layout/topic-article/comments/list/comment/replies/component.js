import React from 'react'
import RepliesForm from 'lib/frontend/site/topic-layout/topic-article/comments/list/comment/replies/form/component'
import RepliesList from 'lib/frontend/site/topic-layout/topic-article/comments/list/comment/replies/list/component'

export default function CommentReplies (props) {
  if (!props.repliesVisibility) return null
  return (
    <div className='comments-replies-container'>
      <RepliesList
        onDeleteReply={props.onDeleteReply}
        commentId={props.commentId}
        replies={props.replies}
        onReplyEdit={props.onReplyEdit}
        forum={props.forum}
        user={props.user} />
      {
        new Date(props.topic.closingAt) > new Date() &&
          <RepliesForm
            commentId={props.commentId}
            onSubmit={props.onReply}
            commentsReplying={props.commentsReplying}
            forum={props.forum}
            topic={props.topic} />
      }
    </div>
  )
}
