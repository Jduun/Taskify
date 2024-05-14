import { useState, useContext, createContext, useEffect } from 'react'
import axios, { HttpStatusCode } from "axios";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isTokenChecked, setIsTokenChecked] = useState(false)
    const [username, setUsername] = useState(null)

    useEffect(() => {
        console.log("isAuthenticated =", isAuthenticated)
    }, [isAuthenticated]);

    const checkToken = async () => {
        try {
             // Request to backend to verify the token
            const response = await axios.get('/api/checkToken', {
                withCredentials: true // Send cookies with the request
            });

            if (response.status === HttpStatusCode.Ok) {
                setIsAuthenticated(true);
                setUsername(response.data.username)
                console.log(response)
                console.log("You're authenticated")
            }
        } catch (error) {
            console.error('Error checking token:', error);
            setIsAuthenticated(false);
            setUsername(null)
        }
        return isAuthenticated
    }

    const signIn = async (credentials) => {
        try {
            const response = await axios.post("/api/signIn", credentials);
            console.log('User has successfully logged into the account', response);
            setIsAuthenticated(true)
            setUsername(credentials.username)
            return response.status;
        } catch (error) {
            setIsAuthenticated(false)
            setUsername(null)
            throw error.response.status;
        }
    }

    const signUp = async (credentials) => {
        try {
            const response = await axios.post("/api/signUp", credentials);
            console.log('User has been successfully registered', response);
            setIsAuthenticated(true)
            setUsername(credentials.username)
            return response.status;
        } catch (error) {
            setIsAuthenticated(false)
            setUsername(null)
            throw error.response.status;
        }
    }

    const signOut = async () => {
        try {
            const response = await axios.post("/api/signOut");
            setIsAuthenticated(false)
            setUsername(null)
            return response.status
        } catch (error) {
            console.error("Sign out error:", error);
            throw error.response.status;
        }
    };

    return (
        <AuthContext.Provider value={{ username, isAuthenticated, isTokenChecked, setIsTokenChecked, checkToken, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}