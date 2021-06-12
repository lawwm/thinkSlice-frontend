//yarn run test -- --coverage --watchAll=false
import { render, screen } from '../../../util/test-utils'
import userEvent from '@testing-library/user-event'
import AlertComp from "../../../components/Alert"

describe('Alerts', () => {
  describe('AlertComp UI component should work', () => {
    beforeEach(() => {
      render(
        <AlertComp />
        ,
        {
          initialState: {
            component: {
              alertArray: [
                {
                  msg: "See you next time!",
                  alertType: "success",
                  id: "ca458325-d5d4-452b-a1df-556812d3ffcd"
                }
              ]
            }
          }
        }
      )
    })

    it('Alerts should appear when alertArray is populated', () => {
      expect(screen.getByText(/see you next time/i)).toBeInTheDocument()
    })

    it('Alerts should be removed when close button is pressed', async () => {
      userEvent.click(screen.getByRole('button', { hidden: true }))
      expect(screen.queryByText(/see you next time/i)).not.toBeInTheDocument()
    })
  })

  describe('AlertIcon UI component should work', () => {
    it('alertType determines theme of alert', () => {
      render(
        <AlertComp />
        ,
        {
          initialState: {
            component: {
              alertArray: [
                {
                  msg: "Success",
                  alertType: "success",
                  id: "ca458325-d5d4-452b-a1df-556812d3ffcd"
                },
                {
                  msg: "Failure",
                  alertType: "danger",
                  id: "ca458325-d5d4-452b-a1df-556812d3ffce"
                },
                {
                  msg: "Information",
                  alertType: "info",
                  id: "ca458325-d5d4-452b-a1df-556812d3ffcf"
                }
              ]
            }
          }
        }
      )

      expect(screen.getByText(/Error!/i)).toBeInTheDocument()
      expect(screen.getByText(/Success!/i)).toBeInTheDocument()
      expect(screen.getByText(/Info!/i)).toBeInTheDocument()
    })
  })
})