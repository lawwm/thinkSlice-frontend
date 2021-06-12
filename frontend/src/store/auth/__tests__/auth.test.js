import * as actions from "../action"
import * as types from "../actionTypes"
import * as componentTypes from "../../components/actionTypes"
import { render, screen, waitFor } from '../../../util/test-utils'
import Login from "../../../routes/auth/login"
import Register from "../../../routes/auth/register"
import userEvent from '@testing-library/user-event'
import { fakeLocalStorage } from "../../../util/storage"

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { auth } from "../../auth/reducer"

//yarn run test -- --coverage --watchAll=false
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// it('saves the key to the storage', () => {
//   saveToStorage('fake-value');

//   expect(window.localStorage.getItem('the-key')).toEqual('fake-value');
// });

describe('Log out', () => {
  it('should create a log out action', () => {
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

describe('Load user', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  afterEach(() => {
    window.localStorage.clear()
  })

  afterAll(() => {
    delete window.localStorage
  })

  it('should create loaduser action', () => {
    const expectedActionOne = {
      type: types.USER_LOADED,
      payload: {
        "id": 36,
        "username": "fakeacc",
        "email": "fakeacc@gmail.com"
      }
    }
    const store = mockStore({})
    return store.dispatch(actions.loadUser("fakeToken")).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('auth reducer should function with loadUser action', () => {
    const initialState = {
      token: '',
      isAuthenticated: null,
      loading: true,
      user: null,
      username: null,
      authLoading: false
    }
    const loadUserAction = {
      type: types.USER_LOADED,
      payload: {
        "id": 36,
        "username": "fakeacc",
        "email": "fakeacc@gmail.com"
      }
    }
    window.localStorage.setItem('user', "36")
    window.localStorage.setItem('username', 'jimijam')
    expect(auth(initialState, loadUserAction)).toEqual({
      token: '',
      isAuthenticated: true,
      loading: false,
      user: "36",
      username: 'jimijam',
      authLoading: false
    })
  })
})

describe('Log in page', () => {
  //Check loading spinner
  it('loading spinner appears if loading', () => {
    let history = createMemoryHistory()
    render(
      <Router history={history}>
        <Login />
      </Router>
      ,
      {
        initialState: {
          auth: {
            token: null,
            isAuthenticated: false,
            loading: true,
            user: null,
            username: null,
            authLoading: false
          }
        }
      }
    )
    const headerText = screen.queryByText(/log in/i)
    expect(headerText).not.toBeInTheDocument()
  })

  //Check UI component
  describe('Login UI component should work', () => {
    let history

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
    });

    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Login />
        </Router>
        ,
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

    afterEach(() => {
      window.localStorage.clear()
    })

    afterAll(() => {
      delete window.localStorage
    })

    it('should render without crashing', () => {
      expect(screen.getByText(/log in/i)).toBeInTheDocument()
    })

    it('form input should display value', async () => {
      //Check username form
      userEvent.type(screen.getByPlaceholderText(/username/i), 'jimijam')
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('jimijam')
      //Check password form
      userEvent.type(screen.getByPlaceholderText(/password/i), 'password')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('password')

      await userEvent.click(screen.getByRole('button'))
      await waitFor(() => expect(window.localStorage.getItem('token')).toEqual("600dde94af35008617b175734b16e97f30815f104e9ae0d1ce874221e333b62b"))
    })

    it('redirect to register', async () => {
      userEvent.click(screen.getByText(/Don't have an account/i))
      expect(history.location.pathname).toBe("/register")
    })
  })

  describe('Log in actions should work correctly', () => {
    it('catching error should dispatch failure actions', () => {
      const loginData = {
        username: "",
        password: "password",
      }
      const expectedActionOne = {
        type: types.AUTH_BUTTON_LOADING
      }
      const expectedActionTwo = {
        type: types.AUTH_BUTTON_LOADED
      }
      const expectedActionThree = {
        type: types.LOGIN_FAIL
      }
      const store = mockStore({})
      return store.dispatch(actions.login(loginData)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1]).toEqual(expectedActionTwo)
        expect(store.getActions()[2]).toEqual(expectedActionThree)
        expect(store.getActions()[3].type).toEqual(componentTypes.SET_ALERT)
      })
    })
  })
})

describe('Register page', () => {
  it('loading spinner appears if loading', () => {
    let history = createMemoryHistory()
    render(
      <Router history={history}>
        <Register />
      </Router>
      ,
      {
        initialState: {
          auth: {
            token: null,
            isAuthenticated: false,
            loading: true,
            user: null,
            username: null,
            authLoading: false
          }
        }
      }
    )
    const headerText = screen.queryByText(/register/i)
    expect(headerText).not.toBeInTheDocument()
  })

  describe('Register UI component should work', () => {
    let history

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
    });

    beforeEach(() => {
      history = createMemoryHistory()

      render(
        <Router history={history}>
          <Register />
        </Router>,
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

    afterEach(() => {
      window.localStorage.clear()
    })

    afterAll(() => {
      delete window.localStorage
    })

    it('should render without crashing', () => {
      expect(screen.getByText(/Register here./i)).toBeInTheDocument()
    })

    it('form input should display value', async () => {
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
      //Click register button
      await userEvent.click(screen.getByRole('button'))
      await waitFor(() => expect(window.localStorage.getItem('token')).toEqual("600dde94af35008617b175734b16e97f30815f104e9ae0d1ce874221e333b62b"))
      expect(history.location.pathname).toBe("/")
    })

    it('redirect to login', async () => {
      userEvent.click(screen.getByText(/Already have an account/i))
      expect(history.location.pathname).toBe("/login")
    })

  })

  describe('register actions should work correctly', () => {

    it('different password should dispatch failure actions', () => {
      const expectedActionOne = {
        type: types.REGISTER_FAIL
      }
      const expectedActionTwo = {
        type: types.AUTH_BUTTON_LOADED
      }
      const registerData = {
        username: "jimijam",
        email: "jimijam@gmail.com",
        password: "password",
        confirmPassword: "pass"
      }
      const store = mockStore({})
      return store.dispatch(actions.register(registerData)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1]).toEqual(expectedActionTwo)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('catching error should dispatch failure actions', () => {
      const registerData = {
        username: "",
        email: "",
        password: "password",
        confirmPassword: "password"
      }
      const expectedActionOne = {
        type: types.AUTH_BUTTON_LOADING
      }
      const expectedActionTwo = {
        type: types.REGISTER_FAIL
      }
      const expectedActionThree = {
        type: types.AUTH_BUTTON_LOADED
      }
      const store = mockStore({})
      return store.dispatch(actions.register(registerData)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1]).toEqual(expectedActionTwo)
        expect(store.getActions()[2]).toEqual(expectedActionThree)
        expect(store.getActions()[3].type).toEqual(componentTypes.SET_ALERT)
      })
    })
  })
})