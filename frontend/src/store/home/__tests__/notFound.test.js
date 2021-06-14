import Fallback from "../../../routes/errorpages/notFound";
import { render, screen, waitForElementToBeRemoved } from '../../../util/test-utils'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'


describe('error page works', () => {
  let history
  beforeEach(() => {
    history = createMemoryHistory()
    window.localStorage.setItem('user', 1)
    render(
      <Router history={history}>
        <Fallback />
      </Router>,
      {
        initialState: {
          auth: {
            token: null,
            isAuthenticated: true,
            loading: false,
            user: null,
            username: null,
            authLoading: false
          },
        }
      }
    )
  })

  it('render', () => {
    expect(screen.queryByText(/page not found/i)).toBeInTheDocument()
  })
})