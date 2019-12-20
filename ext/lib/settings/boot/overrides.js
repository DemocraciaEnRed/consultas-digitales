import 'ext/lib/boot/overrides'

import * as ForumForm from 'lib/frontend/settings/forum-new/forum-form/forum-form'
import ForumFormExt from 'ext/lib/settings/forum-new/forum-form/forum-form'

import * as UserBadgeView from 'lib/frontend/settings/settings-user-badges/view'
import UserBadgeViewExt from 'ext/lib/settings/settings-user-badges/view'


ForumForm.default = ForumFormExt
UserBadgeView.default = UserBadgeViewExt
