import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'
import '@testing-library/jest-dom'
import { Sidebar } from '../../../components/Sidebar'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"

describe('Comment Post', () => {
  describe('Comment post UI component should work', () => {
    let history

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

    beforeEach(() => {
      window.localStorage.setItem('user', 1)
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Sidebar
            selectedAvailability={"True"}
            selectedLocation={"East"}
            selectedSubject={"Biology"}
            selectedReview={3}
          />
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

    it('checks', () => {
      expect(screen.getByRole("radio", { name: "Available" })).toBeInTheDocument()
      userEvent.click(screen.getByRole("radio", { name: "Available" }))
      expect(screen.getByRole("radio", { name: "Available" })).toBeChecked()
      // userEvent.click(screen.getByRole("radio", { name: "Unavailable" }))
      // expect(screen.getByRole("radio", { name: "Unavailable" })).toBeChecked()
      // userEvent.click(screen.getByLabelText("Both"))
      // expect(screen.getByLabelText("Both")).toBeChecked()
    })
  })
})