import { act, render, screen } from '../../../util/test-utils'
import { StarDisplay, StarChoice } from '../../../components/StarRating'
import Thumbnail from '../../../components/Thumbnail'
import { CheckboxGroup } from '../../../components/CheckboxGroup'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { Form } from "react-bootstrap";
//yarn run test -- --coverage --watchAll=false

describe('star display', () => {
  describe('Star display UI component should work', () => {
    let history
    const starRating = 4
    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <StarDisplay num={parseInt(starRating)} />
        </Router>
      )
    })

    it('different coloured stars are displayed according to num input', () => {
      expect(screen.getAllByTestId("filled")).toHaveLength(starRating)
      expect(screen.getAllByTestId("hollow")).toHaveLength(5 - starRating)
    })
  })
})

describe('star rating', () => {
  describe('Star rating UI component should work', () => {
    let history
    const starRating = 3
    const fakeFunction = jest.fn(x => 42 + x)

    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <StarChoice rating={starRating} setRating={fakeFunction} />
        </Router>,
      )
    })

    it('star hover and click', () => {
      //check the default star configuration to have 5 stars and 3 highlighted
      expect(screen.getAllByTestId("star")).toHaveLength(5)
      expect(screen.getAllByTestId("filled")).toHaveLength(starRating)

      //check hovering over star
      userEvent.hover(screen.getAllByTestId("star")[4])
      expect(screen.getAllByTestId("filled")).toHaveLength(5)

      //check unhovering over star
      userEvent.unhover(screen.getAllByTestId("star")[4])
      expect(screen.getAllByTestId("filled")).toHaveLength(3)

      //check clicking on star
      userEvent.click(screen.getAllByTestId("star")[4])
      expect(fakeFunction.mock.calls[0][0]).toBe(5)

      //check clicking on star twice
      userEvent.click(screen.getAllByTestId("star")[1])
      expect(fakeFunction.mock.calls[1][0]).toBe(2)
    })
  })
})

describe('thumbnail', () => {
  describe('thumbnail UI component should work', () => {
    let history

    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Thumbnail
            title={"Physics"}
            username={"jimijam"}
            views={60}
            date={'25-5-2021'}
            subject={'Math'}
            playback_id={'kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM'}
            imageSrc={''}
            videoId={2}
            profileId={25}
            deleteButton={true}
          />
        </Router>
      )
    })

    it('renders', () => {
      expect(screen.getByText(/physics/i)).toBeInTheDocument()
      expect(screen.getByText(/jimijam/i)).toBeInTheDocument()
    })

    it('redirect to profile page when clicking profile picture', () => {
      userEvent.click(screen.getByAltText("profile picture"))
      expect(history.location.pathname).toBe("/profile/25")
    })

    it('redirect to watch page when clicking thumbnail', () => {
      userEvent.click(screen.getByAltText("video thumbnail"))
      expect(history.location.pathname).toBe("/watch/2")
    })

    it('redirect to watch page when clicking thumbnail body', () => {
      userEvent.click(screen.getByText(/physics/i))
      expect(history.location.pathname).toBe("/watch/2")
    })

    it('thumbnail becomes gif when hovering', () => {
      userEvent.hover(screen.getByAltText("video thumbnail"))
      const image = screen.getByAltText("video thumbnail")
      expect(image).toHaveAttribute('src', "https://image.mux.com/kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM/animated.gif?width=600&height=300&fps=2");
      userEvent.unhover(screen.getByAltText("video thumbnail"))
      expect(screen.getByAltText("video thumbnail")).toHaveAttribute('src', "https://image.mux.com/kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM/thumbnail.jpg?width=600&height=300&fit_mode=crop");
    })

    it('delete button dispatches delete action', async () => {
      act(() => {
        userEvent.click(screen.getByRole('img', { name: 'delete' }))
      })
      expect(await screen.findByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })
  })
})

describe('checkbox group', () => {
  describe('checkbox group UI component renders', () => {
    let history
    let subjectList = ["Arts",
      "Biology",
      "Business",]

    beforeEach(() => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Form.Group>
            <Form
              name="subjects"
              value={subjectList}
            >
              <CheckboxGroup subjectList={subjectList} />
            </Form>
          </Form.Group>
        </Router>
      )
    })

    it('renders a biology checkbox', () => {
      expect(screen.queryByText(/biology/i)).toBeInTheDocument()
    })

    it('click on checkbox that have and have not been checked', () => {
      userEvent.click(screen.getByLabelText(/biology/i))
      userEvent.click(screen.getByLabelText(/physics/i))
      userEvent.click(screen.getByLabelText(/music/i))
      expect(subjectList).toEqual(["Arts", "Business", "Physics", "Music"])
    })
  })
})