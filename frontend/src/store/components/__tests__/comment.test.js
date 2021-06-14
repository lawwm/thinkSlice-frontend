import { render, screen, waitFor, waitForElementToBeRemoved } from '../../../util/test-utils'

import { CommentPost, MapReplies, ReplyPost } from '../../../components/Comment'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fakeLocalStorage } from "../../../util/storage"
//yarn run test -- --coverage --watchAll=false

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
          <CommentPost
            commentId={1}
            commentText={"Hello"}
            date={"13-6-2021"}
            username={"John"}
            userId={"1"}
            profilePic={"src"}
            hasReplies={true}
            edited={false}
            dateEdited={'13-6-2021'}
            replies={[{
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
            }]}
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

    it('redirects to profile if click on profile picture', () => {
      userEvent.click(screen.getByAltText(/comment profile/i))
      expect(history.location.pathname).toEqual('/profile/1')
    })

    it('can hide and show replies', async () => {
      //cannot view reply username
      expect(screen.queryByText(/hamburger/i)).not.toBeInTheDocument()
      userEvent.click(screen.getByText(/view more replies/i))

      //once spinner finishes can view replies username
      await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
      expect(screen.queryByText(/hamburger/i)).toBeInTheDocument()

      //hide replies
      userEvent.click(screen.getByText(/hide replies/i))
      expect(screen.queryByText(/hamburger/i)).not.toBeInTheDocument()
    })

    it('can use reply button', async () => {
      //comment textbox does not appears
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reply comment show/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /reply comment show/i }))

      //comment text appears
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      //close comment text
      userEvent.click(screen.getByRole('button', { name: /reply comment cancel/i }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      //Type within reply text
      userEvent.click(screen.getByRole('button', { name: /reply comment show/i }))
      userEvent.type(screen.getByRole('textbox'), ' Hi dude')
      expect(screen.getByRole('textbox')).toHaveValue('@John Hi dude')

      //Submit reply and wait for spinner to disappear
      userEvent.click(screen.getByRole('button', { name: /reply comment submit/i }))
      await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('can use edit button', async () => {
      //edit textbox appears when clicking edit button
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /edit comment show/i }))
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      //edit textbox closes when clicking cancel button
      userEvent.click(screen.getByRole('button', { name: /edit comment cancel/i }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      //Type within reply text
      userEvent.click(screen.getByRole('button', { name: /edit comment show/i }))
      userEvent.type(screen.getByRole('textbox'), ' Hi dude')
      expect(screen.getByRole('textbox')).toHaveValue('Hello Hi dude')

      //Submit reply
      userEvent.click(screen.getByRole('button', { name: /edit comment submit/i }))
      await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('can use delete button', async () => {
      //trash button appears when delete button is clicked
      expect(screen.getByRole('button', { name: /delete comment show/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /delete comment show/i }))
      expect(screen.getByRole('button', { name: /delete comment submit/i })).toBeInTheDocument()

      //trash button disappears when  delete button is clicked again
      userEvent.click(screen.getByRole('button', { name: /delete comment show/i }))
      expect(screen.queryByRole('button', { name: /delete comment submit/i })).not.toBeInTheDocument()

      //Delete the reply post
      userEvent.click(screen.getByRole('button', { name: /delete comment show/i }))
      expect(screen.queryByRole('button', { name: /delete comment submit/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /delete comment submit/i }))

      //Wait for spinner to finish loading, ensure spinner is gone
      await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
      await expect(screen.queryByRole('img', { name: 'spinner' })).not.toBeInTheDocument()
    })
  })
})

describe('Reply Post', () => {
  describe('Reply post UI component should work', () => {
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
          <ReplyPost
            commentId={1}
            replyId={1}
            commentText={"Hello"}
            date={"13-6-2021"}
            username={"John"}
            userId={1}
            profilePic={"src"}
            edited={false}
            dateEdited={'13-6-2021'}
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
                "has_replies": false,
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

    it('redirects to profile if click on profile picture', () => {
      userEvent.click(screen.getByAltText(/reply profile/i))
      expect(history.location.pathname).toEqual('/profile/1')
    })

    it('Can use reply button', async () => {
      //reply text appears
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reply reply show/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /reply reply show/i }))

      //reply text appears
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      //close reply text
      userEvent.click(screen.getByRole('button', { name: /reply reply cancel/i }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      //Type within reply text
      userEvent.click(screen.getByRole('button', { name: /reply reply show/i }))
      userEvent.type(screen.getByRole('textbox'), ' Hi dude')
      expect(screen.getByRole('textbox')).toHaveValue('@John Hi dude')

      //Submit reply
      userEvent.click(screen.getByRole('button', { name: /reply reply submit/i }))
      await waitForElementToBeRemoved(screen.getByRole('textbox'))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('can use edit button', async () => {
      //edit textbox appears when clicking edit button
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /edit reply show/i }))
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      //edit textbox closes when clicking edit button
      userEvent.click(screen.getByRole('button', { name: /edit reply cancel/i }))
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      //Type within reply text
      userEvent.click(screen.getByRole('button', { name: /edit reply show/i }))
      userEvent.type(screen.getByRole('textbox'), ' Hi dude')
      expect(screen.getByRole('textbox')).toHaveValue('Hello Hi dude')

      //Submit reply
      userEvent.click(screen.getByRole('button', { name: /edit reply submit/i }))
      await screen.findByText(/john/i)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('can use delete button', async () => {
      //trash button appears when delete button is clicked
      expect(screen.getByRole('button', { name: /delete reply show/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /delete reply show/i }))
      expect(screen.getByRole('button', { name: /delete reply submit/i })).toBeInTheDocument()

      //trash button disappears when  delete button is clicked again
      userEvent.click(screen.getByRole('button', { name: /delete reply show/i }))
      expect(screen.queryByRole('button', { name: /delete reply submit/i })).not.toBeInTheDocument()

      //Delete the reply post
      userEvent.click(screen.getByRole('button', { name: /delete reply show/i }))
      expect(screen.queryByRole('button', { name: /delete reply submit/i })).toBeInTheDocument()
      userEvent.click(screen.getByRole('button', { name: /delete reply submit/i }))

      //Wait for spinner to finish loading, ensure spinner is gone
      await waitForElementToBeRemoved(() => screen.getByRole('img', { name: 'spinner' }))
      await expect(screen.queryByRole('img', { name: 'spinner' })).not.toBeInTheDocument()
    })
  })
})

describe('Map replies', () => {
  describe('Map replies UI component should work', () => {
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
      render(
        <Router history={history}>
          <MapReplies
            commentId={1}
            replies={[
              {
                "id": 49,
                "username": "Pearsauce",
                "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
                "userId": 1,
                "comment_text": "@Hamburger This video is terrible, I can't understand him at all",
                "date_comment": "2021-06-10",
                "date_comment_edited": "2021-06-10",
                "edited": false,
                "has_replies": false,
                "commented_video": 1,
                "user_commenting": 1,
                "parent_comment": 25
              }
            ]}
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
                "has_replies": false,
                "commented_video": 2,
                "user_commenting": 1,
                "parent_comment": null,
                "replies": []
              }],
            }
          }
        }
      )
    })

    it('map replies renders', () => {
      expect(screen.getByText("Pearsauce")).toBeInTheDocument()
    })
  })
})