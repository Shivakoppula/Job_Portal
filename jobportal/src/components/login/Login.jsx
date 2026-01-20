import React, { use, useState } from 'react'
import InputField from '../register/InputField'
import {MdOutlineMailOutline} from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { validatePassword } from 'val-pass'
import toast from 'react-hot-toast'
import ApisCalling from '../../Service/ApisCalling'
import { useNavigate } from 'react-router-dom'
import SpinLoaders from '../loaders/SpinLoaders'
import UseUserContextApi from '../customHooks/UseUserContextApi'

const Login = () => {
  const [logindata,setLogindata]=useState({
    email:"",
    password:""
  })
let navigate=useNavigate()
const {globalState,setGlobalState}=UseUserContextApi();
  let {email,password}=logindata

   const [showPassword,setShowPassword] = useState(false)
     const [errormsg,setErrormsg]=useState("")
 let {validateAll}=validatePassword(password,8)
  

  const toggleShowPassword = ()=> {
    setShowPassword(!showPassword)
  }

  const handleChange = (e)=> {
      const {name,value} = e.target
    if(name == "password")
    {
      let {getAllValidationErrorMessage}=validatePassword(value,8)
        setErrormsg(getAllValidationErrorMessage())
     } 
      setLogindata((preValue)=>({
        ...preValue,[name]:value
      }))
    }
    
    const handleSubmit=async(e)=>{
       e.preventDefault();
       if(!email || !password){
        toast.error("Please fill all the fields")
        return
       }
       else{
        toast.success("Login Successful") 
       }
      try{
        setGlobalState((preValue)=>({...preValue,isLoading:true}))
        //call login api here
         let {data,status}=await ApisCalling.loginUser(logindata)
       if(status===200){

        // toast.success("Login Successful")
        setGlobalState((preValue)=>({...preValue,isLoading:false,"user":data.user,"token":data.token}))
         navigate("/home")
        }
     
        else{
        toast.error("Login Failed")
        setGlobalState((preValue)=>({...preValue,isLoading:false}))
        }
      }
      catch(error){
        toast.error("Login Failed")
        setGlobalState((preValue)=>({...preValue,isLoading:false}))
      }

        //submit logic here
        console.log(logindata);
    }
  
 return<>
 <div className='min-h-screen flex justify-center items-center p-4 sm:p-6'>
      <div className='shadow-[0_1.5px_3.5px_rgba(0.5,0,0,0.22)] w-full max-w-md sm:max-w-lg md:max-w-xl rounded-[20px] p-6 sm:p-8 backdrop-blur-lg bg-white/30 border border-white/30'>

        <div className='h-full flex flex-col items-center overflow-y-auto max-h-[90vh]'>
            <form action="" onSubmit={handleSubmit}  className='flex flex-col gap-4 sm:gap-5 md:gap-6 w-full'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-5 text-center'>Login</h1>

              <InputField 
                    name="email" 
                    value={email} 
                    handleChange={handleChange}
                    type="email"
                  >
                    <MdOutlineMailOutline className='text-xl sm:text-2xl mr-2'></MdOutlineMailOutline>
                  </InputField>


               {/* password  */}
                  <InputField 
                    name="password" 
                    value={password} 
                    handleChange={handleChange}
                    type={showPassword ? "text" : "password"}
                  >
                    <button 
                      type='button'
                      onClick={toggleShowPassword} 
                      className='cursor-pointer'
                    >
                      {!showPassword ? <AiOutlineEyeInvisible className='text-xl sm:text-2xl mr-2'></AiOutlineEyeInvisible> : <AiOutlineEye className='text-xl sm:text-3xl mr-2'></AiOutlineEye>}
                    </button>
                  </InputField>
                   {/* {!validateAll() && <p className='text-red-600 text-sm'>{errormsg}</p>} */}

                  <div className='w-full flex justify-center'>
                  <button type='submit' className='border h-10 sm:h-11 px-6 sm:px-8 hover:bg-blue-500 bg-blue-400 text-lg sm:text-xl font-semibold text-white rounded transition duration-200 w-full sm:w-auto flex justify-center items-center'disabled={globalState.isLoading}>{globalState.isLoading?<>
                  <span>Verifying...</span>
                  <SpinLoaders />
                  </>:"Submit"}</button>
                </div>
              </form>
          </div>
      </div>
    </div>
 </>
}

export default Login