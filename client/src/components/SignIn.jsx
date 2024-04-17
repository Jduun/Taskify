import React from "react";
import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from 'yup';

const initialValues = {
    email: "",
    password: ""
}

const schema = yup.object().shape({
    email: yup.string()
        .email('Enter the correct email')
        .required('Email is required'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'The password must be at least 8 characters long')
        .matches(/(?=.*[0-9])/, 'The password must contain at least one digit')
        .matches(/(?=.*[A-Z|А-Я])/, 'The password must contain at least one capital letter'),
})

const SignIn = ({ toggleForm }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={() => console.log("Success")} // send data to server
        >
            <Form className="w-full p-5 rounded-md bg-white max-w-96">
                <strong>Welcome back to Taskify</strong>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    id="email"
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