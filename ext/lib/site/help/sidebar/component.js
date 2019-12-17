import React from 'react'
import { Link } from 'react-router'

export default ({
  activeSlug,
  articles
}) => (
  <div className='page-sidebar'>
    <ul className='nav nav-pills nav-stacked'>
      {articles.map((article, key) => (
        <li className={activeSlug === article.slug ? 'active' : ''}>
          <Link key={key} to={article.path}>{article.title}</Link>
        </li>
      ))}
    </ul>
  </div>
)
