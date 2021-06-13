import Upload from "../../../routes/home/upload"
import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"

describe('Upload page', () => {
  describe('Upload UI component should work', () => {
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
      window.localStorage.setItem('user', 1)
      render(
        <Router history={history}>
          <Upload />
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
                  id: 25,
                  profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=4u3252HLVYmTiv3bVeNbSc4j898%3D&Expires=1623600402',
                  username: 'jimijam',
                  user_bio: 'Hi, welcome to my profile! Cool profilez',
                  is_tutor: true,
                  is_student: true,
                  user: 26,
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
              reviewsGiven: [],
              reviewsReceived: []
            }
          }
        }
      )
    })

    it('upload page is able to render', async () => {
      await waitFor(() => {
        expect(screen.getByText(/create/i)).toBeInTheDocument()
      })
    })

    it('upload page can input data and video', async () => {
      await waitFor(() => {
        expect(screen.getByText(/create/i)).toBeInTheDocument()
      })
      userEvent.type(screen.getByPlaceholderText(/title/i), "Test video")
      expect(screen.getByPlaceholderText(/title/i)).toHaveValue("Test video")
      userEvent.type(screen.getByPlaceholderText(/subject/i), "Math")
      expect(screen.getByPlaceholderText(/subject/i)).toHaveValue("Math")
      userEvent.type(screen.getByPlaceholderText(/description/i), "Test description")
      expect(screen.getByPlaceholderText(/description/i)).toHaveValue("Test description")

      //upload file
      window.URL.createObjectURL = jest.fn();
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      const input = screen.getByLabelText(/select file/i)
      userEvent.upload(input, file)

      //check file has been selected
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files.item(0)).toStrictEqual(file)
      expect(input.files).toHaveLength(1)

      //click submit button
      userEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(screen.getByText(/create/i)).toBeInTheDocument()
    })
  })
})