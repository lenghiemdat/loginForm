import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { setUserSession } from './Utils/Common';

function Login(props) {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false);
  // const username = useFormInput('');
  // const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const onSubmit = (data) => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:4000/users/signin', data).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      // console.log(props.location.state.from);
      props.history.push('/dashboard');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401 || error.response.status === 400) { setError(error.response.data.message) }
      else { setError("Something went wrong. Please try again later.") }
    });
    // reset();
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
        autoComplete="username" 
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}

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
        autoComplete="current-password"
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      {/* Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div> */}
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <button type="submit" disabled={loading}>Login</button>

      {/* <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br /> */}
    </form>
  );
}

// const useFormInput = initialValue => {
//   const [value, setValue] = useState(initialValue);

//   const handleChange = e => {
//     setValue(e.target.value);
//   }
//   return {
//     value,
//     onChange: handleChange
//   }
// }

export default Login;