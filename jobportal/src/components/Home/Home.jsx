import React, { useState } from 'react'
import NavBar from './NavBar'
// import UseUserContextApi from '../customHooks/UseUserContextApi'
import DhashBoard from './DhashBoard';

const Home = () => {
const [isOpen,setIsOpen]=useState(false);
const[isDisplay,setIsDisplay]=useState(false);



const handleMouseIn=()=>{
    setIsOpen(true);
}

const handleMouseOut=()=>{
    setIsOpen(false);
}

const handleDisplay=()=>{
    setIsDisplay(!isDisplay);
}

  return (
    <div className='size-full'>
      <div className='w-80 h-full  fixed -left-72 hover:left-0 duration-100 ' 
      onMouseEnter={handleMouseIn} 
      onMouseLeave={handleMouseOut}
      onClick={handleDisplay}>
        <NavBar></NavBar>
      </div>
      <div className={`duration-100 ${isOpen?"ml-65":"ml-18"}`}>
        <DhashBoard></DhashBoard>
      </div>
    </div>
  )
}

export default Home