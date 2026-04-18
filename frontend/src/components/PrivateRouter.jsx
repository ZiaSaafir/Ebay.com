import { Outlet } from "react-router-dom";


const isAuthenticated=()=>!!localStorage.getItem("access_token");

export default function PrivateRouter({redirecto='/login'}){
    return isAuthenticated() ? <Outlet/>:<Navigate to={redirecto} replace/>;
}