import React from 'react'
import { assests } from '../assests/assests'

const LoadingScreen = () => {
  return (
    <div className='w-full h-[70vh] flex flex-col justify-center items-center'>
        <img src={assests.site_logo} alt="" className='w-23 mb-4' />
        <p className='text-xl'>Please Wait</p>
        <span className="loading loading-dots bg-blue-500 loading-lg"></span>       
    </div>
  )
}

export default LoadingScreen
