import React from 'react'
import { assets } from "../assets/assets.ts"
import "../index.css"

const Home = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl mb-10'>FlowFit</h1>
      <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-3 w-full'>
        <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between'>
          <img className='w-[40px] icon-blue' src={assets.IconMuscu} alt="Icon Muscu" />
          <div>
            <p className='flex justify-end'>Musculation</p>
            <span>... exercices</span>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between'>
          <img className='w-[40px] icon-blue' src={assets.IconYoga} alt="Icon Yoga" />
          <div>
            <p className='flex justify-end'>Yoga</p>
            <span>... exercices</span>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-4 justify-between'>
          <img className='w-[40px] icon-blue' src={assets.IconMobility} alt="Icon Mobilité" />
          <div>
            <p className='flex justify-end'>Mobilité</p>
            <span>... exercices</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home