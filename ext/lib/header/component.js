import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import isAbsoluteUrl from 'is-absolute-url'
import UserBadge from 'lib/header/user-badge/component'
import AnonUser from 'lib/header/anon-user/component'
import userConnector from 'lib/site/connectors/user'
import config from 'lib/config'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userForm: null,
      showToggleSidebar: null,
      showSidebar: null
    }
  }

  componentWillMount () {
    bus.on('user-form:load', this.onLoadUserForm)
    bus.on('sidebar:enable', this.showToggleSidebarChange)
    bus.on('sidebar:show', this.showSidebarChange)
  }

  componentWillUnmount () {
    bus.off('user-form:load', this.onLoadUserForm)
    bus.off('sidebar:enable', this.showToggleSidebarChange)
    bus.off('sidebar:show', this.showSidebarChange)
  }

  onLoadUserForm = (formName) => {
    this.setState({
      userForm: formName
    })
  }

  showToggleSidebarChange = (bool) => {
    this.setState({
      showToggleSidebar: bool
    })
  }

  showSidebarChange = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleToggleSidebar = (evt) => {
    evt.preventDefault()
    bus.emit('sidebar:show', !this.state.showSidebar)
  }

  render () {
    const classes = ['header ext-header']

    if (config.headerContrast) classes.push('with-contrast')

    return (
      <header className={classes.join(' ')}>
        <div className='container header-items-wrapper'>
          {
            this.state.showToggleSidebar &&
            (
              <button
                id='toggleButton'
                onClick={this.handleToggleSidebar}>
                <span className='icon-menu' />
              </button>
            )
          }

          <Logo />

          <div className='header-items'>
            <div className='header-item org-link'>
              <Link
                to='/ayuda/como-funciona'
                className='header-link hidden-md-down'>
                <span>¿Cómo participo?</span>
              </Link>
            </div>

            {/* Sacamos el ícono momentáneamente
            this.props.user.state.fulfilled && (
              <div className='header-item notifications-link'>
                <Link
                  to='/notificaciones'
                  className='header-link'>
                  <span className='icon-bell' />
                </Link>
              </div>
            )*/}

            {this.props.user.state.fulfilled && (
              <UserBadge />
            )}

            {this.props.user.state.rejected && (
              <AnonUser form={this.state.userForm} />
            )}
          </div>
        </div>
      </header>
    )
  }
}

const Logo = () => {
  const isAbsolute = isAbsoluteUrl(config.homeLink)

  const Element = isAbsolute ? React.DOM.a : Link

  const props = {
    className: 'logo',
    [isAbsolute ? 'href' : 'to']: config.homeLink,
    rel: isAbsolute ? 'noopener nofollow' : null
  }

  return (
    <Element {...props}>
      <img className='logo-desktop' src={config.logo} />
      <img className='logo-mobile' src={config.logoMobile} />
    </Element>
  )
}

export default userConnector(Header)
