import * as actions from "../action"
import * as types from "../actionTypes"
import * as componentTypes from "../../components/actionTypes"
import { fakeLocalStorage } from "../../../util/storage"

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

//yarn run test -- --coverage --watchAll=false
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('home actions without API calls should dispatch correctly', () => {
  it('change filter dispatches correctly', () => {
    const expectedActionOne = {
      type: types.CHANGE_FILTER,
      payload: 'popular'
    }
    const store = mockStore({})
    return store.dispatch(actions.changeFilter('popular')).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('change ascending dispatches correctly', () => {
    const expectedActionOne = {
      type: types.CHANGE_ASCENDING,
      payload: 'ascending'
    }
    const store = mockStore({})
    return store.dispatch(actions.changeAscending('ascending')).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('change page dispatches correctly', () => {
    const expectedActionOne = {
      type: types.CHANGE_PAGE,
      payload: 1
    }
    const store = mockStore({})
    return store.dispatch(actions.changePage(1)).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('clear videos dispatches correctly', () => {
    const expectedActionOne = {
      type: types.CLEAR_VIDEO_PAGE,
    }
    const store = mockStore({})
    return store.dispatch(actions.clearVideos()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('set video loading dispatches correctly', () => {
    const expectedActionOne = {
      type: types.VIDEO_LOADING
    }
    const store = mockStore({})
    return store.dispatch(actions.setVideoLoading()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('start upload dispatches correctly', () => {
    const expectedActionOne = {
      type: types.UPLOAD_STARTED
    }
    const store = mockStore({})
    return store.dispatch(actions.startUpload()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('end upload dispatches correctly', () => {
    const expectedActionOne = {
      type: types.UPLOAD_ENDED
    }
    const store = mockStore({})
    return store.dispatch(actions.endUpload()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('comments loading dispatches correctly', () => {
    const expectedActionOne = {
      type: types.COMMENT_LOADING
    }
    const store = mockStore({})
    return store.dispatch(actions.commentsLoading()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('comments loaded dispatches correctly', () => {
    const expectedActionOne = {
      type: types.COMMENT_LOADED
    }
    const store = mockStore({})
    return store.dispatch(actions.commentsLoaded()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })
})

describe('home actions calling APIs should dispatch correctly', () => {
  describe('load home videos actions should dispatch correctly', () => {
    it('successful home video load dispatches correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("recent", false, 1, false)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADING)
        expect(store.getActions()[1].type).toEqual(types.HOMEPAGE_LOADED)
      })
    })

    it('failed home video load dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("recent", false, 3, false)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADING)
        expect(store.getActions()[1].type).toEqual(types.HOMEPAGE_LOAD_FAIL)
      })
    })

    it('reached end home video load dispatches end actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("popular", true, 2, false)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADING)
        expect(store.getActions()[1].type).toEqual(types.REACHED_END)
        expect(store.getActions()[2].type).toEqual(types.HOMEPAGE_LOAD_FAIL)
      })
    })

    it('invalid page number results in no action dispatches', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("recent", false, 0, false)).then(() => {
        expect(store.getActions().length).toEqual(0)
      })
    })

    it('reached end results in no action dispatches', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("recent", false, 1, true)).then(() => {
        expect(store.getActions().length).toEqual(0)
      })
    })
  })

  describe('load watch videos actions should dispatch correctly', () => {
    it('successful watch video load dispatches correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadWatchVideos(1)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADED)
      })
    })

    it('failed watch video load dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadWatchVideos(0)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOAD_FAILED)
      })
    })
  })

  describe('get comment actions should dispatch correctly', () => {
    it('successful get comments dispatches correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.getComments(1)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].type).toEqual(types.GET_COMMENTS)
      })
    })

    it('failed get comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.getComments(0)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].type).toEqual(types.COMMENT_LOADED)
      })
    })

    it('empty videoId get comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.getComments(undefined)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].type).toEqual(types.COMMENT_LOADED)
        expect(store.getActions()[2].payload.msg).toEqual("No video id is provided.")
      })
    })
  })

  describe('add comment actions should dispatch correctly', () => {
    const closeComment = jest.fn()
    const emptyComment = jest.fn()

    it('successful add comments dispatches correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.addComments({ comment: "Hello" }, 1, closeComment, emptyComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].type).toEqual(types.ADD_COMMENT)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('failed add comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.addComments({ comment: "Hello" }, 0, closeComment, emptyComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2].type).toEqual(types.COMMENT_LOADED)
      })
    })

    it('empty field add comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.addComments({ comment: "" }, 0, closeComment, emptyComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].payload.msg).toEqual('Comment field cannot be empty')
        expect(store.getActions()[2].type).toEqual(types.COMMENT_LOADED)
      })
    })

    it('undefined field add comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.addComments({ comment: undefined }, undefined, closeComment, emptyComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.COMMENT_LOADING)
        expect(store.getActions()[1].payload.msg).toEqual("Error, no comment or videoId found")
        expect(store.getActions()[2].type).toEqual(types.COMMENT_LOADED)
      })
    })
  })

  describe('edit comment actions should dispatch correctly', () => {
    const closeComment = jest.fn()

    it('successful edit comments dispatches correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editComments("Hello", 1, closeComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
        expect(store.getActions()[1].type).toEqual(types.EDIT_COMMENT)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('failed edit comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editComments("Hello", 0, closeComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
      })
    })

    it('empty edit comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editComments("", 0, closeComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
        expect(store.getActions()[1].payload.msg).toEqual('Comment field cannot be empty')
        expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
      })
    })

    it('undefined edit comments dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editComments(undefined, undefined, closeComment)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
        expect(store.getActions()[1].payload.msg).toEqual("Error, no comment or comment Id found")
        expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
      })
    })

    describe('delete comment actions should dispatch correctly', () => {
      it('successful delete comments dispatches correct actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteComments(1)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(types.DELETE_COMMENT)
          expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
        })
      })

      it('failed delete comments dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteComments(0)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
        })
      })

      it('undefined delete comments dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteComments(undefined)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual("Error, no comment Id found")
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
        })
      })
    })

    describe('get replies actions should dispatch correctly', () => {
      it('successful get replies dispatches correct actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.getReplies(1)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENTREPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(types.GET_REPLIES)
        })
      })

      it('failed get replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.getReplies(0)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENTREPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENTREPLY_LOADING_ID)
        })
      })

      it('undefined get replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.getReplies(undefined)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENTREPLY_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual("Error, no comment Id found")
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENTREPLY_LOADING_ID)
        })
      })
    })

    describe('post replies actions should dispatch correctly', () => {
      const closeReply = jest.fn()
      it('successful post replies dispatches correct actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.postReply({ reply: "hello" }, 1, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(types.CREATE_REPLIES)
          expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
        })
      })

      it('failed post replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.postReply({ reply: "hello" }, 0, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
        })
      })

      it('empty post reply dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.postReply({ reply: "" }, 1, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual('Reply field cannot be empty')
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
        })
      })

      it('undefined post reply dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.postReply({ reply: undefined }, undefined, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_COMMENT_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual("Error, no reply or comment Id found")
          expect(store.getActions()[2].type).toEqual(types.REMOVE_COMMENT_LOADING_ID)
        })
      })
    })

    describe('edit replies actions should dispatch correctly', () => {
      const closeReply = jest.fn()
      it('successful edit replies dispatches correct actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.editReply("hello", 1, 1, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(types.EDIT_REPLIES)
          expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
        })
      })

      it('failed edit replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.editReply("hello", 0, 0, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
          expect(store.getActions()[2].type).toEqual(types.REMOVE_REPLY_LOADING_ID)
        })
      })

      it('empty edit replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.editReply("", 0, 0, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual('Comment field cannot be empty')
          expect(store.getActions()[2].type).toEqual(types.REMOVE_REPLY_LOADING_ID)
        })
      })


      it('undefined edit replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.editReply(undefined, undefined, undefined, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual("Error, no comment, comment id or reply id found")
          expect(store.getActions()[2].type).toEqual(types.REMOVE_REPLY_LOADING_ID)
        })
      })

    })

    describe('delete replies actions should dispatch correctly', () => {
      const closeReply = jest.fn()
      it('successful delete replies dispatches correct actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteReply(1, 1, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(types.DELETE_REPLIES)
          expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
        })
      })

      it('failed delete replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteReply(0, 0, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
          expect(store.getActions()[2].type).toEqual(types.REMOVE_REPLY_LOADING_ID)
        })
      })

      it('empty edit replies dispatches error actions', () => {
        const store = mockStore({})
        return store.dispatch(actions.deleteReply(undefined, 0, closeReply)).then(() => {
          expect(store.getActions()[0].type).toEqual(types.SET_REPLY_LOADING_ID)
          expect(store.getActions()[1].payload.msg).toEqual("Error, no reply Id found")
          expect(store.getActions()[2].type).toEqual(types.REMOVE_REPLY_LOADING_ID)
        })
      })

    })
  })
})