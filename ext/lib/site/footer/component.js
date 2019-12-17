import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default class Footer extends Component {

  render () {
    return (
      <footer className='ext-footer'>
        <div className='footer container'>
          <div className='institutional'>
            <div className='logo gob'>
              <a href='/'>
                <img src='/ext/lib/site/footer/logo-footer.svg' />
              </a>
            </div>
            <p className='text-muted small'>
              Los contenidos de esta página están licenciados bajo <a href='https://www.gnu.org/licenses/gpl-3.0-standalone.html'>GNU General Public License v3.0</a>
            </p>
          </div>
            <nav className='menu'>
              <Link to='/ayuda/como-funciona'>¿Cómo funciona?</Link>
              <Link to='/ayuda/acerca'>Acerca de este sitio</Link>
              <Link to='/ayuda/acerca'>Contacto</Link>
            </nav>
            <nav className='menu'>
              <Link to='/ayuda/terminos-y-condiciones'>{ t('help.tos.title')}</Link>
              <Link to='/ayuda/privacidad'>{ t('help.pp.title')}</Link>
            </nav>
        </div>
      </footer>
    )
  }
}
