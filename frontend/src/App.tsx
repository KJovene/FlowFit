import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const App = () => {

  return (
    <>
      <div className='max-w-[80vw] max-h-[80vw] bg-gray-500 mx-auto'> 
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </>
  )
}

export default App
