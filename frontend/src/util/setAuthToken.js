import axios from 'axios';

const setAuthToken = (token) => {
    console.log(token)
    if (token) {
        axios.defaults.headers.common['Authorization'] = "Token " + token;
        localStorage.setItem('token', token);
        console.log(localStorage.token)
        console.log(axios.defaults.headers.common['Authorization'])
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export default setAuthToken;
