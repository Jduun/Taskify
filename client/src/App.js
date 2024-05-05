import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPage from "./pages/AuthPage";
import axios from "axios";
import { HttpStatusCode } from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/ProtectedRoutes";

function App() {
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        const checkToken = async () => {
            try {
                // Request to backend to verify the token
                const response = await axios.get('/api/checkToken', {
                    withCredentials: true // Send cookies with the request
                });

                if (response.status === HttpStatusCode.Ok) {
                    setAuthenticated(true);
                    console.log("You're authenticated")
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };
        checkToken();
    }, []);

    //<div className="App">
            //{ authenticated ? <HomePage /> : <AuthPage /> }
            //<Route path="/" element={<HomePage />} />
            //<Route path="/login" element={<AuthPage />} />
        //</div>

    //<div className="App">
    //</div>
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route element={<PrivateRoutes authenticated={authenticated} />}>
                        <Route index element={<HomePage />} />
                    </Route>
                    <Route path="/auth" element={<AuthPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
