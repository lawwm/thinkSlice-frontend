import * as actions from "../action"
import * as types from "../actionTypes"
import * as componentTypes from "../../components/actionTypes"

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
//yarn run test -- --coverage --watchAll=false
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import { render, screen } from '../../../util/test-utils'
import Login from "../../../routes/auth/login"
import Register from "../../../routes/auth/register"
import userEvent from '@testing-library/user-event'

// allows us to easily return reponses and/or success/fail for a thunk that calls a service
const mockServiceCreator = (body, succeeds = true) => () =>
  new Promise((resolve, reject) => {
    setTimeout(() => (succeeds ? resolve(body) : reject(body)), 10);
  });

describe('Log out', () => {
  it('it should create a log out action', () => {
    const expectedActionOne = {
      type: types.LOGOUT
    }
    const expectedActionTwo = {
      type: componentTypes.SET_ALERT
    }
    const store = mockStore({})
    return store.dispatch(actions.logout()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
      expect(store.getActions()[1].type).toEqual(expectedActionTwo.type)
    })
  })
})

describe('Log in page', () => {
  describe('UI component should work', () => {

    beforeEach(() => {
      render(<Login />,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: false,
              loading: false,
              user: null,
              username: null,
              authLoading: false
            }
          }
        }
      )
    })

    it('it should render without crashing', () => {
      expect(screen.getByText(/log in/i)).toBeInTheDocument()
    })

    it('form input should display value', () => {
      //Check username form
      userEvent.type(screen.getByPlaceholderText(/username/i), 'jimijam')
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('jimijam')
      //Check password form
      userEvent.type(screen.getByPlaceholderText(/password/i), 'password')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('password')

    })
  })

  it('should create log in action', () => {
    const store = mockStore({})
    store.dispatch(actions.login(
      { username: 'user', password: 'pass' },
      mockServiceCreator({ 'test': 'does test work?' })
    )).then((res) => {
      console.log(res)
      expect(store.getActions()).toContainEqual({ type: types.AUTH_BUTTON_LOADING })
    })
      .then(() => console.log(store.getActions()))
  })
})

describe('Register page', () => {
  describe('UI component should work', () => {

    beforeEach(() => {
      render(<Register />,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: false,
              loading: false,
              user: null,
              username: null,
              authLoading: false
            }
          }
        }
      )
    })

    it('it should render without crashing', () => {
      expect(screen.getByText(/Register here./i)).toBeInTheDocument()
    })

    it('form input should display value', () => {
      //Check username form
      userEvent.type(screen.getByPlaceholderText(/username/i), 'jimijam')
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('jimijam')
      //Check email form
      userEvent.type(screen.getByPlaceholderText(/email/i), 'jimijam@gmail.com')
      expect(screen.getByPlaceholderText(/email/i)).toHaveValue('jimijam@gmail.com')
      //Check password form
      userEvent.type(screen.getByPlaceholderText("Password"), 'password')
      expect(screen.getByPlaceholderText("Password")).toHaveValue('password')
      //Check confirm password form
      userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password')
      expect(screen.getByPlaceholderText(/confirm password/i)).toHaveValue('password')
    })



  })
})