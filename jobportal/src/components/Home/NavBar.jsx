import React, { useState } from 'react'
import UseUserContextApi from '../customHooks/UseUserContextApi'
import { BiSolidUpArrow } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
 const {globalState} =UseUserContextApi();
 const navigate = useNavigate();
console.log(globalState);
console.log("User object:", globalState.user);
  
const[Isopen,setIsOpen]=useState(false);

const {user} = globalState;
console.log(user+"-------------------" );

const {email, name, college, institute, positionApplyingFor, yearOfPassout, skills, mobile, appliedCompanies} = user || {};
// const {user} = globalState;
// const { = us|| {};

  
const handleClick=()=>{
    setIsOpen(!Isopen);
}

const handleLetterClick=()=>{
    navigate('/logout');
}

  return (
    <div className='w-full flex justify-center items-center min-h-screen'>
      <div className='w-4/5 max-w-3xl flex flex-col gap-3 p-6 bg-white shadow-[0px_0px_25px_2px_#0005] rounded-2xl'>

      <div className='flex '>

        <div className='bg-gray-300 size-17 rounded-full flex justify-center items-center text-4xl font-semibold pb-0.5 cursor-pointer hover:bg-gray-400 duration-200' onClick={handleLetterClick}>
          <div className=''>
            {email?.[0].toUpperCase() || 'U'}
          </div>
        </div>

        <div className='flex flex-col ml-3 text-xl'>
          <span className='font-medium'>{name || 'N/A'}</span>
          <span className='font-medium text-Xs'>{mobile || 'N/A'}</span>
          <span className='font-medium text-xs'>yop:{yearOfPassout || 'N/A'}</span>
        </div>

      </div>

      <div className='text-[13px] font-medium p-1 -ml-2 bg-white/30 rounded flex flex-col gap-3'>
        <span className=''>{email || 'N/A'}</span>
      </div>

      <div className='text-[13px] font-medium p-1 -ml-2 bg-white/30 rounded flex flex-col gap-4 capitalize'>
       <p><span className='font-semibold'>College:</span>{college || 'N/A'}</p>
        <p><span className='font-semibold'>Institute:</span>{institute || 'N/A'}</p>
        <p><span className='font-semibold'>Role:</span>{positionApplyingFor || 'N/A'}</p>
      </div>

      <div className='text-sm font-medium p-1 -ml-2 bg-white/30 rounded'>
        <div className={`flex justify-between items-center cursor-pointer`} onClick={handleClick}>
          <span className='font-semibold'>skills</span>
          <span className={`mr-2 ${Isopen ? 'rotate-180' : ''} duration-100`}><BiSolidUpArrow /></span>
        </div>

        <div className={`${Isopen ? "block":"hidden"} duration-100 mt-2`}>
          <div className='grid grid-cols-2 gap-1'>
            {skills && skills.map((skill, index) => (
              <span key={index} className='bg-gray-200 border border-gray-400 px-2 py-1 rounded text-xs capitalize text-center'>{skill}</span>
            ))}
          </div>
        </div>

        <div className='bg-white/30 rounded p-3'>
         <div className='flex justify-between items-center'>
           <span className='font-semibold'>Total Applied Companies</span>
          <span className='text-2xl font-bold text-slate-800'>{appliedCompanies?.length || 0}</span>
         </div>
        </div>

      </div>
      </div>
    </div>
  )
}

export default NavBar

// export default NavBar