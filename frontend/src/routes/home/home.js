import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { logout } from "../../store/auth/action"
import LoadingSpinner from "../../components/LoadingSpinner.js"


const Home = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const { isAuthenticated, loading } = useSelector(
        (state) => state.auth
    )

    return (
        <>
            { loading && <LoadingSpinner />}
            {!loading &&
                (isAuthenticated
                    ?
                    <>
                        <h1>Hi you are registered user</h1>
                        <button onClick={() => {
                            dispatch(logout())
                            history.push("/login")
                        }} type="button">Logout</button>
                    </>
                    :
                    <>
                        <h1>You are not logged in by keep browsing I guess</h1>
                        <button onClick={() => history.push('/register')} type="button">Register</button>
                        <button onClick={() => history.push('/login')} type="button">Login</button>
                    </>
                )
            }
        </>
    )
}

export default Home