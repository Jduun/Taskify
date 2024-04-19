import React from "react";
import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from 'yup';

const initialValues = {
    email: "",
    password: "",
    confirmPassword: ""
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
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
})

const SignUp = ({ toggleForm, sendCredentials } ) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={(values) => {
                sendCredentials("/api/signup", values)
            }}
        >
            <Form
                className="w-full p-5 rounded-md bg-white max-w-96">
                <strong>Welcome to Taskify</strong>
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
                <Input
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    id="confirmPassword"
                />
                <button
                    type="submit"
                    className="bg-white p-3 rounded-xl ring-black border border-neutral-300 hover:border-blue-500"
                >
                    Sign up
                </button>
                <p
                    onClick={toggleForm}
                    className="pt-4 hover:text-blue-500 cursor-pointer">
                    Already have an account? Sign in
                </p>
            </Form>
        </Formik>
    )
}

export default SignUp