import React from "react";
import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from 'yup';
import axios from "axios";
import { HttpStatusCode } from "axios";

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
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values, { setFieldError }) => {
                axios.post("/api/signin", values)
                .then(response => {
                    console.log('User has successfully logged into the account', response);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === HttpStatusCode.Unauthorized) {
                            setFieldError('password', 'Incorrect username or password');
                        }
                    }
                });
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