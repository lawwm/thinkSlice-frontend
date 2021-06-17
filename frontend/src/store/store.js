import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { auth } from "./auth/reducer.js"
import { component } from "./components/reducer.js"
import { profile } from "./profile/reducer.js"
import { home } from "./home/reducer.js"
import { chat } from "./chat/reducer.js"

export const rootReducer = combineReducers({ auth, component, profile, home, chat })

// const middlewares = [thunk]
// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

// export default store

const round = number => Math.round(number * 100) / 100

const monitorReducersEnhancer =
  createStore => (reducer, initialState, enhancer) => {
    const monitoredReducer = (state, action) => {
      const start = performance.now()
      const newState = reducer(state, action)
      const end = performance.now()
      const diff = round(end - start)

      console.log('reducer process time:', diff)

      return newState
    }

    return createStore(monitoredReducer, initialState, enhancer)
  }

export default function configureStore(preloadedState) {
  const middlewares = [thunk]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]

  if (process.env.NODE_ENV === 'development') {
    enhancers.push(monitorReducersEnhancer)
  }

  const composedEnhancers = composeWithDevTools({
    traceLimit: 25,
    trace: true
  })

  const store = createStore(rootReducer, preloadedState, composedEnhancers(...enhancers))

  //Hot reloading
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(() => store.replaceReducer(rootReducer))
  }

  return store
}