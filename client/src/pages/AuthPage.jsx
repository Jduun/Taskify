import { Field, ErrorMessage as Error, Formik, Form } from "formik";
import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const AuthPage = ({ id, label, name, placeholder, type }) => {
    const [isSignIn, setIsSignIn] = useState(true)

    console.log(isSignIn)
    const toggleForm = () => {
        setIsSignIn(!isSignIn)
    }

    return (
        <div className="flex justify-center items-center h-screen">
            {isSignIn ? <SignIn toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
        </div>
    )
}

export default AuthPage