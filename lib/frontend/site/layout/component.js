import React from 'react'
import Header from 'lib/frontend/header/component'

export default ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
  </div>
)
