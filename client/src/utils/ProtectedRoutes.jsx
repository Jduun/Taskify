import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from "./Auth";
import { useEffect } from "react";

const PrivateRoutes = () => {
    const auth = useAuth()

    useEffect(() => {
        const checkToken = async () => {
            await auth.checkToken();
            auth.setIsTokenChecked(true);
        };
        checkToken();
    }, []);

    if (!auth.isTokenChecked) {
        return null;
    }
    return (
        auth.isAuthenticated ? <Outlet /> : <Navigate to="/auth" />
    )
}

export default PrivateRoutes
