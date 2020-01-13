import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import t from 't-component'
import Footer from 'lib/frontend/site/footer/component'
import Sidebar from 'ext/lib/site/help/sidebar/component'
import MarkdownGuide from 'lib/frontend/site/help/md-guide/component'
import * as articles from './articles'
import Stats from './stats/component'


export default class HelpLayout extends PureComponent {
  articles = [
    {
      title: '¿Cómo funciona?',
      Content: () => <Content content={articles.como} />,
      slug: 'como-funciona',
      path: '/ayuda/como-funciona'
    },
    {
      title: 'Acerca de este sitio',
      Content: () => <Content content={articles.acerca} />,
      slug: 'acerca',
      path: '/ayuda/acerca'
    },
        {
      title: 'Estadisticas',
      Content: Stats,
      slug: 'estadisticas',
      path: '/ayuda/estadisticas'
    },
    {
      title: t('help.tos.title'),
      Content: () => <Content content={articles.tos} />,
      slug: 'terminos-y-condiciones',
      path: '/ayuda/terminos-y-condiciones'
    },
    {
      title: t('help.pp.title'),
      Content: () => <Content content={articles.pp} />,
      slug: 'privacidad',
      path: '/ayuda/privacidad'
    },
    {
      title: t('help.markdown.title'),
      Content: MarkdownGuide,
      slug: 'markdown',
      path: '/ayuda/markdown'
    }
  ]

  render () {
    const article = this.props.params.article || this.articles[0].slug
    const active = this.articles.find((art) => art.slug === article)

    return (
      <div>
        <div className='help-container container'>
          <ol className='breadcrumb'>
            <li className='breadcrumb-item'>
              <Link to='/'>Consultas</Link>
            </li>
            <li className='breadcrumb-item active'>
              <Link to='/ayuda'>Ayuda</Link>
            </li>
            <li className='breadcrumb-item active'>
              <span>{active.title}</span>
            </li>
          </ol>
          <section>
            <div className='row'>
              <aside className='col-md-4'>
                <Sidebar
                  activeSlug={active.slug}
                  articles={this.articles} />
              </aside>
              <article className='help-content col-md-8'>
                <active.Content />
              </article>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    )
  }
}

const Content = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
)
