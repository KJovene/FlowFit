import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from "../assets/assets.ts"
import "../index.css"

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-row justify-between px-4 py-4 gap-2'>
      <button 
        onClick={() => navigate('/')} 
        className='flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0'
      >
        <img className='w-[30px] py-2 icon-blue' src={assets.Home} alt="" />
        <p>Home</p>
      </button>
      <button 
        onClick={() => navigate('/profil')} 
        className='flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0'
      >
        <img className='w-[30px] py-2 icon-blue' src={assets.MesSeances} alt="" />
        <p>Mes Séances</p>
      </button>
      <button 
        onClick={() => navigate('/seances')} 
        className='flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0'
      >
        <img className='w-[30px] py-2 icon-blue' src={assets.Profil} alt="" />
        <p>Profil</p>
      </button>
    </div>
  )
}

export default NavBar