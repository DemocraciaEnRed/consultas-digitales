import React, { Component } from 'react'
import Jump from 'jump.js'

export default ({ nodes }) => (
  <div className={`lateral-bar-container ${nodes.length > 0 ? 'large' : 'small'}`}>
    <ul className={nodes.length > 7 ? 'lateral-bar-list large' : 'lateral-bar-list'}>
      {nodes.map((node,i) => (
        <li className='lateral-bar-item' key={i}>
          <a onClick={() => Jump(node)}>{node.innerText}</a>
        </li>
      ))
      }
    </ul>
  </div>
)
