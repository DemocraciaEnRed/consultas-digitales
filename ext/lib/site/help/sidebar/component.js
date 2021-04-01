import React, { PureComponent } from 'react'
import { Link, browserHistory } from 'react-router'

export default class Sidebar extends PureComponent {

  goTo(path) {
    console.log(path)
    window.scrollTo(0, 0);
    browserHistory.push(path)
  }

  render () {
    return (
      <div className='page-sidebar'>
        <ul className='nav nav-pills nav-stacked'>
          {this.props.articles.map((article, key) => (
            <li className={this.props.activeSlug === article.slug ? 'active' : ''}>
              <a key={key} onClick={() => this.goTo(article.path)} style={{'cursor': 'pointer'}}>{article.title}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
