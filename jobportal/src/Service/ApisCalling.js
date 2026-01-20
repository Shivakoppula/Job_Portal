import axiosInstance from "../instance/axiosInstance";

let ApisCalling={
    register : async(payload)=>{
        console.log("Sending payload:", payload);
        let data=await axiosInstance.post("/api/users/register",payload);
        return data;
    },
    verifyOtp : async(registrationId, otp)=>{
        console.log("Verifying OTP for registration ID:", registrationId);
        let data=await axiosInstance.post("/api/users/verify-otp", {userId: registrationId, otp});
        return data;
    },
    loginUser:async(payload)=>{
        let data=await axiosInstance.post("/api/users/login",payload);
        return data;
     },
    getAllCompanies:async()=>{
        let data=await axiosInstance.get("/api/companies");
        return data;
    },
    applyToCompany:async(companyId,token)=>{
        let data=await axiosInstance.post("/api/applications",{companyId:companyId},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return data;
    }
}
export default ApisCalling;