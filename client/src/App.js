import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AuthPage from "./pages/AuthPage";
import axios from "axios";
import { HttpStatusCode } from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { AuthProvider, useAuth } from "./utils/Auth";

function App() {

    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route element={<ProtectedRoutes />}>
                            <Route index element={<HomePage />} />
                        </Route>
                        <Route path="/auth" element={<AuthPage />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
