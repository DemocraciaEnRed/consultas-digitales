import config from 'lib/config'
import urlBuilder from 'lib/backend/url-builder'
import user from 'lib/frontend/site/user/user'

import Layout from 'lib/frontend/site/layout/component'
import TopicLayout from 'lib/frontend/site/topic-layout/component'
import HomeForum from 'lib/frontend/site/home-forum/component'
import HomeMultiForum from 'lib/frontend/site/home-multiforum/component'
import SignIn from 'lib/frontend/site/sign-in/component'
import SignUp from 'lib/frontend/site/sign-up/component'
import Resend from 'lib/frontend/site/resend/component'
import Forgot from 'lib/frontend/site/forgot/component'
import Reset from 'lib/frontend/site/reset/component'
import Help from 'lib/frontend/site/help/component'
import Notifications from 'lib/frontend/site/notifications/component'
import NotFound from 'lib/frontend/site/error-pages/not-found/component'
import NotAllowed from 'lib/frontend/site/error-pages/not-allowed/component'

/*
  Base routes for the app

  These does not use JSX to allow to change them, before rendering, e.g. from the /ext folder.

  More info: https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/guides/RouteConfiguration.md
*/

export default {
  path: '/',
  component: Layout,
  indexRoute: {
    component: config.multiForum ? HomeMultiForum : HomeForum,
    onEnter: checkRestrictAnon
  },
  childRoutes: [
    { path: '404', component: NotFound },
    { path: '401', component: NotAllowed },
    {
      path: 'signin',
      component: SignIn,
      onEnter: restrictLoggedin
    },
    {
      path: 'signup',
      onEnter: checkRestrictAnon,
      indexRoute: { component: SignUp },
      childRoutes: [
        { path: 'resend-validation-email', component: Resend },
        { path: 'validate/:token', component: Resend },
        { path: ':reference', component: SignUp }
      ]
    },
    {
      path: 'forgot',
      onEnter: restrictLoggedin,
      indexRoute: { component: Forgot },
      childRoutes: [
        { path: 'reset/:token', component: Reset }
      ]
    },
    { path: urlBuilder.for('site.help'), onEnter: checkRestrictAnon, component: Help },
    { path: urlBuilder.for('site.help.article'), onEnter: checkRestrictAnon, component: Help },
    { path: urlBuilder.for('site.notifications'), onEnter: checkRestrictAnon, component: Notifications },
    { path: urlBuilder.for('settings'), onEnter: checkRestrictAnon, component: reload },
    { path: urlBuilder.for('settings') + '/*', onEnter: checkRestrictAnon, component: reload },
    { path: urlBuilder.for('site.topic'), onEnter: checkRestrictAnon, component: TopicLayout },
    { path: urlBuilder.for('forums.new'), onEnter: checkRestrictAnon, component: reload },
    { path: urlBuilder.for('admin'), onEnter: checkRestrictAnon, component: reload },
    { path: urlBuilder.for('admin.wild'), onEnter: checkRestrictAnon, component: reload },
    config.multiForum ? {
      path: urlBuilder.for('site.forum'),
      onEnter: checkRestrictAnon,
      component: HomeForum,
      onEnter: setForumParam
    } : {},
    { path: '*', component: NotFound }
  ]
}

function reload () {
  window.location.reload(false)
  return null
}

function setForumParam (nextState) {
  if (!config.multiForum) {
    nextState.params.forum = config.defaultForum
  }
}

function restrictLoggedin (nextState, replace, next) {
  user.fetch().then(() => {
    if (user.state.rejected) return next()
    window.location = '/'
  }).catch((err) => { throw err })
}

function checkRestrictAnon (nextState, replace, next) {
  user.fetch().then(() => {
    if (!user.state.rejected && this.path == 'signup' && !config.allowPublicSignUp && user.state.value.staff) {
      return next()
    }

    if (this.path == 'signup' && !config.allowPublicSignUp) {
      window.location = '/signin'
      return
    }
    if (this.path == 'signup' && config.allowPublicSignUp) {
      return next()
    }
    
    // si está logineado todo ok
    if (!user.state.rejected) return next()

    if (config.allowPublicAccess) return next()

    window.location = '/signin'
  }).catch((err) => { throw err })
}
