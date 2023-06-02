import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import "./SignUp.css";

function SignUp() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        axios.post('http://localhost:4000/users/signup', data).then(response => {
            console.log(response)
            reset();
        }).catch(error => {
            if (error.response.status === 406) { setError(error.response.data.message) }
            else { setError("Something went wrong. Please try again later.") }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="email">email</label>
            <input
                id="email"
                {...register("email", {
                    required: "required",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Entered value does not match email format"
                    }
                })}
                type="email"
                onChange={e => {
                    setError(null);
                }}
            />
            {errors.email && <span role="alert">{errors.email.message}</span>}
            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />

            <label htmlFor="password">password</label>
            <input
                id="password"
                {...register("password", {
                    required: "required",
                    minLength: {
                        value: 5,
                        message: "min length is 5"
                    }
                })}
                type="password"
            />
            {errors.password && <span role="alert">{errors.password.message}</span>}

            <label htmlFor="name">Name</label>
            <input {...register("name", { required: true, maxLength: 20 })} />

            <button type="submit">SUBMIT</button>
        </form>
    );
}

export default SignUp;