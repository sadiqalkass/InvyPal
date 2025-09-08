import React from 'react'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
      <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
