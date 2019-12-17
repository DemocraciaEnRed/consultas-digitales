import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Vote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {
        'positive' : 'Votos a favor',
        'neutral' : 'Votos en abstención',
        'negative' : 'Votos en contra',

      }
    }
  }


  render() {
    let { topic } = this.props
    let { options } = this.state
    return (
      <div className="general-stats-container">
         <div className="alert alert-warning text-center">
          Han participado <b>{topic.action.count}</b> usuarios
        </div>
          <table className="table table-condensed">
            <thead>
                 <tr>
              <th colSpan="3" className="bg-primary">Tipo de acción: Voto</th>
            </tr>
            <tr>
              <th className="bg-light">Opción</th>
              <th className="bg-light text-center">Votos</th>
              <th className="bg-light text-center">Porc.</th>
            </tr>
            </thead>
            <tbody>
              {
              topic.action.results.map((option, i) => 
                <tr>
                  <td>
                    {options[option.value]}
                  </td>
                  <td className="bg-light text-center">
                    {option.votes}
                  </td>
                  <td className="bg-light text-center">
                    {option.percentage} %
              </td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
    )
  }
}