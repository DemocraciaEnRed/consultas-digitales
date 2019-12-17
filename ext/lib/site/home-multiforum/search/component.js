import React from 'react'
import searchStore from '../../../stores/search-store/search-store'

import SearchBar from './search-bar/component'
import ResultsSearch from './results-search/component'

class Search extends React.Component {
  state = {
    show: false,
    authors: [],
    author: '',
    kind: 'eje,consultas',
    term: '',
    results: null
  }

  componentWillMount = () => {
    searchStore.findAuthors()
      .then((authors) => {
        this.setState({ authors })
      })
  }

  handleChange = (e) => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  toggleAdvanceForm = (bool) => {
    this.setState({
      show: bool
    })
  }

  execSearch = () => {
    const {
      kind,
      author,
      term,
      results
    } = this.state

    searchStore.findBy(term, kind, author)
      .then(results => {
        this.setState({
          results
        })
      })
  }

  render() {
    const { results, term } = this.state

    const showResults = results && results.length
    const showEmpty = results && !results.length

    return (
      <div>
        <SearchBar
          handleChange={this.handleChange}
          toggleAdvanceForm={this.toggleAdvanceForm}
          execSearch={this.execSearch}
          state={this.state}
        />
        {showResults ? <ResultsSearch results={results} term={term} /> : null}
        {showEmpty && <p style={{margin: '35px 0', textAlign: 'center'}}>
        No se han encontrado resultados
        </p>
        }
      </div>
    )
  }
}

export default Search
