import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Hierarchy extends Component {
  constructor(props) {
    super(props)
    this.state = {
     
    }
  }

  render() {
    let { topic } = this.props
    return (
      <div className="general-stats-container">
        <div className="alert alert-warning text-center">
          Han participado <b>{topic.action.count}</b> usuarios
        </div>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th colSpan="2" className="bg-primary">Tipo de acción: Herarquia</th>
            </tr>
            <tr>
              <th className="bg-light">Opción</th>
              <th className="bg-light text-center">Posición</th>
            </tr>
          </thead>
          <tbody>
            {
              topic.action.results.map((option, i) => 
                <tr>
                  <td >
                    {option.value}
                  </td>
                  <td className="bg-light text-center">
                    {option.position}°
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