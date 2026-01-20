import React, { useEffect, useState } from 'react'
import UseUserContextApi from '../customHooks/UseUserContextApi'
import ApisCalling from '../../Service/ApisCalling'
import { RxCross2 } from 'react-icons/rx'
import { RxCross1 } from 'react-icons/rx'
import toast from 'react-hot-toast'
import SpinLoaders from '../loaders/SpinLoaders'

const DhashBoard = () => {
  const {globalState,setGlobalState} = UseUserContextApi()

  const[showDetails,setShowDetails] = useState(false)
  const[selected, setSelected] = useState(null)

  const handleClickOpen = () => {
    setShowDetails(true)
  }

  const handleClickClose = () => {
    setShowDetails(false)
  }

  const handleSelected = (ele) => {
    setSelected(ele)
  }

  const removeHandleSelected = () => {
    setSelected(null)
  }

  const handleApplyClick = (id) => {
    (async() => {
      try {
        let {data, status} = await ApisCalling.applyToCompany(id, globalState.token)
        if(status == "200" || status === 200){
          toast.success("Applied Successfully")
          // Update applied companies in context
          setGlobalState((preval) => ({
            ...preval,
            user: {
              ...preval.user,
              appliedCompanies: [...(preval.user.appliedCompanies || []), id]
            }
          }))
        }
      } catch(error) {
        console.log(error)
        toast.error("Failed to apply")
      }
    })()
  }

  useEffect(() => {
    (async() => {
      setGlobalState((preval) => ({...preval, isLoading: true}))

      try {
        let {data, status} = await ApisCalling.getAllCompanies()
        console.log(data, status);

        if(status == "200" || status === 200){
          setGlobalState((preval) => ({...preval, companies: data.companies, isLoading: false}))
        }
        else{
          setGlobalState((preval) => ({...preval, isLoading: false}))
        }
      }
      catch (error) {
        console.log(error);
        setGlobalState((preval) => ({...preval, isLoading: false}))
      }
    })()
  },[])

  console.log(globalState);

  return (
    <>
      <div className={`flex gap-10 flex-wrap size-full p-20 ${showDetails ? "flex-col" : ""}`}>
        {
          globalState.isLoading ? (
            <div className='w-full flex justify-center items-center'>
              <SpinLoaders />
            </div>
          ) : (
            <>
              {
                globalState.companies && globalState.companies.map((ele) => (
                  <div key={ele._id || ele.id} className='h-[280px] w-[400px] min-w-[400px] max-sm:min-w-0 max-sm:w-full max-sm:h-[360px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-5 relative'>
                    <div className='text-2xl font-bold'>
                      <span>{ele.companyName}</span>
                    </div>

                    <div className='flex gap-2 overflow-x-scroll'>
                      {
                        ele.companyLocation && ele.companyLocation.map((el, index) => (
                          <span key={`${ele._id || ele.id}-loc-${index}`} className='bg-sky-50 p-1.5 text-sm rounded-xl text-blue-400 whitespace-nowrap'>{el}</span>
                        ))
                      }
                    </div>

                    <div className='flex gap-2 overflow-x-scroll'>
                      {
                        ele.requiredSkills && ele.requiredSkills.map((el, index) => (
                          <span key={`${ele._id || ele.id}-skill-${index}`} className='bg-lime-50 p-1.5 text-sm rounded-xl text-lime-800 whitespace-nowrap'>{el}</span>
                        ))
                      }
                    </div>

                    <div className='w-full flex gap-1 max-sm:flex-col'>
                      <div className='grow flex items-center font-bold'>
                        <span className='pr-1'>CTC : </span>
                        <span>{ele.CTC || 'N/A'}</span>
                      </div>
                      <div className='grow font-bold max-sm:flex max-sm:flex-col'>
                        <span>Last Date : </span>
                        <span className='text-red-500'>
                          {ele.applicationDeadline ? ele.applicationDeadline.split("T")[0].split("-").reverse().join("-") : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className='w-full h-10 bg-slate-800 rounded-2xl'>
                      <button className='size-full flex justify-center items-center text-white font-bold' onClick={() => {
                        handleClickOpen()
                        handleSelected(ele)
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              }
            </>
          )
        }
        </div>

      {
        selected && (
          <div className={`h-full w-80 bg-white shadow-2xl p-10 overflow-y-scroll fixed ${showDetails ? "right-0" : "-right-80"} duration-100 top-0 transition-all z-50`}>
            <div className='w-full relative mb-5' onClick={() => {
              handleClickClose()
              removeHandleSelected()
            }}>
              <RxCross1 className='absolute right-0 text-2xl text-red-500 top-0 cursor-pointer' />
            </div>

            <h1 className='text-3xl font-bold text-slate-800 mb-5'>
              {selected.companyName}
            </h1>

            <div className='mb-4'>
              <p className='text-lg font-semibold text-slate-700'>CTC:
                <span className='text-blue-600 ml-2'>{selected.CTC || 'N/A'}</span>
              </p>
              <p className='text-slate-700'>Last Date:
                <span className='ml-2'>{selected.applicationDeadline ? selected.applicationDeadline.split("T")[0].split("-").reverse().join("-") : 'N/A'}</span>
              </p>
            </div>

            <hr className='my-4' />

            <h2 className='text-xl font-semibold text-slate-800 mb-2'>Locations</h2>
            <div className='flex flex-wrap gap-2 mb-4'>
              {selected.companyLocation && selected.companyLocation.map((loc, index) => (
                <span key={`${selected._id || selected.id}-loc-${index}`} className='bg-blue-50 text-blue-700 p-2 rounded-xl text-sm'>{loc}</span>
              ))}
            </div>

            <h2 className='text-xl font-semibold text-slate-700 mb-2'>Required Skills</h2>
            <div className='flex flex-wrap gap-2 mb-4'>
              {selected.requiredSkills && selected.requiredSkills.map((skill, index) => (
                <span key={`${selected._id || selected.id}-skill-${index}`} className='bg-lime-50 text-lime-700 p-2 rounded-xl text-sm'>{skill}</span>
              ))}
            </div>

            {selected.jobFunctions && (
              <>
                <h2 className='text-xl font-semibold text-slate-700 mb-2'>Job Function</h2>
                <ul className='list-disc ml-5 text-slate-700 mb-4'>
                  {selected.jobFunctions.map((func, index) => (
                    <li key={`${selected._id || selected.id}-func-${index}`}>{func}</li>
                  ))}
                </ul>
              </>
            )}

            {selected.roleOverview && (
              <>
                <h2 className='text-xl font-semibold text-slate-700 mb-2'>Role Overview</h2>
                <ul className='list-disc ml-5 text-slate-700 mb-4'>
                  {selected.roleOverview.map((item, index) => (
                    <li key={`${selected._id || selected.id}-overview-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {selected.eligibilityCriteria && (
              <>
                <h2 className='text-xl font-semibold text-slate-700 mb-2'>Eligibility Criteria</h2>
                <ul className='list-disc ml-5 text-slate-700 mb-4'>
                  {selected.eligibilityCriteria.map((el, index) => (
                    <li key={`${selected._id || selected.id}-elig-${index}`}>{el}</li>
                  ))}
                </ul>
              </>
            )}

            {(selected.companyWebsite || selected.jobDescriptionLink || selected.brochureLink) && (
              <>
                <h2 className='text-xl font-semibold text-slate-700 mb-2'>Useful Links</h2>
                <div className='flex flex-col gap-2'>
                  {selected.companyWebsite && <a href={selected.companyWebsite} target='_blank' rel='noreferrer' className='text-blue-600 underline'>Company Website</a>}
                  {selected.jobDescriptionLink && <a href={selected.jobDescriptionLink} target='_blank' rel='noreferrer' className='text-blue-600 underline'>Job Description</a>}
                  {selected.brochureLink && <a href={selected.brochureLink} target='_blank' rel='noreferrer' className='text-blue-600 underline'>Brochure</a>}
                </div>
              </>
            )}

            <div className='mt-6 pt-4 border-t border-slate-100 flex justify-end'>
              <button
                className='rounded-full px-4 py-2 text-sm font-medium shadow-sm bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition'
                onClick={() => {
                  handleApplyClick(selected._id || selected.id)
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default DhashBoard