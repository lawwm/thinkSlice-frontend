import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'
import userEvent from '@testing-library/user-event'
import { Route, Router, MemoryRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"
import Review from "../../../routes/profile/review"

describe('review page', () => {
  describe('review page UI component should work', () => {
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
      history = createMemoryHistory()
      const route = "/profile/reviews/1"
      history.push(route)
      window.localStorage.setItem('user', 1)
      render(
        <Router history={history}>
          <Route path="/profile/reviews/:user_id">
            <Review />
          </Route>

        </Router>,
        {
          initialState: {
            auth: {
              token: "faketoken",
              isAuthenticated: true,
              loading: false,
              user: 1,
              username: "jimjam",
              authLoading: false
            },
            home: {
              currentVideo: {},
              homeLoading: false,
              videoLoading: false,
              commentLoading: false,
              commentLoadingId: [],
              commentReplyLoadingId: [],
              replyLoadingId: [],
              videos: [],
              isUploading: false,
              reachedEnd: false,
              filterBy: "recent",
              ascending: false,
              page: 0,
              comments: []
            },
            profile: {
              profile: {
                basic: {
                  id: 1,
                  profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=4u3252HLVYmTiv3bVeNbSc4j898%3D&Expires=1623600402',
                  username: 'jimijam',
                  user_bio: 'Hi, welcome to my profile! Cool profilez',
                  is_tutor: true,
                  is_student: true,
                  user: 1,
                  video: []
                },
                detailed: {
                  tutor_whatsapp: 12345678,
                  tutor_telegram: '@jimijam',
                  aggregate_star: null,
                  location: 'east',
                  duration_classes: [
                    3,
                    8
                  ],
                  subjects: [
                    'Biology',
                    'Math',
                    'Sports',
                    'Visual Arts'
                  ],
                  total_tutor_reviews: 0,
                  qualifications: 'P6 tutor'
                }
              },
              profileLoading: false,
              profileComponentLoading: false,
              reviewLoading: false,
              reviewPostLoading: false,
              detailedMode: false,
              editMode: false,
              reviewUser: "1",
              reviewsGiven: [{
                id: 49,
                creator_details: {
                  profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GaQiFtfz9YMj%2Bor97HYK3VIL9vo%3D&Expires=1623606778',
                  username: 'tim',
                  user: 31
                },
                star_rating: 5,
                review_title: 'Amazing teacher, truly the best',
                review_essay: 'Great mentor! Super',
                date_review: '2021-06-06',
                date_review_edited: '2021-06-13',
                edited: true,
                tutor_profile: 30,
                student_profile: 25

              }],
              reviewsReceived: []
            }
          }
        }
      )
    })

    it('renders', async () => {
      await waitFor(() => {
        expect(screen.getByText(/jimijam's reviews/i)).toBeInTheDocument()
      })
    })

    it('should be able to return to user profile', async () => {
      await waitFor(() => {
        expect(screen.getByText(/back to profile/i)).toBeInTheDocument()

      })
      userEvent.click(screen.getByText(/back to profile/i))
      expect(history.location.pathname).toEqual('/profile/1')
    })

    // it('should be able to post review', async () => {
    //   await waitFor(() => {
    //     expect(screen.getByText(/post review/i)).toBeInTheDocument()
    //   })
    //   //Able to open up the post review modal
    //   userEvent.click(screen.getByText(/post review/i))
    //   expect(screen.getByText(/submit review/i)).toBeInTheDocument()

    //   //Able to change the input values
    //   userEvent.click(screen.getAllByTestId(/star/i)[4])
    //   expect(screen.getAllByTestId(/filled/i)).toHaveLength(5)
    //   userEvent.type(screen.getByPlaceholderText(/title/i), "test title")
    //   expect(screen.getByPlaceholderText(/title/i)).toHaveValue("test title")
    //   userEvent.type(screen.getByPlaceholderText(/description/i), "title description")
    //   expect(screen.getByPlaceholderText(/description/i)).toHaveValue("title description")

    //   //Able to submit
    //   userEvent.click(screen.getByRole('button', { name: 'Submit' }))
    //   await waitForElementToBeRemoved(() => screen.getByText(/submit review/i))
    // })

    // it('should be able to view between user as tutor and student', async () => {
    //   await waitFor(() => {
    //     expect(screen.getByText(/post review/i)).toBeInTheDocument()
    //   })
    //   userEvent.click(screen.getByText(/Reviews given/i))
    //   expect(screen.getByText(/tim/i)).toBeInTheDocument()
    // })
  })
})