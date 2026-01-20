import React, { useState } from 'react'
import { FaCaretDown, FaShopify } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
const DropDown = ({dropOptions,nameofele,handleDropoption,selectedEle,setFormData}) => {
    const [showdrop,setDrop]=useState(false)
    const [data,setData]=useState(dropOptions)
    const isSingleSelect = nameofele === "positionApplyingFor"

    const handleclick=()=>{
        setDrop(!showdrop)
    }

    const handelselect=(ele)=>{
        setData(data.filter((item)=>item!==ele))
    }
    
    const handleskills=(e,nameofele,value)=>{
    e.stopPropagation();
    
    if(isSingleSelect) {
        // For single select (Job), add back the previous selection to the list
        if(selectedEle) {
            setData([...data, selectedEle])
        }
        // Clear the selected value
        setFormData((preValue)=>({
         ...preValue,[nameofele]:""
        }))
    } else {
        // For multi-select (Skills)
        setData([...data,value])
        setFormData((preValue)=>({
         ...preValue,[nameofele]:preValue[nameofele].filter((item)=>item!==value)
        }))
    }

    // console.log(selectedEle);
    
  }

  return (
    <div className='h-11 w-full relative border-b-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors' onClick={handleclick}>
        <div className='flex justify-between items-center h-full px-1'>
          
            <div className='flex-1 min-w-0'>
                {
                    Array.isArray(selectedEle) ? (
                      selectedEle.length==0? <span className='text-sm sm:text-base text-gray-500'> {nameofele}</span>:<div className='flex gap-2 overflow-x-auto text-nowrap'>

                        {
                            selectedEle.map((ele,ind)=>(
                                <span key={ind} className='flex gap-1 items-center bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap'>{ele}
                                <RxCross2 className='text-white cursor-pointer hover:text-red-200'  onClick={(e)=>handleskills(e,nameofele,ele)}/>

                                </span>

                            ))
                        }
                    </div>
                    ) : (
                      selectedEle ? <div className='flex gap-2 overflow-x-auto text-nowrap'>
                        <span className='flex gap-1 items-center bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap'>{selectedEle}
                        <RxCross2 className='text-white cursor-pointer hover:text-red-200'  onClick={(e)=>handleskills(e,nameofele,selectedEle)}/>
                        </span>
                      </div> : <span className='text-sm sm:text-base text-gray-500'>{nameofele}</span>
                    )
                 }
            </div>
            <span className={`duration-200 text-gray-600 flex-shrink-0 ${showdrop ? "rotate-180" : "rotate-0"}`}><FaCaretDown /></span>
        </div>
        {
            showdrop && <div className='absolute w-full top-11 bg-white max-h-48 overflow-y-auto z-10 border-2 border-gray-300 rounded-b-lg shadow-lg'>
                {
                    data.map((opt,ind)=> <div key={ind} className='w-full hover:bg-blue-100 transition-colors cursor-pointer' onClick={(ele)=>{
                        if(isSingleSelect) {
                            // For single select: add previous selection back to list if it exists
                            let newData = data.filter((item)=>item!==opt)
                            if(selectedEle) {
                                newData = [selectedEle, ...newData]
                            }
                            setData(newData)
                            handleDropoption(ele,nameofele,opt)
                        } else {
                            // For multi-select: existing behavior
                            handleDropoption(ele,nameofele,opt)
                            handelselect(opt)
                        }
                     }}>
                            {
                                <span className='p-2 block text-sm sm:text-base'>
                                    {/* {!selectedEle.includes(opt) && opt} */}
                                    {opt}
                                </span>
                            }
                        </div>
                    )
                }        </div>
        }
    </div>
  )
}

export default DropDown