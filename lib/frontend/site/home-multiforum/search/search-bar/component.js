import React from 'react'

const SearchBar = ({
  state,
  toggleAdvanceForm,
  handleChange,
  execSearch,
}) => (
  <div className='searchbar-container'>
    <div className='searchbar'>
      <input
        type="text"
        name="term"
        onFocus={toggleAdvanceForm.bind(this, false)}
        placeholder=""
        onChange={handleChange}
      />
      <button
        type="submit"
        onClick={execSearch}
      >
        <i className='icon-find' />
        Buscar
      </button>
    </div>
    <div
      
      className={`advancedsearch ${state.show ? 'show': 'hide'}`}
    >
      <div className='button-link'>
        <a href="" className="reiniciar">Reiniciar búsqueda</a>
      </div>
      <div>
        <legend>Buscar por</legend>
        <label>
          <input
            name="kind"
            type="radio"
            value="eje,consultas"
            onChange={handleChange}
            checked={state.kind === 'eje,consultas'}
          />
            Todos los resultados
        </label>
        <label>
          <input
            name="kind"
            type="radio"
            value="eje"
            onChange={handleChange}
            checked={state.kind === 'eje'}
          />
            Sólo ejes y propuestas
        </label>
        <label>
          <input
            name="kind"
            type="radio"
            value="consultas"
            onChange={handleChange}
            checked={state.kind === 'consultas'}
          />
            Sólo consultas
        </label>
      </div>
      <div className="form-group item-form">
        <legend>Autor</legend>
        <select className="form-control">
          <option value="" defaultValue>Todos los autores</option>
          {state.authors.map((author) =>
            <option key={author} value={author}>{author}</option>
          )}
        </select>
      </div>
      <div className="button-link form">
        <button
          className="btn btn-link"
          onClick={toggleAdvanceForm.bind(this, false)}
        >
          Cancelar
        </button>
        <button
          className="btn btn-success"
          onClick={execSearch}
        >
          Aplicar
        </button>
      </div>
    </div>
  </div>
)

export default SearchBar
