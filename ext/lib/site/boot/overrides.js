import 'ext/lib/boot/overrides'

import * as Help from 'lib/frontend/site/help/component'
import HelpExt from 'ext/lib/site/help/component'

import * as SignIn from 'lib/frontend/site/sign-in/component'
import SignInExt from 'ext/lib/site/sign-in/component'

Help.default = HelpExt
SignIn.default = SignInExt