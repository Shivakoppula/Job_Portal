import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdCheckCircle, MdOutlineBusinessCenter, MdOutlineMailOutline, MdOutlineVerified, MdPhone, MdSchool } from "react-icons/md";
import InputField from './InputField';
import { FaCircleUser, FaPhone, FaUser } from "react-icons/fa6";
import { TbLockPassword } from 'react-icons/tb';
import { LuCircleUserRound, LuContact } from 'react-icons/lu';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCalendarAlt, FaRegCalendarAlt } from 'react-icons/fa';
import {validatePassword} from 'val-pass'
import { toast } from 'react-hot-toast';
import DropDown from './DropDown';
import ApisCalling from '../../Service/ApisCalling';
import UseUserContextApi from '../customHooks/UseUserContextApi';
import SpinLoaders from '../loaders/SpinLoaders';



const Register = () => {
  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    email:"",
    name:"",
    mobile:"",
    password:"",
    yearOfPassout:"",
    college:"",
    joinedInstitute:"",
    institute:"",
    skills:[],
    positionApplyingFor:""
  })

  const [OTP, setOTP] = useState("")
  const [registrationId, setRegistrationId] = useState("")  // Store id from registration response

   let {email,name,mobile,password,yearOfPassout,college,joinedInstitute,institute} = formData

  const [isBlackgroud,setIsBlackgroud]=useState(false);

  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [showOtpField,setShowOtpField] = useState(false)

  const [displayfields,setDisplayfields]=useState(true)
  const [errormsg,setErrormsg]=useState("")
  
  // Separate loading states for registration and OTP
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  let {validateAll}=validatePassword(password,8)
  
  const handleChange = (e)=> {
    const {name,value} = e.target
  if(name == "password")
  {
    let {getAllValidationErrorMessage}=validatePassword(value,8)
      setErrormsg(getAllValidationErrorMessage())
   } 
       if(name == "confirmPassword"){
      setConfirmPassword(value)
      if(formData.password !== value){
        setIsBlackgroud(true)
      } else {
        setIsBlackgroud(false)
      }
    }
    else if(name == "OTP"){
      setOTP(value)
    }
    else{
      setFormData((preValue)=>({
        ...preValue,[name]:value
      }))
    }
  }
  //  const {globalState,setGlobalState}=UseUserContextApi();

    // console.log(globalState);

   //Form submit handler
  const handleSubmit = async (e)=> {
    e.preventDefault()
    const requiredFields = [name, email, mobile, password, confirmPassword, yearOfPassout, joinedInstitute];
    // If joinedInstitute is "yes", institute is also required
    if(joinedInstitute === "yes"){
      requiredFields.push(institute);
    }
    if(requiredFields.some(field => !field)){
      toast.error("Please fill all the fields");
      return;
    }
     // Validate password and confirm password match
    if(password !== confirmPassword){
      toast.error("Password and Confirm Password should be same");
      setIsBlackgroud(true)
      return;
    }
    else{
      setIsBlackgroud(false)
    }
    if(!validateAll()){
      toast.error("Please enter a valid password");
      return;
    }
   
    
    try{
        setRegistrationLoading(true)
      let data=await ApisCalling.register(formData);
      
      // Try different field names
      let id = data.data?.id || data.data?._id || data?.id || data?.data?.user?.id || data?.data?.userId;
      
      if(!id){
        toast.error("Failed to get registration ID. Check console for response structure.");
        console.warn("Could not find ID in any expected field. Response:", data.data);
        setRegistrationLoading(false)
        return;
      }
      
      // Store the ID in state
      setRegistrationId(id);
      console.log("✅ Registration successful, ID stored for OTP verification");
      
      toast.success("Registration Successful! and verify OTP sent to your email",{position:"top-right",duration:2000});
      // Show OTP field and hide registration form after success
      setShowOtpField(true);
      setDisplayfields(false)
      setRegistrationLoading(false)
    }catch(err){
            setRegistrationLoading(false)
      toast.error("Registration failed. Please try again.");
   
      console.log("Error during registration:", err);
    }

  }

  //Toggle password visibility
  const toggleShowPassword = ()=> {
    setShowPassword(!showPassword)
  }

//Toggle confirm password visibility
  const toggleShowConfirmPassword = ()=> {
    setShowConfirmPassword(!showConfirmPassword)
  }

//Dropdown handlers
  const handleDropoption=(e,nameofele,value)=>{
    e.stopPropagation();
    //Add selected options to dropdown as String or Array
    if(nameofele === "positionApplyingFor"){
      setFormData((preValue)=>({
        ...preValue,[nameofele]:value
      }))
    } else {
      setFormData((preValue)=>({
        ...preValue,[nameofele]:[...preValue[nameofele],value]
      }))
    }
   
  }

//Remove selected options from dropdown
  const handleRemove=(e,nameofele,values)=>{
    e.stopPropagation();
    //Remove selected options from dropdown as String or Array  
    if(nameofele === "positionApplyingFor"){
      setFormData((preValue)=>({
        ...preValue,[nameofele]:""
      }))
    } else {
      setFormData((preValue)=>({
        ...preValue,[nameofele]:preValue[nameofele].filter((item)=>item!==values)
      }))
    }
  }

  // OTP handler
    const handleOtp=async(e)=>{
    e.preventDefault()
    // OTP verification logic
   const trimmedOTP = OTP.trim();
   
   if(!trimmedOTP){
    toast.error("Please enter the OTP");
    return;
   }
   if(trimmedOTP.length !== 6){
    toast.error("OTP must be exactly 6 digits");
    return;
   }
   if(!registrationId){
    toast.error("Registration ID not found. Please register again.");
    return;
   }
   
   try{    
    setOtpLoading(true)
    const response = await ApisCalling.verifyOtp(registrationId, trimmedOTP);
    toast.success("OTP Verified Successfully! Registration Complete!");
    console.log("✅ OTP Verified:", response);
    
    // Reset form after successful verification
    setFormData({
      email:"",
      name:"",
      mobile:"",
      password:"",
      yearOfPassout:"",
      college:"",
      joinedInstitute:"",
      institute:"",
      skills:[],
      positionApplyingFor:""
    });
    setOTP("");
    setRegistrationId("");
    setShowOtpField(false);
    setDisplayfields(true);
    setOtpLoading(false)
    // Redirect to login page
    navigate('/login');
   }catch(err){
    console.log("Error during OTP verification:", err);
    setOtpLoading(false)
    toast.error(err.response?.data?.message || "OTP verification failed. Check email for OTP.");
   }

  }
  const handleCanle=()=>{
    setShowOtpField(false)
    setDisplayfields(true)
  }
 

  return (
    <div className='min-h-screen flex justify-center items-center p-4 sm:p-6'>
      <div className='shadow-[0_1.5px_3.5px_rgba(0.5,0,0,0.22)] w-full max-w-md sm:max-w-lg md:max-w-xl rounded-[20px] p-6 sm:p-8 backdrop-blur-lg bg-white/30 border border-white/30'>

        <div className='h-full flex flex-col items-center overflow-y-auto max-h-[90vh]'>
            <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4 sm:gap-5 md:gap-6 w-full'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-5 text-center'>Registration</h1>
              
              {displayfields && (
                <>
                  {/* // Input fields */}
                  <InputField 
                    name="name" 
                    value={name} 
                    handleChange={handleChange}
                    type="text"
                  >
                    <LuCircleUserRound className='text-xl sm:text-2xl mr-2'></LuCircleUserRound>
                  </InputField>

                  {/* email  */}
                  <InputField 
                    name="email" 
                    value={email} 
                    handleChange={handleChange}
                    type="email"
                  >
                    <MdOutlineMailOutline className='text-xl sm:text-2xl mr-2'></MdOutlineMailOutline>
                  </InputField>

                  {/* skills  */}
                  <DropDown dropOptions={["Java","Advance Java","HTML","CSS","JS","React","Django","Python"]} nameofele="skills" handleDropoption={handleDropoption} selectedEle={formData.skills} handleRemove={handleRemove} setFormData={setFormData}
                  />
                  
                  {/* Job Role  */}
                   <DropDown dropOptions={["development","testing","applicationsupport"]} nameofele="positionApplyingFor" handleDropoption={handleDropoption} selectedEle={formData.positionApplyingFor} handleRemove={handleRemove} setFormData={setFormData}
                  />
                  {/* contact number */}
                  <InputField 
                    name="mobile" 
                    value={mobile} 
                    handleChange={handleChange}
                    type="phone"
                  >
                    <MdPhone className='text-xl sm:text-2xl mr-2'></MdPhone>
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

                  {!validateAll() && <p className='text-red-600 text-sm'>{errormsg}</p>}

                  {/* confirm password  */}
                  <InputField 
                    name="confirmPassword" 
                    value={confirmPassword} 
                    handleChange={handleChange}
                    isBlackgroud={isBlackgroud}
                    type={showConfirmPassword ? "text" : "password"}
                  >
                    <button 
                      type='button' 
                      onClick={toggleShowConfirmPassword} 
                      className='cursor-pointer'
                    >
                      {!showConfirmPassword ? <AiOutlineEyeInvisible className='text-xl sm:text-2xl mr-2'></AiOutlineEyeInvisible> : <AiOutlineEye className='text-xl sm:text-3xl mr-2'></AiOutlineEye>}
                    </button>
                  </InputField>
                  {/* Year of passing  */}
                  <InputField 
                    name="yearOfPassout" 
                    value={yearOfPassout} 
                    handleChange={handleChange}
                    type="number"
                  >
                    <FaRegCalendarAlt className='text-lg sm:text-xl mr-2'></FaRegCalendarAlt>
                  </InputField>

                  {/* college name  */}
                   <InputField 
                        name="college" 
                        value={college} 
                        handleChange={handleChange}
                        type="text"
                      >
                        <MdSchool className='text-xl sm:text-2xl mr-2'></MdSchool>
                      </InputField>

                  <div className={`border-b-2 group w-full flex h-11 relative justify-center items-center group focus-within:border-2 ${joinedInstitute ? "border-2" : ""}`}>
                    <label htmlFor="joinedInstitute" className={`capitalize absolute left-[5.5px] group-focus-within:bg-white group-focus-within:-top-3 text-sm sm:text-base ${joinedInstitute ? "bg-white -top-3" : "left-[5.5px]"}`}>joinedInstitute</label>
                    <select 
                      name="joinedInstitute" 
                      id="joinedInstitute" 
                      className="outline-none flex-1 h-11 flex justify-center items-center px-1.5 ml-2 appearance-none"
                      value={joinedInstitute} 
                      onChange={handleChange}
                    >
                      <option value=""></option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>  
                    </select>
                    {/*  */}
                    <MdCheckCircle className={`${(joinedInstitute==="yes") ? 'text-green-500' : ''} text-xl sm:text-2xl mr-2`}></MdCheckCircle>
                  </div>

                      
                  {joinedInstitute === "yes" && (
                    <>
                    {/* institute name  */}
                      <InputField 
                        name="institute" 
                        value={institute} 
                        handleChange={handleChange}
                        type="text"
                      >
                        <MdOutlineBusinessCenter className={`text-xl sm:text-2xl mr-2 `}></MdOutlineBusinessCenter>
                      </InputField>

                    </>
                  )}
                  {/* Submit button */}
                  <div className='w-full flex justify-center'>
                  <button type='submit' className='border h-10 sm:h-11 px-6 sm:px-8 hover:bg-blue-500 bg-blue-400 text-lg sm:text-xl font-semibold text-white rounded transition duration-200 w-full sm:w-auto flex justify-center items-center gap-2'disabled={registrationLoading}>{registrationLoading?<>
                  <span>Registration...</span>
                  <SpinLoaders />
                  </>:"Submit"}</button>
                </div>
                </>
                
              )}

              {/* // OTP Field */}
              {showOtpField && (
                <>
                <h1>{email}</h1>
                  <InputField 
                    name="OTP" 
                    value={OTP} 
                    handleChange={handleChange}
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                  >
                    <MdOutlineVerified className={`text-xl sm:text-2xl mr-2 ${(OTP.length>5 && OTP.length<7) ? 'text-green-500' : ''}`} />
                    
                  </InputField>
                  {
                    // !OTP && OTP.length>0 && OTP.length < 6 && <p className='text-red-600 text-sm'>Please enter the OTP</p>
                    OTP && (OTP.length>0 && OTP.length < 6) && <p className='text-red-600 text-sm'>Please enter the OTP</p>
                  }

                  <div className='w-full flex justify-between gap-3'>
                    <button type="button" onClick={handleCanle}  className='border h-10 sm:h-11 px-6 sm:px-8 hover:bg-red-500 bg-red-300 text-lg sm:text-xl font-semibold text-white rounded transition duration-200 w-full sm:w-auto'>Cancel</button>
                  <button type='submit' className='border h-10 sm:h-11 px-6 sm:px-8 hover:bg-blue-500 bg-blue-400 text-lg sm:text-xl font-semibold text-white rounded transition duration-200 w-full sm:w-auto flex justify-center items-center gap-2' onClick={handleOtp} disabled={otpLoading}>{otpLoading?<>
                  <span>Verifying...</span>
                  <SpinLoaders />
                  </>:"Submit"}</button>
                </div>
                </>
              )}

            


            </form>
        </div>

      </div>
      
    </div>
  )
}

export default Register