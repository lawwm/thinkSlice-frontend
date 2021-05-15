import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from "../../store/auth/action"
import LoadingSpinner from "../../components/LoadingSpinner"

const Register = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    )

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const onChange = e => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        console.log(username)

        dispatch(register(registerData))
        // setRegisterData({
        //     username: "",
        //     email: "",
        //     password: ""
        // })
    }

    if (isAuthenticated) {
        history.push('/')
    }

    const { username, email, password } = registerData

    return (
        <>
            { loading && <LoadingSpinner />}
            {!loading &&
                <>
                    <h2>Register</h2>
                    <form onSubmit={e => onSubmit(e)}>
                        <label htmlFor="username">Username</label><br />
                        <input type="text" name="username" onChange={e => onChange(e)} value={username} />
                        <br />
                        <label htmlFor="email">Email</label><br />
                        <input type="text" name="email" onChange={e => onChange(e)} value={email} />
                        <br />
                        <label htmlFor="password">Password</label><br />
                        <input type="password" name="password" onChange={e => onChange(e)} value={password} />
                        <input type="submit" value="Submit" />
                    </form>
                    <br />
                    <button onClick={() => history.push('/login')} type="button">Have an account? Login here!</button>
                    <br />
                    <button onClick={() => history.push('/')} type="button">Return to homepage?</button>
                </>

            }
        </>
    )
}

export default Register