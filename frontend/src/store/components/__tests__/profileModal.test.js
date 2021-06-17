import { render, screen, waitForElementToBeRemoved } from '../../../util/test-utils'

import ProfileModal from '../../../components/ProfileModal'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"

describe("Profile modal", () => {
  describe("Profile modal UI detailed mode component should work", () => {
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
          <ProfileModal
            userId={1}
          />
        </Router>,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: true,
              loading: false,
              user: 1,
              username: null,
              authLoading: false
            },
            profile: {
              profile: {
                basic: {
                  id: 25,
                  profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=8liLIhwzXEJzzTsZBGgI40QPNKI%3D&Expires=1623590786',
                  username: 'jimijam',
                  user_bio: 'Hi, welcome to my profile! Cool profilez',
                  is_tutor: true,
                  is_student: true,
                  user: 1,
                  video: [
                    {
                      id: 2,
                      video_title: 'Learn physics',
                      video_description: 'Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!',
                      subject: 'Physics',
                      views: 404,
                      likes: 1,
                      num_of_comments: 6,
                      asset_id: 'HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ',
                      playback_id: 'kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM',
                      duration: 0,
                      policy: 'public',
                      created_at: '9 days ago',
                      creator_profile: 25
                    }
                  ]
                },
                detailed: {
                  tutor_whatsapp: 12345678,
                  tutor_telegram: '@jimijam',
                  aggregate_star: null,
                  location: 'South',
                  duration_classes: [
                    5,
                    8
                  ],
                  subjects: [
                    'Math',
                    'Cooking',
                    'Biology',
                    'Business',
                    'Computing'
                  ],
                  total_tutor_reviews: 0,
                  qualifications: 'P6 tutor'
                }
              },
              profileLoading: false,
              profileComponentLoading: false,
              reviewLoading: false,
              reviewPostLoading: false,
              detailedMode: true,
              editMode: false,
              reviewsGiven: [
                {
                  id: 49,
                  star_rating: 5,
                  review_title: 'Amazing teacher, truly the best',
                  review_essay: 'Great mentor! Super',
                  date_review: '2021-06-06',
                  date_review_edited: '2021-06-13',
                  edited: true,
                  tutor_profile: 30,
                  student_profile: 25,
                  creator_details: {
                    profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=K5iHfrsRgdWiQ1OFlYppkcXbl2Y%3D&Expires=1623573187',
                    username: 'tim',
                    user: 31
                  }
                }
              ],
              reviewsReceived: []
            },
          }
        }
      )
    })

    //Go into edit mode
    it('Enter edit mode from detailed mode', () => {
      //Enter edit mode
      expect(screen.queryByText(/editing/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/edit profile/i)).toBeInTheDocument()
      userEvent.click(screen.queryByText(/edit profile/i))
      expect(screen.queryByText(/editing/i)).toBeInTheDocument()
    })

    //Go into delete mode
    it('Delete user profile', async () => {
      //Open up delete modal
      expect(screen.queryByText(/delete account/i)).toBeInTheDocument()
      userEvent.click(screen.queryByText(/delete account/i))
      expect(screen.queryByText(/you are about to delete your account./i)).toBeInTheDocument()

      //Exit delete modal
      userEvent.click(screen.queryByText(/go back/i))
      await waitForElementToBeRemoved(screen.queryByText(/you are about to delete your account./i))
      expect(screen.queryByText(/you are about to delete your account./i)).not.toBeInTheDocument()

      //Delete account
      userEvent.click(screen.queryByText(/delete account/i))
      userEvent.click(screen.queryByText(/delete my account/i))
      expect(history.location.pathname).toEqual("/login")
    })

  })

  describe("Profile modal UI edit mode component should work", () => {
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
          <ProfileModal
            userId={1}
          />
        </Router>,
        {
          initialState: {
            auth: {
              token: null,
              isAuthenticated: true,
              loading: false,
              user: 1,
              username: null,
              authLoading: false
            },
            profile: {
              profile: {
                basic: {
                  id: 1,
                  profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=8liLIhwzXEJzzTsZBGgI40QPNKI%3D&Expires=1623590786',
                  username: 'jimijam',
                  user_bio: 'Hi, welcome to my profile! Cool profilez',
                  is_tutor: true,
                  is_student: true,
                  user: 26,
                  video: [
                    {
                      id: 2,
                      video_title: 'Learn physics',
                      video_description: 'Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!',
                      subject: 'Physics',
                      views: 404,
                      likes: 1,
                      num_of_comments: 6,
                      asset_id: 'HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ',
                      playback_id: 'kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM',
                      duration: 0,
                      policy: 'public',
                      created_at: '9 days ago',
                      creator_profile: 25
                    }
                  ]
                },
                detailed: {
                  tutor_whatsapp: 12345678,
                  tutor_telegram: '@jimijam',
                  aggregate_star: null,
                  location: 'South',
                  duration_classes: [
                    5,
                    8
                  ],
                  subjects: [
                    'Math',
                    'Cooking',
                    'Biology',
                    'Business',
                    'Computing'
                  ],
                  total_tutor_reviews: 0,
                  qualifications: 'P6 tutor'
                }
              },
              profileLoading: false,
              profileComponentLoading: false,
              reviewLoading: false,
              reviewPostLoading: false,
              detailedMode: true,
              editMode: true,
              reviewsGiven: [
                {
                  id: 49,
                  star_rating: 5,
                  review_title: 'Amazing teacher, truly the best',
                  review_essay: 'Great mentor! Super',
                  date_review: '2021-06-06',
                  date_review_edited: '2021-06-13',
                  edited: true,
                  tutor_profile: 30,
                  student_profile: 25,
                  creator_details: {
                    profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=K5iHfrsRgdWiQ1OFlYppkcXbl2Y%3D&Expires=1623573187',
                    username: 'tim',
                    user: 31
                  }
                }
              ],
              reviewsReceived: []
            },
          }
        }
      )
    })

    it('renders', () => {
      expect(screen.queryByText(/editing profile details/i)).toBeInTheDocument()
    })

    // it('save edit changes', () => {

    // })

    it('cancel edit changes', () => {
      expect(screen.queryByText(/editing profile details/i)).toBeInTheDocument()
      userEvent.click(screen.queryByText(/cancel changes/i))
      expect(screen.queryByText(/your profile details/i)).toBeInTheDocument()
    })

    it('check page navigation', () => {
      expect(screen.queryByText(/username/i)).toBeInTheDocument()
      userEvent.click(screen.queryByText(/page 2/i))
      expect(screen.queryByText(/username/i)).not.toBeInTheDocument()
      expect(screen.queryByText("Tutor/Student")).toBeInTheDocument()
      userEvent.click(screen.queryByText(/page 3/i))
      expect(screen.queryByText("Tutor/Student")).not.toBeInTheDocument()
      expect(screen.queryByText(/location/i)).toBeInTheDocument()
      userEvent.click(screen.queryByText(/page 1/i))
      expect(screen.queryByText(/location/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/username/i)).toBeInTheDocument()
    })

    it('change inputs', async () => {
      // Change username input
      expect(screen.getByDisplayValue("jimijam")).toBeInTheDocument()
      userEvent.type(screen.getByDisplayValue("jimijam"), "thegod")
      expect(screen.getByDisplayValue("jimijamthegod")).toBeInTheDocument()

      // Change userbio input
      expect(screen.getByDisplayValue(/Hi, welcome to my profile/)).toBeInTheDocument()
      userEvent.type(screen.getByDisplayValue(/Hi, welcome to my profile/), "mang")
      expect(screen.getByDisplayValue(/cool profilezmang/i)).toBeInTheDocument()

      // Change whatsapp input
      expect(screen.getByDisplayValue(/12345678/)).toBeInTheDocument()
      userEvent.type(screen.getByDisplayValue(/12345678/), "9")
      expect(screen.getByDisplayValue(/123456789/i)).toBeInTheDocument()

      // Change telegram input
      expect(screen.getByDisplayValue(/@jimijam/)).toBeInTheDocument()
      userEvent.type(screen.getByDisplayValue(/@jimijam/), "thegod")
      expect(screen.getByDisplayValue(/@jimijamthegod/i)).toBeInTheDocument()

      //change page
      userEvent.click(screen.queryByText(/page 2/i))

      // Select tutor/student input
      userEvent.selectOptions(screen.getByRole('combobox', { name: "" }), ['1'])
      expect(screen.getByDisplayValue(/tutor/i)).toBeInTheDocument()

      userEvent.selectOptions(screen.getByRole('combobox', { name: "Available" }), ['unavailable'])
      expect(screen.getByDisplayValue(/unavailable/i)).toBeInTheDocument()

      //change page
      userEvent.click(screen.queryByText(/page 3/i))

      // Select location input
      userEvent.selectOptions(screen.getByRole('combobox', { name: "" }), ['north'])
      expect(screen.getByDisplayValue(/north/i)).toBeInTheDocument()

      // Select subjects
      userEvent.click(screen.getByLabelText(/health/i))
      expect(screen.getByLabelText(/health/i)).toBeChecked()
      userEvent.click(screen.getByLabelText(/math/i))
      expect(screen.getByLabelText(/math/i)).not.toBeChecked()

      //Min lesson duration

      //Select qualifications
      expect(screen.getByDisplayValue(/p6 tutor/i)).toBeInTheDocument()
      userEvent.type(screen.getByDisplayValue(/p6 tutor/i), "thegod")
      expect(screen.getByDisplayValue(/p6 tutorthegod/i)).toBeInTheDocument()

      //Submit edit changes
      userEvent.click(screen.getByText(/save changes/i))
      expect(screen.queryByText(/your profile details/i)).toBeInTheDocument()
    })
  })
})