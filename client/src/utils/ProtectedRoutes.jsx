import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = ( authenticated ) => {
    let auth = {'token' : authenticated}
    return(
        auth.token ? <Outlet /> : <Navigate to="/auth" />
    )
}

export default PrivateRoutes