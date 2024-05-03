import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import axios from 'axios'


const AuthPage = ({ id, label, name, placeholder, type }) => {
    const [isSignIn, setIsSignIn] = useState(true)
    //const [credentials, setCredentials] = useState(null)

    const toggleForm = () => {
        setIsSignIn(!isSignIn)
      //  setCredentials(null)
    }

    const sendCredentials = (route, values) => {
        axios.post(route, values)
            .then(response => {
                // Обработка успешного ответа
                console.log(values)
                console.log('Вход выполнен успешно');
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 409) {
                        //setFieldError('username', 'This username is already taken.');
                        console.log("")
                    }
                }
            });
    }

    return (
        <div
            className="flex justify-center items-center h-screen">
            {isSignIn ?
                <SignIn
                    toggleForm={toggleForm}
                    sendCredentials={sendCredentials}
                /> :
                <SignUp
                    toggleForm={toggleForm}
                    sendCredentials={sendCredentials}
                />
            }
        </div>
    )
}

export default AuthPage