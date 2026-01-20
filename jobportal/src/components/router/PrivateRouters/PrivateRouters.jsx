import React from 'react'
import UseUserContextApi from '../../customHooks/UseUserContextApi'
import { Navigate } from 'react-router-dom';

const PrivateRouters = ({children}) => {
    let {globalState,setGlobalState}=UseUserContextApi();
    // console.log(globalState);
    
 if(!globalState.token){
    return <Navigate to="/login"></Navigate>
 }
 return<>
 {children}
 </>
 
}

export default PrivateRouters