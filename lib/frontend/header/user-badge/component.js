import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/backend/url-builder'
import config from 'lib/config'
import userConnector from 'lib/frontend/site/connectors/user'

export class UserBadge extends Component {
  /*static links = [
    config.frequentlyAskedQuestions
      ? { label: t('help.faq.title'), path: '/help/faq' }
      : false
  ].filter((p) => p)*/
  static links = [
    { label: 'Acerca de este Sitio', path: '/ayuda/acerca' }
  ]

  constructor (props) {
    super(props)

    this.state = {
      menuUserBadge: false,
      canChangeTopics: false
    }
  }

  componentDidMount () {
    bus.on('forum:change', this.setChangeTopicsPermission)
  }

  componentWillUnmount () {
    bus.off('forum:change', this.setChangeTopicsPermission)
  }

  setChangeTopicsPermission = (forum) => {
    this.setState({
      canChangeTopics: (forum && forum.privileges.canChangeTopics)
    })
  }

  toggleMenu = (e) => {
    this.setState({
      menuUserBadge: !this.state.menuUserBadge
    })
  }

  render () {
    const userAttrs = this.props.user.state.value
    let menuItemAdmin = null, registrarUsuItemAdmin = null

    if (userAttrs.privileges && userAttrs.privileges.canManage) {
      if (config.multiForum) {
        menuItemAdmin = (
          <li>
            <Link to={urlBuilder.for('settings.forums')}>
              {t('header.forums')}
            </Link>
          </li>
        )
      } else {
        menuItemAdmin = (
          <li>
            <Link to={urlBuilder.for('admin')}>
              {t('header.admin')}
            </Link>
          </li>
        )
      }
      if (!config.allowPublicSignUp && userAttrs.staff) {
        registrarUsuItemAdmin = (
          <li>
            <a href='/signup'>
              Registrar usuario
            </a>
          </li>
        )
      }
    }

    const classes = ['user-badge', 'header-item']

    if (this.state.menuUserBadge) classes.push('active')

    return (
      <div className={classes.join(' ')} onClick={this.toggleMenu}>
        <button className='header-link'>
          <img src={userAttrs.avatar} alt='' />
          <span className='name hidden-xs-down'>{userAttrs.firstName}</span>
          <span className='caret hidden-xs-down' />
        </button>
        <ul
          className='dropdown-list'>
          {menuItemAdmin}
          <li className='notifications-li'>
            <Link to={urlBuilder.for('site.notifications')}>
              {t('notifications.title')}
            </Link>
          </li>
          <li>
            <Link to={urlBuilder.for('settings')}>
              {t('header.settings')}
            </Link>
          </li>
          {UserBadge.links.map((link, i) => (
            <li key={`link-${i}`}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
          {!config.allowPublicSignUp && registrarUsuItemAdmin}
          <li>
            <a onClick={this.props.user.logout}>
              {t('header.logout')}
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default userConnector(UserBadge)
