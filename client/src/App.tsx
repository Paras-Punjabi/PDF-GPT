import React from 'react'
import Sidebar from './components/Sidebar'
import Home from './components/Home'

const App = () => {
  return (
    <React.Fragment>
      <Sidebar notify={()=>{}}/>
      <Home/>
    </React.Fragment>
  )
}

export default App