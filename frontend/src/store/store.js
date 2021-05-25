import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { auth } from "./auth/reducer.js"
import { component } from "./components/reducer.js"
import { profile } from "./profile/reducer.js"
import { home } from "./home/reducer.js"

export const rootReducer = combineReducers({ auth, component, profile, home })

const middlewares = [thunk]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
