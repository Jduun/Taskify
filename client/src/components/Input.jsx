import { Field, ErrorMessage as Error, Formik, Form } from "formik";
import React from "react";

const Input = ({ id, label, name, type }) => {
    return (
        <div className="relative mb-2 w-full">
            <label className="block py-3 text-black" htmlFor={id}>{label}</label>
            <Field
                name={name}
                type={type}
                id={id}
                autoComplete="off"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            </Field>
            <Error
                name={name}
            >
                {(error) => <span className="text-red-600">{error}</span>}
            </Error>
        </div>
    )
}

export default Input