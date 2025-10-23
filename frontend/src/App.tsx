import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NavBar from "./components/NavBar"
import Profil from "./pages/Profil"
import Seances from "./pages/Seances"

const App = () => {

  return (
    <>
      <div className='max-w-[80vw] max-h-[80vw] bg-gray-500 mx-auto'> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/seances' element={<Seances />}/>
          <Route path='/profil' element={<Profil />}/>
        </Routes>
      </div>
      <div className='max-w-[80vw] max-h-[80vw] bg-gray-500 mx-auto'>
        <NavBar/>
      </div>
    </>
  )
}

export default App
