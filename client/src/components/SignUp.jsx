import React from "react";
import { Formik, Form } from "formik";
import Input from "./Input";
import * as yup from 'yup';
import { HttpStatusCode } from "axios";
import { useAuth } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const initialValues = {
    username: "",
    password: "",
    confirmPassword: ""
}

const schema = yup.object().shape({
    username: yup.string()
        .required('Username is required')
        .max(50, "The username must be less 50 characters long"),
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
    const auth = useAuth()
    const navigate = useNavigate()
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={ async (values, { setFieldError }) => {
                try {
                    const responseStatus = await auth.signUp(values);
                    console.log('Статус успешного входа:', responseStatus);
                    navigate('/')
                } catch (errorResponseStatus) {
                    console.error('Статус ошибки входа:', errorResponseStatus);
                    if (errorResponseStatus === HttpStatusCode.Conflict) {
                        setFieldError('username', 'User with the same username already exists');
                    }
                }
            }}
        >
            <Form
                className="w-full p-5 rounded-md bg-white max-w-96">
                <strong>Welcome to Taskify</strong>
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