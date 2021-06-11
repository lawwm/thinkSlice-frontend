// test-utils.js
import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
// Import your own reducer
import thunk from 'redux-thunk'
import { rootReducer } from "../store/store"

const middlewares = [thunk]
const middlewareEnhancer = applyMiddleware(...middlewares)

const render = (
  ui,
  {
    initialState,
    // store = createStore(rootReducer, initialState, middlewareEnhancer),
    ...renderOptions
  } = {}
) => {

  const store = createStore(rootReducer, initialState, middlewareEnhancer)
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }