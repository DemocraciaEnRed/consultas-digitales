import 'ext/lib/header/user-badge/component'
import * as Header from 'lib/frontend/header/component'
import * as HeaderOverride from 'ext/lib/header/component'

import * as TopicForm from 'lib/admin/admin-topics-form/view'
import * as TopicFormOverride from 'ext/lib/admin/admin-topics-form/view'

Object.assign(Header, HeaderOverride)
Object.assign(TopicForm, TopicFormOverride)
