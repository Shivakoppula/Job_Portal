import React from 'react'
import "./components/style/style.css"
import { RouterProvider } from 'react-router-dom'
import router from './components/router/router'
import { Toaster } from 'react-hot-toast'
import Login from './components/login/Login'
const App = () => {
  return (
    <>
    
    <RouterProvider router={router}></RouterProvider>
    {/* <Login/> */}
    <Toaster></Toaster>
    </>
  )
}

export default App