import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  }

  const handleCancel = () => {
    // Go back to home page
    navigate('/home');
  }

  return (
    <div className='w-full h-screen flex justify-center items-center bg-black/70'>
      <div className='bg-white rounded-lg p-8 shadow-lg text-center'>
        <h2 className='text-2xl font-bold mb-6'>Are you sure?</h2>
        <p className='text-gray-600 mb-8'>Do you want to logout from your account?</p>
        
        <div className='flex gap-4 justify-center'>
          <button 
            onClick={handleCancel}
            className='px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 duration-200'
          >
            No
          </button>
          <button 
            onClick={handleLogout}
            className='px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 duration-200'
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout
