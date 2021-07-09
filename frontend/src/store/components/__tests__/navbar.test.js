import { render, screen } from '../../../util/test-utils'
import NavBar from "../../../components/NavBar"
import { AuthNavBar } from "../../../components/AuthNavBar"
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

//yarn run test -- --coverage --watchAll=false

describe('Navbar', () => {
  it('clicking outside navbar should collapse dropdown', () => {
    const history = createMemoryHistory()
    render(
      <Router history={history}>
        <NavBar />
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

    expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler collapsed")
    userEvent.click(document.body)
    expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler")
  })

  describe('Unauthenticated Navbar UI component should work', () => {
    let history
    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <NavBar />
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

    it('navigation should work for unauthenticated navbar', async () => {
      await userEvent.click(screen.getByText(/thinkslice/i))
      expect(history.location.pathname).toBe("/")

      await userEvent.click(screen.getByText(/Home/i))
      expect(history.location.pathname).toBe("/")

      // await userEvent.click(screen.getByText(/guide/i))
      // expect(history.location.pathname).toBe("/guide")

      await userEvent.click(screen.getByText(/login/i))
      expect(history.location.pathname).toBe("/login")

      await userEvent.click(screen.getByText(/register/i))
      expect(history.location.pathname).toBe("/register")
    })

    it('Toggle responsive dropdown when unauthenticated', () => {
      expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler collapsed")
      userEvent.click(screen.getByLabelText(/toggle navigation/i))
      expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler")
    })
  })

  describe('Authenticated Navbar UI component should work', () => {
    let history
    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <NavBar />
        </Router>
        ,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: true,
              loading: false,
              user: null,
              username: null,
              authLoading: false
            }
          }
        }
      )
    })

    it('navigation should work for unauthenticated navbar', async () => {
      await userEvent.click(screen.getByText(/thinkslice/i))
      expect(history.location.pathname).toBe("/")

      await userEvent.click(screen.getByText(/Upload/i))
      expect(history.location.pathname).toBe("/upload")

      // await userEvent.click(screen.getByText(/guide/i))
      // expect(history.location.pathname).toBe("/guide")

      //since profile is not loaded within
      await userEvent.click(screen.getByText(/profile/i))
      expect(history.location.pathname).toBe("/profile/null")

      await userEvent.click(screen.getByText(/logout/i))
      expect(history.location.pathname).toBe("/login")
    })

    it('Toggle responsive dropdown when authenticated', () => {
      expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler collapsed")
      userEvent.click(screen.getByLabelText(/toggle navigation/i))
      expect(screen.getByLabelText(/toggle navigation/i)).toHaveClass("navbar-toggler")
    })
  })
})

describe('Auth NavBar', () => {
  describe('AuthNavBar UI component should work', () => {
    it('loading spinner appears if not yet loaded', () => {
      let history = createMemoryHistory()
      render(
        <Router history={history}>
          <AuthNavBar />
        </Router>
        ,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: true,
              loading: true,
              user: null,
              username: null,
              authLoading: false
            }
          }
        }
      )

      expect(screen.queryByText(/thinkslice/i)).not.toBeInTheDocument()
    })

    it('should render if authenticated', () => {
      let history = createMemoryHistory()
      render(
        <Router history={history}>
          <AuthNavBar />
        </Router>
        ,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: true,
              loading: false,
              user: null,
              username: null,
              authLoading: false
            }
          }
        }
      )
      expect(screen.getByText(/thinkslice/i)).toBeInTheDocument()
    })

    it('should render if not authenticated', () => {
      let history = createMemoryHistory()
      render(
        <Router history={history}>
          <AuthNavBar />
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
      expect(screen.getByText(/thinkslice/i)).toBeInTheDocument()
    })
  })
})