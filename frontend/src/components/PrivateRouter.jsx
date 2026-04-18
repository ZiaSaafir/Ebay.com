import { Navigate, Outlet } from "react-router-dom";

function PrivateRouter() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRouter;