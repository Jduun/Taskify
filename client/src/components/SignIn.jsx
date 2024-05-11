import React from "react";
import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from 'yup';
import axios from "axios";
import { HttpStatusCode } from "axios";
import {useAuth} from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const initialValues = {
    username: "",
    password: ""
}

const schema = yup.object().shape({
    username: yup.string()
        .required('Username is required')
        .max(50, "The username must be less 50 characters long"),
    password: yup.string()
})

const SignIn = ({ toggleForm, sendCredentials }) => {
    const auth = useAuth()
    const navigate = useNavigate()
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={ async (values, { setFieldError }) => {
                try {
                    const responseStatus = await auth.signIn(values);
                    console.log('Статус успешного входа:', responseStatus);
                    navigate('/')
                } catch (errorResponseStatus) {
                    console.error('Статус ошибки входа:', errorResponseStatus);
                    if (errorResponseStatus === HttpStatusCode.Unauthorized) {
                        setFieldError('password', 'Incorrect username or password');
                    }
                }
/*
                let responseStatus = auth.signIn(values)
                console.log("RESPONSE STATUS =", responseStatus)
                if (responseStatus === HttpStatusCode.Ok) {
                    //navigate('/')
                    console.log("NAVIGATE")
                }
                if (responseStatus === HttpStatusCode.Unauthorized) {
                    setFieldError('password', 'Incorrect username or password');
                }
                */
            }}
        >
            <Form
                className="w-full p-5 rounded-md bg-white max-w-96">
                <strong>Welcome back to Taskify</strong>
                <Input
                    label="Username"
                    name="username"
                    type="text"
                    id="username"
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    id="password"
                />
                <button
                    type="submit"
                    className="bg-white p-3 rounded-xl ring-black border border-gray-300 hover:border-blue-500"
                >
                    Sign in
                </button>
                <p
                    onClick={toggleForm}
                    className="pt-4 hover:text-blue-500 cursor-pointer" >
                    New to Taskify? Create an account
                </p>
            </Form>
        </Formik>
    )
}

export default SignIn