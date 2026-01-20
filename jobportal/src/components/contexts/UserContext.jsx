import React, { useState, createContext } from 'react'
export const ContextApi=createContext(null)
let {Provider}=ContextApi
const UserContext = ({children}) => {
  const [globalState,setGlobalState]=useState({
    user:null,
    token:null,
    isLoading:false,
    companies:[]
  })
    return (
    <Provider value={{globalState, setGlobalState}}>
      {children}
    </Provider>
  )
}

export default UserContext