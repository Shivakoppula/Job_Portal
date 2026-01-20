import axios from "axios";

let Base_Url="https://jobpor-24dq.onrender.com"

let axiosInstance=axios.create({
    baseURL:Base_Url,
})
export default axiosInstance;