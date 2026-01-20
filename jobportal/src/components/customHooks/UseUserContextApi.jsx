import React from 'react'
import { useContext } from 'react'
import { ContextApi } from '../contexts/UserContext'

const UseUserContextApi = () => {
    let context=useContext(ContextApi)
  return context
}

export default UseUserContextApi