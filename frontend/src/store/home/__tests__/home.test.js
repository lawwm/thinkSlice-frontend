import { act, render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'

import Home, { FilterOptions, VideoGrid } from '../../../routes/home/home'
import userEvent from '@testing-library/user-event'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"
import { BsJustifyLeft } from 'react-icons/bs'

describe('Home page', () => {
  describe('Unauthenticated home page UI component should load', () => {
    let history

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
      global.IntersectionObserver = class IntersectionObserver {
        observe = jest.fn()
        disconnect = jest.fn()
        unobserve = jest.fn()
      };
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
          <Home />
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
            },
            home: {
              currentVideo: {},
              homeLoading: true,
              videoLoading: true,
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
              comments: [{
                "id": 1,
                "username": "Pearsauce",
                "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
                "userId": 1,
                "comment_text": "Physics is really, really cool!",
                "date_comment": "2021-06-09",
                "date_comment_edited": "2021-06-10",
                "edited": true,
                "has_replies": true,
                "commented_video": 2,
                "user_commenting": 1,
                "parent_comment": null,
                "replies": [{
                  "id": 25,
                  "username": "Hamburger",
                  "profilePic": "user-images/Joe_Biden_presidential_portrait_yUJKPMd.jpg",
                  "userId": 2,
                  "comment_text": "I take back what I said, this guy sucks!",
                  "date_comment": "2021-06-10",
                  "date_comment_edited": "2021-06-10",
                  "edited": true,
                  "has_replies": true,
                  "commented_video": 1,
                  "user_commenting": 2,
                  "parent_comment": 1
                }]
              }],
            }
          }
        }
      )
    })

    it('renders', async () => {
      await waitFor(() => {
        expect(screen.getByText(/log in to get started./i)).toBeInTheDocument()
      })
    })

    it('set filter and order options', async () => {
      await waitFor(() => {
        expect(screen.getByText(/log in to get started./i)).toBeInTheDocument()
      })
      userEvent.click(screen.getByText(/sort by/i))
      userEvent.click(screen.getByText(/popular/i))
      await waitFor(() => {
        expect(screen.getByText('Filter: popular in descending order')).toBeInTheDocument()
      })
      userEvent.click(screen.getByText("Order"))
      userEvent.click(screen.getByText("Ascending"))
      await waitFor(() => {
        expect(screen.getByText('Filter: popular in ascending order')).toBeInTheDocument()
      })
      expect(screen.getByText('Filter: popular in ascending order')).toBeInTheDocument()
    })
  })


  describe('Authenticated home page UI component should load', () => {
    let history

    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
      global.IntersectionObserver = class IntersectionObserver {
        observe = jest.fn()
        disconnect = jest.fn()
        unobserve = jest.fn()
      };
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
          <Home />
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
            home: {
              currentVideo: {},
              homeLoading: true,
              videoLoading: true,
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
              comments: [{
                "id": 1,
                "username": "Pearsauce",
                "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
                "userId": 1,
                "comment_text": "Physics is really, really cool!",
                "date_comment": "2021-06-09",
                "date_comment_edited": "2021-06-10",
                "edited": true,
                "has_replies": true,
                "commented_video": 2,
                "user_commenting": 1,
                "parent_comment": null,
                "replies": [{
                  "id": 25,
                  "username": "Hamburger",
                  "profilePic": "user-images/Joe_Biden_presidential_portrait_yUJKPMd.jpg",
                  "userId": 2,
                  "comment_text": "I take back what I said, this guy sucks!",
                  "date_comment": "2021-06-10",
                  "date_comment_edited": "2021-06-10",
                  "edited": true,
                  "has_replies": true,
                  "commented_video": 1,
                  "user_commenting": 2,
                  "parent_comment": 1
                }]
              }],
            }
          }
        }
      )
    })

    it('renders', async () => {
      await waitFor(() => {
        expect(screen.getByText(/welcome, registered user./i)).toBeInTheDocument()
      })
    })

    it('set filter and order options', async () => {
      await waitFor(() => {
        expect(screen.getByText(/welcome, registered user./i)).toBeInTheDocument()
      })
      userEvent.click(screen.getByText(/sort by/i))
      userEvent.click(screen.getByText(/popular/i))
      await waitFor(() => {
        expect(screen.getByText('Filter: popular in descending order')).toBeInTheDocument()
      })
      userEvent.click(screen.getByText("Order"))
      userEvent.click(screen.getByText("Ascending"))
      await waitFor(() => {
        expect(screen.getByText('Filter: popular in ascending order')).toBeInTheDocument()
      })
      expect(screen.getByText('Filter: popular in ascending order')).toBeInTheDocument()
    })
  })

  describe('filter options should work', () => {
    it('renders', () => {
      const setFilterOption = jest.fn(x => x)
      const setOrderOption = jest.fn(x => x)
      render(
        <FilterOptions
          filtered={"empty"}
          ascending={false}
          setFilterOption={setFilterOption}
          setOrderOption={setOrderOption}
        />
      )
      expect(screen.getByText(/filter/i)).toBeInTheDocument()
      userEvent.click(screen.getByText(/sort by/i))
      userEvent.click(screen.getByText(/popular/i))
      userEvent.click(screen.getByText(/sort by/i))
      userEvent.click(screen.getByText("Recent"))
      userEvent.click(screen.getByText("Order"))
      userEvent.click(screen.getByText(/ascending/i))
      userEvent.click(screen.getByText("Order"))
      userEvent.click(screen.getByText("Descending"))
      expect(setFilterOption.mock.calls).toHaveLength(2)
      expect(setOrderOption.mock.calls).toHaveLength(2)
    })
  })

  describe('video grid should work', () => {
    it('renders', () => {
      render(
        <VideoGrid
          videos={[
            {
              id: 1,
              video_title: 'Milestone 1 Video (Snippet)',
              video_description: 'Testing upload function',
              subject: 'Science',
              views: 30,
              likes: 0,
              num_of_comments: 6,
              asset_id: 'rTlMQEuMQAUV2VnTUc202QL56FPqQOgmXTu9348BNEWg',
              playback_id: 'yuV6wIzNXSnX7eZL8uyRTaJjxWPU9fLBV6I7LTKfh02k',
              duration: 0,
              policy: 'public',
              created_at: '10 days ago',
              creator_profile: {
                id: 2,
                profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/Joe_Biden_presidential_portrait_yUJKPMd.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=btYyVdtlaOMPc2ZhF6MDNj58ino%3D&Expires=1623658909',
                username: 'Hamburger',
                user_bio: 'Hi, I love eating hamburgers!',
                is_tutor: true,
                is_student: false,
                tutor_whatsapp: 12345678,
                tutor_telegram: '@hamburger',
                aggregate_star: 4.5,
                location: null,
                duration_classes: [
                  2,
                  3
                ],
                subjects: [
                  'Math',
                  'Cooking'
                ],
                total_tutor_reviews: 2,
                qualifications: 'Primary school tutor',
                user: 2
              }
            }
          ]}
        />
      )
      expect(screen.getByText(/hamburger/i)).toBeInTheDocument()
      expect(screen.getByText("Milestone 1 Video (Snippet)")).toBeInTheDocument()
    })
  })
})