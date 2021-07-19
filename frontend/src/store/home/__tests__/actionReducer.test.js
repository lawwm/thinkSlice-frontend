import * as actions from "../action"
import * as types from "../actionTypes"
import * as componentTypes from "../../components/actionTypes"
import { fakeLocalStorage } from "../../../util/storage"

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { home } from "../reducer"

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
        expect(store.getActions()[0].type).toEqual(types.HOME_LOADING)
        expect(store.getActions()[1].type).toEqual(types.HOMEPAGE_LOADED)
      })
    })

    it('failed home video load dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("recent", false, 3, false)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.HOME_LOADING)
        expect(store.getActions()[1].type).toEqual(types.HOMEPAGE_LOAD_FAIL)
      })
    })

    it('reached end home video load dispatches end actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadHomeVideos("popular", true, 2, false)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.HOME_LOADING)
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
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADING)
      })
    })

    it('failed watch video load dispatches error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.loadWatchVideos(0)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.VIDEO_LOADING)
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

const initialReducerState = {
  videos: [],
  homeLoading: true,
  videoLoading: true,
  commentLoading: true,
  commentLoadingId: [],
  commentReplyLoadingId: [],
  replyLoadingId: [],
  currentVideo: {},
  isUploading: false,
  reachedEnd: false,
  filterBy: "recent",
  ascending: false,
  page: 1,
  subject: '',
  location: '',
  availability: '',
  review: '',
  searchQuery: '',
  firstLoad: true,
  removedVideoIndex: -1,
  comments: [],
}

describe('home page reducers should work', () => {
  it('HOMEPAGE_LOADED reducers should work', () => {
    expect(
      home(undefined, {
        type: types.HOMEPAGE_LOADED,
        payload: [{
          "id": 2,
          "video_title": "Learn physics",
          "video_description": "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
          "subject": "Physics",
          "views": 404,
          "likes": 0,
          "num_of_comments": 4,
          "asset_id": "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
          "playback_id": "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
          "duration": 0.0,
          "policy": "public",
          "created_at": 1622812186,
          "creator_profile": {
            "id": 25,
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/",
            "username": "jimijam",
            "user_bio": "Hi, welcome to my profile! Cool profilez",
            "is_tutor": true,
            "is_student": false,
            "tutor_whatsapp": 12345678,
            "tutor_telegram": "@jimijam",
            "aggregate_star": null,
            "location": "South",
            "duration_classes": [
              5,
              8
            ],
            "subjects": [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            "total_tutor_reviews": 0,
            "qualifications": "P6 tutor",
            "user": 26
          }
        }]
      })
    ).toEqual({
      ...initialReducerState,
      videos: [{
        "id": 2,
        "video_title": "Learn physics",
        "video_description": "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
        "subject": "Physics",
        "views": 404,
        "likes": 0,
        "num_of_comments": 4,
        "asset_id": "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
        "playback_id": "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
        "duration": 0.0,
        "policy": "public",
        "created_at": 1622812186,
        "creator_profile": {
          "id": 25,
          "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/",
          "username": "jimijam",
          "user_bio": "Hi, welcome to my profile! Cool profilez",
          "is_tutor": true,
          "is_student": false,
          "tutor_whatsapp": 12345678,
          "tutor_telegram": "@jimijam",
          "aggregate_star": null,
          "location": "South",
          "duration_classes": [
            5,
            8
          ],
          "subjects": [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          "total_tutor_reviews": 0,
          "qualifications": "P6 tutor",
          "user": 26
        }
      }],
      homeLoading: false,
      firstLoad: false
    })
  })

  it('VIDEO_LOADED reducers should work', () => {
    expect(
      home(undefined, {
        type: types.VIDEO_LOADED,
        payload: {
          "id": 2,
          "video_title": "Learn physics",
          "video_description": "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
          "subject": "Physics",
          "views": 404,
          "likes": 0,
          "num_of_comments": 4,
          "asset_id": "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
          "playback_id": "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
          "duration": 0.0,
          "policy": "public",
          "created_at": 1622812186,
          "creator_profile": {
            "id": 25,
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/",
            "username": "jimijam",
            "user_bio": "Hi, welcome to my profile! Cool profilez",
            "is_tutor": true,
            "is_student": false,
            "tutor_whatsapp": 12345678,
            "tutor_telegram": "@jimijam",
            "aggregate_star": null,
            "location": "South",
            "duration_classes": [
              5,
              8
            ],
            "subjects": [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            "total_tutor_reviews": 0,
            "qualifications": "P6 tutor",
            "user": 26
          }
        }
      })
    ).toEqual({
      ...initialReducerState,
      currentVideo: {
        "id": 2,
        "video_title": "Learn physics",
        "video_description": "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
        "subject": "Physics",
        "views": 404,
        "likes": 0,
        "num_of_comments": 4,
        "asset_id": "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
        "playback_id": "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
        "duration": 0.0,
        "policy": "public",
        "created_at": 1622812186,
        "creator_profile": {
          "id": 25,
          "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/",
          "username": "jimijam",
          "user_bio": "Hi, welcome to my profile! Cool profilez",
          "is_tutor": true,
          "is_student": false,
          "tutor_whatsapp": 12345678,
          "tutor_telegram": "@jimijam",
          "aggregate_star": null,
          "location": "South",
          "duration_classes": [
            5,
            8
          ],
          "subjects": [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          "total_tutor_reviews": 0,
          "qualifications": "P6 tutor",
          "user": 26
        }
      },
      videoLoading: false,
      videos: [],
    })
  })

  it('VIDEO_LOADING reducers should work', () => {
    expect(
      home(undefined, {
        type: types.VIDEO_LOADING
      })
    ).toEqual({
      ...initialReducerState,
      videoLoading: true,
    })
  })

  it('HOME_LOADING reducers should work', () => {
    expect(
      home(undefined, {
        type: types.HOME_LOADING
      })
    ).toEqual({
      ...initialReducerState,
      homeLoading: true,
    })
  })

  it('HOMEPAGE_LOAD_FAIL reducers should work', () => {
    expect(
      home(undefined, {
        type: types.HOMEPAGE_LOAD_FAIL
      })
    ).toEqual({
      ...initialReducerState,
      homeLoading: false,
    })
  })

  it('UPLOAD_STARTED reducers should work', () => {
    expect(
      home(undefined, {
        type: types.UPLOAD_STARTED
      })
    ).toEqual({
      ...initialReducerState,
      isUploading: true,
    })
  })

  it('UPLOAD_ENDED reducers should work', () => {
    expect(
      home(undefined, {
        type: types.UPLOAD_ENDED
      })
    ).toEqual({
      ...initialReducerState,
      isUploading: false,
    })
  })

  it('REACHED_END reducers should work', () => {
    expect(
      home(undefined, {
        type: types.REACHED_END
      })
    ).toEqual({
      ...initialReducerState,
      reachedEnd: true,
    })
  })

  it('CHANGE_FILTER reducers should work', () => {
    expect(
      home(undefined, {
        type: types.CHANGE_FILTER,
        payload: 'popular'
      })
    ).toEqual({
      ...initialReducerState,
      filterBy: 'popular',
      videos: [],
      reachedEnd: false,
      page: 1
    })
  })

  it('CHANGE_ASCENDING reducers should work', () => {
    expect(
      home(undefined, {
        type: types.CHANGE_ASCENDING,
        payload: true
      })
    ).toEqual({
      ...initialReducerState,
      videos: [],
      reachedEnd: false,
      ascending: true,
      page: 1,
    })
  })

  it('CHANGE_PAGE reducers should work', () => {
    expect(
      home(undefined, {
        type: types.CHANGE_PAGE,
        payload: true
      })
    ).toEqual({
      ...initialReducerState,
      page: 2,
    })
  })

  it('COMMENT_LOADING reducers should work', () => {
    expect(
      home(undefined, {
        type: types.COMMENT_LOADING,
      })
    ).toEqual({
      ...initialReducerState,
      commentLoading: true,
    })
  })

  it('COMMENT_LOADED reducers should work', () => {
    expect(
      home(undefined, {
        type: types.COMMENT_LOADED,
      })
    ).toEqual({
      ...initialReducerState,
      commentLoading: false,
    })
  })

  it('GET_COMMENTS reducers should work', () => {
    expect(
      home(undefined, {
        type: types.GET_COMMENTS,
        payload: [
          {
            "id": 13,
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
            "parent_comment": null
          }
        ]
      })
    ).toEqual({
      ...initialReducerState,
      commentLoading: false,
      comments: [{
        "id": 13,
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
    })
  })


  it('ADD_COMMENTS reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        page: 1,
        commentLoading: false,
        comments: [],
        currentVideo: {
          num_of_comments: 9
        }
      }, {
        type: types.ADD_COMMENT,
        payload:
        {
          "id": 13,
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
          "parent_comment": null
        }

      })
    ).toEqual({
      ...initialReducerState,
      page: 1,
      commentLoading: false,
      comments: [{
        "id": 13,
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
      currentVideo: {
        num_of_comments: 10
      }
    })
  })

  it('SET_COMMENT_LOADING_ID reducers should work', () => {
    expect(
      home(undefined, {
        type: types.SET_COMMENT_LOADING_ID,
        payload: 2
      })
    ).toEqual({
      ...initialReducerState,
      commentLoadingId: [2],
    })
  })


  it('REMOVE_COMMENT_LOADING_ID reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentLoadingId: [2, 3, 4],
      }, {
        type: types.REMOVE_COMMENT_LOADING_ID,
        payload: 2
      })
    ).toEqual({
      ...initialReducerState,
      commentLoadingId: [3, 4],
    })
  })

  it('EDIT_COMMENT reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentLoadingId: [13],
        comments: [{
          "id": 13,
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
      }, {
        type: types.EDIT_COMMENT,
        payload:
        {
          id: 13,
          data: {
            "id": 13,
            "comment_text": "Math is really, really cool!",
            "date_comment": "2021-06-09",
            "date_comment_edited": "2021-06-10",
            "edited": true,
            "has_replies": false,
            "commented_video": 2,
            "user_commenting": 1,
            "parent_comment": null
          }
        }
      })
    ).toEqual({
      ...initialReducerState,
      commentLoadingId: [],
      comments: [{
        "id": 13,
        "username": "Pearsauce",
        "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
        "userId": 1,
        "comment_text": "Math is really, really cool!",
        "date_comment": "2021-06-09",
        "date_comment_edited": "2021-06-10",
        "edited": true,
        "has_replies": false,
        "commented_video": 2,
        "user_commenting": 1,
        "parent_comment": null,
        "replies": []
      }],
    })
  })

  it('DELETE_COMMENT reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentLoadingId: [13],
        comments: [{
          "id": 13,
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
          "replies": [1, 2, 3]
        }],
        currentVideo: {
          num_of_comments: 9
        }
      }, {
        type: types.DELETE_COMMENT,
        payload: 13
      })
    ).toEqual({
      ...initialReducerState,
      commentLoadingId: [],
      comments: [],
      currentVideo: {
        num_of_comments: 5
      }
    })
  })


  it('SET_COMMENTREPLY_LOADING_ID reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentReplyLoadingId: [],
      }, {
        type: types.SET_COMMENTREPLY_LOADING_ID,
        payload: 13
      })
    ).toEqual({
      ...initialReducerState,
      commentReplyLoadingId: [13],
    })
  })

  it('SET_REPLY_LOADING_ID reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        replyLoadingId: [],
      }, {
        type: types.SET_REPLY_LOADING_ID,
        payload: 13
      })
    ).toEqual({
      ...initialReducerState,
      replyLoadingId: [13],
    })
  })

  it('REMOVE_COMMENTREPLY_LOADING_ID reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentReplyLoadingId: [13, 14, 15],
      }, {
        type: types.REMOVE_COMMENTREPLY_LOADING_ID,
        payload: 13
      })
    ).toEqual({
      ...initialReducerState,
      commentReplyLoadingId: [14, 15],
    })
  })

  it('REMOVE_REPLY_LOADING_ID reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        replyLoadingId: [13, 14, 15],
      }, {
        type: types.REMOVE_REPLY_LOADING_ID,
        payload: 13
      })
    ).toEqual({
      ...initialReducerState,
      replyLoadingId: [14, 15],
    })
  })

  it('GET_REPLIES reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentReplyLoadingId: [13],
        comments: [{
          "id": 13,
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
      }, {
        type: types.GET_REPLIES,
        payload:
        {
          id: 13,
          data: [{
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
          }]
        }
      })
    ).toEqual({
      ...initialReducerState,
      commentReplyLoadingId: [],
      comments: [{
        "id": 13,
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
        }]
      }],
    })
  })

  it('CREATE_REPLIES reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        commentLoadingId: [13],
        comments: [{
          "id": 13,
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
        currentVideo: {
          num_of_comments: 9
        }
      }, {
        type: types.CREATE_REPLIES,
        payload:
        {
          id: 13,
          data: {
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
        }
      })
    ).toEqual({
      ...initialReducerState,
      currentVideo: {
        num_of_comments: 10
      },
      commentLoadingId: [],
      comments: [{
        "id": 13,
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
        }]
      }],
    })
  })

  it('EDIT_REPLIES reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        replyLoadingId: [49],
        comments: [{
          "id": 13,
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
          }]
        }],
      }, {
        type: types.EDIT_REPLIES,
        payload:
        {
          commentId: 13,
          replyId: 49,
          data: {
            "id": 49,
            "username": "Pearsauce",
            "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
            "userId": 1,
            "comment_text": "@Hamburger This video is great, I can understand him",
            "date_comment": "2021-06-10",
            "date_comment_edited": "2021-06-10",
            "edited": false,
            "has_replies": false,
            "commented_video": 1,
            "user_commenting": 1,
            "parent_comment": 25
          }
        }
      })
    ).toEqual({
      ...initialReducerState,
      replyLoadingId: [],
      comments: [{
        "id": 13,
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
          "id": 49,
          "username": "Pearsauce",
          "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
          "userId": 1,
          "comment_text": "@Hamburger This video is great, I can understand him",
          "date_comment": "2021-06-10",
          "date_comment_edited": "2021-06-10",
          "edited": false,
          "has_replies": false,
          "commented_video": 1,
          "user_commenting": 1,
          "parent_comment": 25
        }]
      }],
    })
  })

  it('DELETE_REPLIES reducers should work', () => {
    expect(
      home({
        ...initialReducerState,
        replyLoadingId: [49],
        currentVideo: {
          num_of_comments: 9
        },
        comments: [{
          "id": 13,
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
          }]
        }],
      }, {
        type: types.DELETE_REPLIES,
        payload:
        {
          commentId: 13,
          replyId: 49,
          data: {
            "id": 49,
            "username": "Pearsauce",
            "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
            "userId": 1,
            "comment_text": "@Hamburger This video is great, I can understand him",
            "date_comment": "2021-06-10",
            "date_comment_edited": "2021-06-10",
            "edited": false,
            "has_replies": false,
            "commented_video": 1,
            "user_commenting": 1,
            "parent_comment": 25
          }
        }
      })
    ).toEqual({
      ...initialReducerState,
      replyLoadingId: [],
      currentVideo: {
        num_of_comments: 8
      },
      comments: [{
        "id": 13,
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
    })
  })
})