import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Link } from 'react-router'
import Jump from 'jump.js'
import userConnector from 'lib/frontend/site/connectors/user'
import config from 'lib/config'
import Footer from 'ext/lib/site/footer/component'
import forumStore from 'ext/lib/stores/forum-store/forum-store'
import ForumContainer from './forum-container/component'
import ForumCard from './forum-card/component'
import Search from './search/component'

class HomeMultiForum extends Component {
  constructor (props) {
    super(props) 

    this.state = {
      page: 0,
      activeFilter: 'byDate',
      forums: []
    }
  }

  componentDidMount () {
    const {
      activeFilter
    } = this.state;

    forumStore
      .filterBy(activeFilter)
      .then((forums) => {
        this.setState({
          forums,
          // las páginas son de a 3 (definido en ext/lib/api/filter.js), entonces si devuelve 3, tal vez hay más
          showMore: forums.length === 3
        })
      })
      .catch(console.error)
  }

  handleClick = (name) => {
    const { page } = this.state;

    forumStore
      .filterBy(name)
      .then((forums) => {
        this.setState({
          page,
          forums,
          activeFilter: name
        })
      })
      .catch(console.error)
  }

  handleMoreClick = () => {
    const {
      page,
      activeFilter
    } = this.state;

    forumStore
      .filterBy(activeFilter, page + 1)
      .then((forums) => {
        this.setState({
          page: this.state.page + 1,
          forums: [...this.state.forums, ...forums],
          showMore: forums.length === 3
        });
      })
      .catch(console.error)
  }

  handleButtonClick = () => {
    Jump('#consultas')
    // const consultasNode = ReactDOM.findDOMNode(this.refs.consultas)
    // window.scrollTo(0, consultasNode.offsetTop)
  }

  render () {
    if (this.props.user.state.pending) return null

    const {
      showMore,
      activeFilter,
      forums
    } = this.state

    return (
      <div className='ext-site-home-multiforum'>
        <section
          className='cover jumbotron'
          style={{
            backgroundImage: `url('/ext/lib/site/home-multiforum/header-background.jpeg')`
          }}>
          <div className='jumbotron_body'>
            <div className='container'>
              <img
                src="/ext/lib/site/home-multiforum/logo-grande-consultas-digitales.png"
                alt="Logo"
                width="270px"
              />
              <p className='lead highlight'>
                Construyamos una país más abierto, transparente y colaborativo.
              </p>
              <button
                className='btn btn-primary'
                onClick={this.handleButtonClick}
              >
                Quiero participar
              </button>
            </div>
          </div>
        </section>
        <div className='lead-paragraph'>
          <p>
            <span className="skyblue">{config.organizationName}</span> es un canal de diálogo y debate que permite la interacción entre el gobierno y la comunidad,
            <br />
            promueve la participación ciudadana y ayuda a fortalecer la democracia.
          </p>
          <br />
          <p className="bold">
            Seguí estos pasos para participar y debatir de forma efectiva y colaborativa
          </p>
        </div>
        <div className='section-icons col-md-10 offset-md-1'>
          <div className='row'>
            <div className='section-icon col-md-4'>
              <img
                className='icon'
                src='/ext/lib/site/home-multiforum/icono_consulta-publica-1.svg'
                alt='Informate'
              />
              <div className='text'>
                <h5>Informate</h5> sobre las consultas disponibles
              </div>
            </div>
            <div className='section-icon col-md-4'>
             <img
                className='icon'
                src='/ext/lib/site/home-multiforum/icono_consulta-publica-2.svg'
                alt='Participá'
              />
              <div className='text'>
                <h5>Participá</h5> en los ejes de las consultas
              </div>
            </div>
            <div className='section-icon col-md-4'>
             <img
                className='icon'
                src='/ext/lib/site/home-multiforum/icono_consulta-publica-3.svg'
                alt='Compartí'
              />
              <div className='text'>
                <h5>Compartí</h5> tu opinión, voto o comentario
              </div>
            </div>
          </div>
        </div>

        <div className='lead-paragraph last col-md-4 offset-md-4 col-xs-12'>
          <i className='icon-arrow-down' onClick={this.handleButtonClick} />
        </div>

        <div className='container forums-list' id='consultas'>
          <h2 className='forums-list-title'>Conocé las consultas</h2>
          <div className="filter-container content-center">
            <div className="btn-group btn-group-sm dropdown-element" role="group" aria-label="Filtros">
            <button
                className={`btn dropbtn ${activeFilter === 'byDate' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byDate')}
              >
              {(() => {
                switch(this.state.activeFilter) {
                  case 'byDate':
                    return  'Nuevas'
                  case 'byPopular':
                    return 'Relevantes'
                  case 'byClosed':
                    return 'Finalizadas'
                  }
              })()}
              </button>
            <ul className='dropdown-content'>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byDate' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byDate')}
              >
                Nuevas
              </li>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byPopular' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byPopular')}
              >
                Relevantes
              </li>
              <li
                className={`btn btn-item-dropdown ${activeFilter === 'byClosed' ? 'btn-active' : 'btn-secondary'}`}
                onClick={this.handleClick.bind(this, 'byClosed')}
              >
                Finalizadas
              </li></ul>
            </div>
          </div>

          <Search />

          {!forums.length && <h3 className="no-result content-center">No hay resultados</h3>}

          {!!forums.length && forums.map((forum, key) => (
            <ForumContainer forum={forum} key={forum.id} />
          ))}
          {!!forums.length && showMore &&
            <div className='row content-center'>
              <button className="btn btn-active show-more" onClick={this.handleMoreClick}>
                Cargar más consultas
              </button>
            </div>
          }
        </div>
        <Footer />
      </div>
    )
  }
}

export default userConnector(HomeMultiForum)
