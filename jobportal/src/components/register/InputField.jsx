import React from 'react'

const InputField = ({name,value,handleChange,children,type,isBlackgroud,maxLength}) => {
  return (
    <div className={`border-b-2 flex h-11 relative justify-center items-center w-full group focus-within:border-2 transition-colors ${value ? "border-2" : "border-gray-300"} ${isBlackgroud ? 'border-red-500' : 'border-black'}`}>
    
        <input 
          type={type} 
          id={name} 
          className='w-full outline-none h-11 flex justify-center items-center px-1.5 sm:px-2 text-sm sm:text-base' 
          onChange={handleChange} 
          value={value} 
          name={name}
          maxLength={maxLength}
        />
        <label 
          htmlFor={name} 
          className={`absolute left-[5.5px] group-focus-within:-top-3 text-xs sm:text-sm capitalize group-focus-within:bg-white transition-all duration-200 ${value ? "-top-3 bg-white" : "left-[5.5px]"}`}
        >
          {name}
        </label>
        
        {children}
    
    </div>
  )
}

export default InputField