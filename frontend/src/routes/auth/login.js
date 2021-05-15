import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { login } from "../../store/auth/action.js"
//import { setAlert } from "../../store/components/action.js"
import LoadingSpinner from "../../components/LoadingSpinner"


const Login = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    )

    if (isAuthenticated) {
        history.push('/')
    }

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    const onChange = e => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        dispatch(login(loginData));

        // setLoginData({
        //     username: "",
        //     password: ""
        // })

    }

    const { username, password } = loginData

    return (
        <> { loading && <LoadingSpinner />}
            { !loading &&
                <>
                    <h2>Login</h2>
                    <form onSubmit={e => onSubmit(e)}>
                        <label fhtmlFor="username">Username</label><br />
                        <input type="text" name="username" onChange={e => onChange(e)} value={username} />
                        <br />
                        <label htmlFor="password">Password</label><br />
                        <input type="password" name="password" onChange={e => onChange(e)} value={password} />
                        <input type="submit" value="Submit" />
                    </form>
                    <br />
                    <button onClick={() => history.push('/register')} type="button">No account? Register here!</button>
                    <br />
                    <button onClick={() => history.push('/')} type="button">Return to homepage?</button>
                </>
            }
        </>
    )
}

export default Login