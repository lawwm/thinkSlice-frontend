import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'

import WatchPage, { Description, Comment } from '../../../routes/home/watch'
import userEvent from '@testing-library/user-event'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"

describe('Watch page', () => {
  describe('Watch page UI component should work', () => {
    describe('Authenticated watch page should work', () => {
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
        window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };
      });

      afterEach(() => {
        window.localStorage.clear()
      })

      afterAll(() => {
        delete window.localStorage
      })

      beforeEach(() => {
        history = createMemoryHistory()
        const route = "/watch/1"
        history.push(route)
        window.localStorage.setItem('user', 1)
        render(
          <Router history={history}>
            <Route path="/watch/:videoId">
              <WatchPage />
            </Route>
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

      it('watch page authenticated renders', async () => {
        await waitFor(() => {
          expect(screen.getByText(/learn physics/i)).toBeInTheDocument()
        })
      })

      it('redirect to creator profile page when clicking on profile picture', async () => {
        await waitFor(() => {
          expect(screen.getByAltText(/creator/i)).toBeInTheDocument()
        })
        userEvent.click(screen.getByAltText(/creator/i))
        expect(history.location.pathname).toEqual("/profile/1")
      })
    })

    describe('Unauthenticated watch page should work', () => {


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
        window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
        window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };
      });

      afterEach(() => {
        window.localStorage.clear()
      })

      afterAll(() => {
        delete window.localStorage
      })

      beforeEach(() => {
        history = createMemoryHistory()
        const route = "/watch/1"
        history.push(route)
        window.localStorage.setItem('user', 1)
        render(
          <Router history={history}>
            <Route path="/watch/:videoId">
              <WatchPage />
            </Route>
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

      it('watch page unauthenticated renders', async () => {
        await waitFor(() => {
          expect(screen.getByText(/learn physics/i)).toBeInTheDocument()
        })
      })

      it('redirect to creator profile page when clicking on profile picture', async () => {
        await waitFor(() => {
          expect(screen.getByAltText(/creator/i)).toBeInTheDocument()
        })
        userEvent.click(screen.getByAltText(/creator/i))
        expect(history.location.pathname).toEqual("/profile/1")
      })
    })
  })

  describe('Watch page helper components', () => {
    describe('Comment UI components should work', () => {
      let history

      beforeEach(() => {
        history = createMemoryHistory()
        const route = "/watch/1"
        history.push(route)
        render(
          <Router history={history}>
            <Comment totalComments={1} videoId={1} />
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

      it('can close and hide comments', () => {
        //Can show comments when clicking on show
        expect(screen.getByText(/show 1 comments/i)).toBeInTheDocument()
        userEvent.click(screen.getByText(/show 1 comments/i))
        expect(screen.getByText(/comment on this video?/i)).toBeInTheDocument()

        //Can hide comments when clicking on hide
        userEvent.click(screen.getByText(/hide comments/i))
        expect(screen.getByText(/show 1 comments/i)).toBeInTheDocument()
        expect(screen.queryByText(/comment on this video?/i)).not.toBeInTheDocument()
      })

      it('can submit comment', async () => {
        //Open up comments
        expect(screen.getByText(/show 1 comments/i)).toBeInTheDocument()
        userEvent.click(screen.getByText(/show 1 comments/i))
        expect(screen.getByText(/comment on this video?/i)).toBeInTheDocument()

        //Write within comment input
        userEvent.click(screen.getByText(/comment on this video?/i))
        expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument()
        userEvent.type(screen.getByRole('textbox', { name: '' }), "Hello World")
        expect(screen.getByRole('textbox', { name: '' })).toHaveValue("Hello World")

        //Can cancel comment
        userEvent.click(screen.getByText(/cancel/i))
        expect(screen.queryByText(/hello world/i)).not.toBeInTheDocument()
        userEvent.click(screen.getByText(/comment on this video?/i))
        expect(screen.getByRole('textbox', { name: '' })).toHaveValue("Hello World")

        //Can submit comment
        userEvent.click(screen.getByText(/submit/i))
        await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
        expect(screen.queryByText(/hello world/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Description UI component should work', () => {
    let history

    const shortDescription = "Hello my name is john and this is a video on physics"
    const longDescription = "It is a long established fact that a reader will be distracted by" +
      "the readable content of a page when looking at its layout. The point of using Lorem Ipsum" +
      "is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here," +
      " content here', making it look like readable English. Many desktop publishing packages and web" +
      " page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will" +
      " uncover many web sites still in their infancy. Various versions have evolved over the years," +
      " sometimes by accident, sometimes on purpose injected humour and the like." +
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of" +
      "classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a" +
      " Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin" +
      " words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in" +
      " classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32" +
      " and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written" +
      " in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance." +
      " The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section"


    it('short description shows when word limit not exceeded', () => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Description description={shortDescription} />
        </Router>,
      )
      expect(screen.getByText(/hello my name/i)).toBeInTheDocument()
    })

    it('can show and hide full description when description exceeds 100 word limit', () => {
      history = createMemoryHistory()
      render(
        <Router history={history}>
          <Description description={longDescription} />
        </Router>,
      )
      //Full content does not appear
      expect(screen.getByText(/show content/i)).toBeInTheDocument()
      expect(screen.queryByText(/It is a long established fact/i)).toBeInTheDocument()
      expect(screen.queryByText(/comes from a line in section/i)).not.toBeInTheDocument()

      //Full content appears
      userEvent.click(screen.getByText(/show content/i))
      expect(screen.queryByText(/comes from a line in section/i)).toBeInTheDocument()

      //Full content does not appear
      userEvent.click(screen.getByText(/hide content/i))
      expect(screen.queryByText(/comes from a line in section/i)).not.toBeInTheDocument()
    })
  })
})