import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'

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

    // it('change inputs', () => {

    // })
  })
})