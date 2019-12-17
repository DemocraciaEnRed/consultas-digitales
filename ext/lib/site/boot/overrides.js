import 'ext/lib/boot/overrides'

import * as HomeForum from 'lib/site/home-forum/component'
import HomeForumExt from 'ext/lib/site/home-forum/component'

import * as HomeMultiForum from 'lib/site/home-multiforum/component'
import HomeMultiForumExt from 'ext/lib/site/home-multiforum/component'

import * as TopicLayout from 'lib/site/topic-layout/component'
import TopicLayoutExt from 'ext/lib/site/topic-layout/component'

import * as Help from 'lib/site/help/component'
import HelpExt from 'ext/lib/site/help/component'

import * as SignIn from 'lib/site/sign-in/component'
import SignInExt from 'ext/lib/site/sign-in/component'

import * as CommentsForm from 'lib/site/topic-layout/topic-article/comments/form/component'
import CommentsFormExt from 'ext/lib/site/topic-layout/topic-article/comments/form/component'

import * as ReplyHeader from 'lib/site/topic-layout/topic-article/comments/list/comment/replies/list/header/component'
import ReplyHeaderExt from 'ext/lib/site/topic-layout/topic-article/comments/list/comment/replies/list/header/component'


HomeForum.default = HomeForumExt
HomeMultiForum.default = HomeMultiForumExt
TopicLayout.default = TopicLayoutExt
Help.default = HelpExt
SignIn.default = SignInExt
CommentsForm.default = CommentsFormExt
ReplyHeader.default = ReplyHeaderExt
