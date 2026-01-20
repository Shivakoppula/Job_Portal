import { createBrowserRouter } from "react-router-dom";
import Register from "../register/Register";
import Login from "../login/Login";
import SpinLoaders from "../loaders/SpinLoaders";
import Home from "../Home/Home";
import NavBar from "../Home/NavBar";
import PrivateRouters from "./PrivateRouters/PrivateRouters";
import Logout from "../logout/Logout";

let router = createBrowserRouter([
    {
        path:"/",
        element:<Register></Register>
    },
    {
        path:"/login",
        element:<Login></Login>   
    }
    ,{
        path:"/home",
        element:<PrivateRouters><Home></Home></PrivateRouters>
        // element:<Home></Home>
    }
    ,{
        path:"/logout",
        element:<PrivateRouters><Logout></Logout></PrivateRouters>
    }
    
])




export default router;