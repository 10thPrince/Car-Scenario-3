import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import LogIn from './components/LogIn'

function App() {
  

  return (
    <>
      <Routes>
        <Route index element={<LogIn />} />
        {/*<Route path='' element={} />*/}
      </Routes>
    </>
  )
}

export default App
