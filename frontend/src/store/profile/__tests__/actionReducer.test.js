import * as actions from "../action"
import * as types from "../actionTypes"
import * as componentTypes from "../../components/actionTypes"
import { fakeLocalStorage } from "../../../util/storage"
import { profile } from "../reducer"

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

//yarn run test -- --coverage --watchAll=false
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const initialReducerState = {
  profile: null,
  profileLoading: true,
  profileComponentLoading: false,
  reviewLoading: true,
  reviewPostLoading: false,
  detailedMode: false,
  editMode: false,
  reviewUser: null,
  reviewsGiven: [],
  reviewsReceived: [],
  profileLikes: []
};

describe('profile actions without API calls should dispatch correctly', () => {
  it('profile component dispatch loading action', () => {
    const expectedActionOne = {
      type: types.PROFILE_COMPONENT_LOADING
    }

    const store = mockStore({})
    return store.dispatch(actions.loadProfileComponent()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('profile component dispatch loaded action', () => {
    const expectedActionOne = {
      type: types.PROFILE_COMPONENT_LOADED
    }
    const store = mockStore({})
    return store.dispatch(actions.profileComponentLoaded()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('toggle profile detailed view', () => {
    const expectedActionOne = {
      type: types.PROFILE_DETAILED_VIEW,
      payload: true
    }
    const store = mockStore({})
    return store.dispatch(actions.toggleDetailedView(true)).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('toggle profile edit mode action', () => {
    const expectedActionOne = {
      type: types.PROFILE_EDIT_MODE,
      payload: true
    }
    const store = mockStore({})
    return store.dispatch(actions.toggleEditMode(true)).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('reset profile action', () => {
    const expectedActionOne = {
      type: types.PROFILE_RESET
    }
    const store = mockStore({})
    return store.dispatch(actions.resetProfile()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('set review loading action', () => {
    const expectedActionOne = {
      type: types.SET_REVIEW_LOADING
    }
    const store = mockStore({})
    return store.dispatch(actions.setReviewLoading()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })

  it('set review loaded action', () => {
    const expectedActionOne = {
      type: types.STOP_REVIEW_LOADING,
    }
    const store = mockStore({})
    return store.dispatch(actions.stopReviewLoading()).then(() => {
      expect(store.getActions()[0]).toEqual(expectedActionOne)
    })
  })
})

describe('profile actions calling API should dispatch correctly', () => {
  describe('get profile actions dispatch correctly', () => {
    const expectedActionOne = {
      type: types.PROFILE_LOADING,
    }

    it('get profile succeeds', () => {
      const store = mockStore({})
      return store.dispatch(actions.getProfile(1)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(types.PROFILE_LOADED)
      })
    })

    it('get profile fails', () => {
      const store = mockStore({})
      return store.dispatch(actions.getProfile(0)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(types.PROFILE_ERROR)
      })
    })
  })

  describe('delete profile video dispatch correctly', () => {
    const closeModal = jest.fn(() => 6)
    const stopLoading = jest.fn(() => 6)
    it("delete video succeeds", () => {
      const expectedActionOne = {
        type: types.PROFILE_DELETE_VIDEO,
        payload: 1
      }
      const store = mockStore({})
      return store.dispatch(actions.deleteVideo(1, closeModal, stopLoading)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it("delete video fails", () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteVideo(0, closeModal, stopLoading)).then(() => {
        expect(store.getActions()[0].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it("No video id provided", () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteVideo("", closeModal, stopLoading)).then(() => {
        expect(store.getActions()[0].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[0].payload.msg).toEqual("No video id provided")
      })
    })

  })

  describe('change profile picture dispatches correctly', () => {
    const expectedActionOne = {
      type: types.PROFILE_COMPONENT_LOADING
    }
    const expectedActionTwo = {
      type: types.PROFILE_PIC_EDIT,
      payload: "https://thinkslice-project.s3.amazonaws.com/user-images/"
    }
    const expectedActionThree = {
      type: types.PROFILE_COMPONENT_LOADED
    }

    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });

    const file = new File([""], 'darthvader.png');
    Object.defineProperty(file, 'size', { value: 1000 })

    const closeModal = jest.fn()
    it('profile picture changed successfully', () => {
      const store = mockStore({})
      window.localStorage.setItem('user', 1)
      return store.dispatch(actions.changePicture(file, closeModal)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1]).toEqual(expectedActionTwo)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[3]).toEqual(expectedActionThree)
      })
    })

    it('profile picture changed failure dispatches error actions', () => {
      const store = mockStore({})
      window.localStorage.setItem('user', 0)
      return store.dispatch(actions.changePicture(file, closeModal)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2]).toEqual(expectedActionThree)
      })
    })

    it('profile picture size limited exceeded dispatches error actions', () => {
      const bigFile = new File([""], 'beeg.png');
      Object.defineProperty(bigFile, 'size', { value: 500000 })
      const store = mockStore({})
      window.localStorage.setItem('user', 1)
      return store.dispatch(actions.changePicture(bigFile, closeModal)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2]).toEqual(expectedActionThree)
      })


    })

    it('empty file selected dispatches error actions', () => {
      const store = mockStore({})
      window.localStorage.setItem('user', 1)
      return store.dispatch(actions.changePicture(undefined, closeModal)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[1].payload.msg).toEqual("There is no image selected")
        expect(store.getActions()[2]).toEqual(expectedActionThree)
      })
    })
  })

  describe('update profile actions dispatches correctly', () => {
    const expectedActionOne = {
      type: types.PROFILE_LOADING
    }
    const expectedActionTwo = {
      type: 'PROFILE_UPDATED',
      payload: {
        basic: {
          id: 27,
          profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/barrett_l7rngxa.jpg',
          username: 'gyro',
          user_bio: 'Hi, welcome to my profile!',
          is_tutor: true,
          is_student: true,
          user: 28,
          video: []
        },
        detailed: {
          tutor_whatsapp: null,
          tutor_telegram: null,
          aggregate_star: 4,
          location: 'North',
          duration_classes: [
            2,
            3
          ],
          subjects: [
            "Math",
            "Cooking"
          ],
          total_tutor_reviews: 0,
          qualifications: 'Primary school tutor'
        }
      }
    }

    it('successful update dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.updateProfile((1), {
        basic: [],
        detailed: []
      })).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1]).toEqual(expectedActionTwo)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('failed update dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.updateProfile((0), {
        basic: [],
        detailed: []
      })).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActionOne)
        expect(store.getActions()[1].type).toEqual(types.PROFILE_UPDATE_ERROR)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })
  })

  describe('delete profile actions dispatches correctly', () => {
    it('successful update dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteProfile(1)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.PROFILE_DELETED)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('failed update dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteProfile(0)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.PROFILE_ERROR)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
      })
    })
  })

  describe('get reviews actions dispatch correctly', () => {
    it('successful get review dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.getReviews(1)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_LOADING)
        expect(store.getActions()[1].type).toEqual(types.REVIEWS_LOADED)
      })
    })

    it('failed get review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.getReviews(0)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_LOADING)
        expect(store.getActions()[1].type).toEqual(types.REVIEWS_ERROR)
      })
    })
  })

  describe('create reviews actions dispatch correctly', () => {
    const closeModal = jest.fn()
    const clearForm = jest.fn()
    it('successful create review dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.createReviews({
        review_title: "hello",
        review_subject: ["Math"],
        review_essay: "hello",
        star_rating: 3,
        tutorId: 1
      }, closeModal, clearForm)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_LOADING)
        expect(store.getActions()[1].type).toEqual(types.CREATE_REVIEW)
        expect(store.getActions()[2].type).toEqual(componentTypes.SET_ALERT)
      })
    })

    it('failed create review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.createReviews({
        review_title: "hello",
        review_subject: ["Math"],
        review_essay: "hello",
        star_rating: 3,
        tutorId: 0
      }, closeModal, clearForm)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2].type).toEqual(types.STOP_REVIEW_LOADING)
      })
    })

    it('empty fields create review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.createReviews({
        review_title: "",
        review_subject: [],
        review_essay: "",
        star_rating: 0,
        tutorId: 1
      }, closeModal, clearForm)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[1].payload.msg).toEqual("Please give a star rating.")
        expect(store.getActions()[2].type).toEqual(types.STOP_REVIEW_LOADING)
      })

    })
  })

  describe('edit reviews actions dispatch correctly', () => {
    const closeModal = jest.fn()
    it('successful edit review dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editReviews({
        review_title: "hello",
        review_subject: ["Math"],
        review_essay: "hello",
        star_rating: 3,
        reviewId: 1
      }, closeModal)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_POST_LOADING)
        expect(store.getActions()[1].type).toEqual(types.EDIT_REVIEW)
      })
    })

    it('failed edit review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editReviews({
        review_title: "hello",
        review_essay: "hello",
        star_rating: 3,
        reviewId: 0
      }, closeModal)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_POST_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2].type).toEqual(types.STOP_REVIEW_POST_LOADING)
      })
    })

    it('empty fields edit review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.editReviews({
        review_title: "",
        review_subject: [],
        review_essay: "",
        star_rating: 0,
        reviewId: 0
      }, closeModal)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_POST_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[1].payload.msg).toEqual("Please give a star rating.")
        expect(store.getActions()[2].type).toEqual(types.STOP_REVIEW_POST_LOADING)
      })
    })
  })

  describe('delete reviews actions dispatch correctly', () => {
    const closeModal = jest.fn()
    it('successful delete review dispatch correct actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteReviews(1, closeModal)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_POST_LOADING)
        expect(store.getActions()[1].type).toEqual(types.DELETE_REVIEW)
      })
    })

    it('failed delete review dispatch error actions', () => {
      const store = mockStore({})
      return store.dispatch(actions.deleteReviews(0, closeModal)).then(() => {
        expect(store.getActions()[0].type).toEqual(types.SET_REVIEW_POST_LOADING)
        expect(store.getActions()[1].type).toEqual(componentTypes.SET_ALERT)
        expect(store.getActions()[2].type).toEqual(types.STOP_REVIEW_POST_LOADING)
      })
    })
  })
})

describe('profile reducers should work', () => {
  it('PROFILE_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_LOADING,
      })
    ).toEqual({
      ...initialReducerState,
      profileLoading: true,
    })
  })

  it('PROFILE_LOADED case should work', () => {
    expect(
      profile({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [],
      }, {
        type: types.PROFILE_LOADED,
        payload: {
          basic: {
            id: 3,
            profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
            username: "Applesauce",
            user_bio: "Hi, welcome to my profile!",
            is_tutor: true,
            is_student: false,
            user: 3,
            video: []
          },
          detailed: {
            tutor_whatsapp: 12345678,
            tutor_telegram: "@jimijam",
            aggregate_star: null,
            location: "South",
            duration_classes: [
              5,
              8
            ],
            subjects: [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            total_tutor_reviews: 0,
            qualifications: "P6 tutor"
          }
        }
      })
    ).toEqual({
      profile: {
        basic: {
          id: 3,
          profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
          username: "Applesauce",
          user_bio: "Hi, welcome to my profile!",
          is_tutor: true,
          is_student: false,
          user: 3,
          video: []
        },
        detailed: {
          tutor_whatsapp: 12345678,
          tutor_telegram: "@jimijam",
          aggregate_star: null,
          location: "South",
          duration_classes: [
            5,
            8
          ],
          subjects: [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          total_tutor_reviews: 0,
          qualifications: "P6 tutor"
        }
      },
      profileLoading: false,
      profileComponentLoading: false,
      reviewLoading: true,
      reviewPostLoading: false,
      detailedMode: false,
      editMode: false,
      reviewsGiven: [],
      reviewsReceived: [],
    })
  })

  it('PROFILE_COMPONENT_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_COMPONENT_LOADING,
      })
    ).toEqual({
      ...initialReducerState,
      profileComponentLoading: true,
    })
  })

  it('PROFILE_COMPONENT_LOADED case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_COMPONENT_LOADED,
      })
    ).toEqual({
      ...initialReducerState,
      profileComponentLoading: false,
    })
  })

  it('PROFILE_DELETE_VIDEO case should work', () => {
    expect(
      profile({
        profile: {
          basic: {
            id: 3,
            profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
            username: "Applesauce",
            user_bio: "Hi, welcome to my profile!",
            is_tutor: true,
            is_student: false,
            user: 3,
            video: [{
              "id": 1,
              "video_title": "Milestone 1 Video (Snippet)",
              "video_description": "Testing upload function",
              "subject": "Science",
              "views": 30,
              "likes": 0,
              "num_of_comments": 4,
              "asset_id": "rTlMQEuMQAUV2VnTUc202QL56FPqQOgmXTu9348BNEWg",
              "playback_id": "yuV6wIzNXSnX7eZL8uyRTaJjxWPU9fLBV6I7LTKfh02k",
              "duration": 0.0,
              "policy": "public",
              "created_at": 1622792907,
              "creator_profile": 2
            }]
          },
          detailed: {
            tutor_whatsapp: 12345678,
            tutor_telegram: "@jimijam",
            aggregate_star: null,
            location: "South",
            duration_classes: [
              5,
              8
            ],
            subjects: [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            total_tutor_reviews: 0,
            qualifications: "P6 tutor"
          }
        },
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [],
      }, {
        type: types.PROFILE_DELETE_VIDEO,
        payload: 1
      })
    ).toEqual({
      profile: {
        basic: {
          id: 3,
          profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
          username: "Applesauce",
          user_bio: "Hi, welcome to my profile!",
          is_tutor: true,
          is_student: false,
          user: 3,
          video: []
        },
        detailed: {
          tutor_whatsapp: 12345678,
          tutor_telegram: "@jimijam",
          aggregate_star: null,
          location: "South",
          duration_classes: [
            5,
            8
          ],
          subjects: [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          total_tutor_reviews: 0,
          qualifications: "P6 tutor"
        }
      },
      profileLoading: false,
      profileComponentLoading: false,
      reviewLoading: true,
      reviewPostLoading: false,
      detailedMode: false,
      editMode: false,
      reviewsGiven: [],
      reviewsReceived: [],
    })
  })

  it('PROFILE_DETAILED_VIEW case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_DETAILED_VIEW,
        payload: true
      })
    ).toEqual({
      ...initialReducerState,
      detailedMode: true,
    })
  })

  it('PROFILE_EDIT_MODE case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_EDIT_MODE,
        payload: true
      })
    ).toEqual({
      ...initialReducerState,
      editMode: true,
    })
  })

  it('PROFILE_PIC_EDIT case should work', () => {
    expect(
      profile({
        profile: {
          basic: {
            id: 3,
            profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
            username: "Applesauce",
            user_bio: "Hi, welcome to my profile!",
            is_tutor: true,
            is_student: false,
            user: 3,
            video: []
          },
          detailed: {
            tutor_whatsapp: 12345678,
            tutor_telegram: "@jimijam",
            aggregate_star: null,
            location: "South",
            duration_classes: [
              5,
              8
            ],
            subjects: [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            total_tutor_reviews: 0,
            qualifications: "P6 tutor"
          }
        },
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [],
      }, {
        type: types.PROFILE_PIC_EDIT,
        payload: "fake video"
      })
    ).toEqual({
      profile: {
        basic: {
          id: 3,
          profile_pic: "fake video",
          username: "Applesauce",
          user_bio: "Hi, welcome to my profile!",
          is_tutor: true,
          is_student: false,
          user: 3,
          video: []
        },
        detailed: {
          tutor_whatsapp: 12345678,
          tutor_telegram: "@jimijam",
          aggregate_star: null,
          location: "South",
          duration_classes: [
            5,
            8
          ],
          subjects: [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          total_tutor_reviews: 0,
          qualifications: "P6 tutor"
        }
      },
      profileLoading: false,
      profileComponentLoading: false,
      reviewLoading: true,
      reviewPostLoading: false,
      detailedMode: false,
      editMode: false,
      reviewsGiven: [],
      reviewsReceived: [],
    })
  })

  it('PROFILE_UPDATED case should work', () => {
    expect(
      profile({
        profile: {
          basic: {
            id: 3,
            profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
            username: "Applesauce",
            user_bio: "Hi, welcome to my profile!",
            is_tutor: true,
            is_student: false,
            user: 3,
            video: []
          },
          detailed: {
            tutor_whatsapp: 12345678,
            tutor_telegram: "@jimijam",
            aggregate_star: null,
            location: "South",
            duration_classes: [
              5,
              8
            ],
            subjects: [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            total_tutor_reviews: 0,
            qualifications: "P6 tutor"
          }
        },
        profileLoading: true,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [],
      }, {
        type: types.PROFILE_UPDATED,
        payload: {
          basic: {
            id: 3,
            profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
            username: "New name",
            user_bio: "Hi, welcome to my profile!",
            is_tutor: true,
            is_student: false,
            user: 3,
            video: []
          },
          detailed: {
            tutor_whatsapp: 12345678,
            tutor_telegram: "@jimijam",
            aggregate_star: null,
            location: "South",
            duration_classes: [
              5,
              8
            ],
            subjects: [
              "Math",
              "Cooking",
              "Biology",
              "Business",
              "Computing"
            ],
            total_tutor_reviews: 0,
            qualifications: "P6 tutor"
          }
        }
      })
    ).toEqual({
      profile: {
        basic: {
          id: 3,
          profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
          username: "New name",
          user_bio: "Hi, welcome to my profile!",
          is_tutor: true,
          is_student: false,
          user: 3,
          video: []
        },
        detailed: {
          tutor_whatsapp: 12345678,
          tutor_telegram: "@jimijam",
          aggregate_star: null,
          location: "South",
          duration_classes: [
            5,
            8
          ],
          subjects: [
            "Math",
            "Cooking",
            "Biology",
            "Business",
            "Computing"
          ],
          total_tutor_reviews: 0,
          qualifications: "P6 tutor"
        }
      },
      profileLoading: false,
      profileComponentLoading: false,
      reviewLoading: true,
      reviewPostLoading: false,
      detailedMode: false,
      editMode: false,
      reviewsGiven: [],
      reviewsReceived: [],
    })
  })

  it('REVIEWS_LOADED case should work', () => {
    expect(
      profile({
        profile: null,
        profileLoading: true,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [],
      }, {
        type: types.REVIEWS_LOADED,
        payload: {
          reviewsGiven: [{
            "id": 52,
            "creator_details": {
              "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=QxXXShDOIs4xmiK8HNUIXCpshVk%3D&Expires=1623560876",
              "username": "Pearsauce",
              "user": 1
            },
            "star_rating": 5.0,
            "review_title": "Amazing!",
            "review_essay": "You won't believe what this guy would do for $5!",
            "date_review": "2021-06-07",
            "date_review_edited": "2021-06-07",
            "edited": false,
            "tutor_profile": 2,
            "student_profile": 1
          }],
          reviewsReceived: [{
            "id": 53,
            "creator_details": {
              "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
              "username": "Applesauce",
              "user": 3
            },
            "star_rating": 4.0,
            "review_title": "Amazing!",
            "review_essay": "You won't believe what this guy would do for $5!",
            "date_review": "2021-06-07",
            "date_review_edited": "2021-06-07",
            "edited": true,
            "tutor_profile": 2,
            "student_profile": 3
          }]
        }
      })
    ).toEqual({
      profile: null,
      profileLoading: true,
      profileComponentLoading: false,
      reviewLoading: false,
      reviewPostLoading: false,
      detailedMode: false,
      editMode: false,
      reviewsGiven: [{
        "id": 52,
        "creator_details": {
          "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=QxXXShDOIs4xmiK8HNUIXCpshVk%3D&Expires=1623560876",
          "username": "Pearsauce",
          "user": 1
        },
        "star_rating": 5.0,
        "review_title": "Amazing!",
        "review_essay": "You won't believe what this guy would do for $5!",
        "date_review": "2021-06-07",
        "date_review_edited": "2021-06-07",
        "edited": false,
        "tutor_profile": 2,
        "student_profile": 1
      }],
      reviewsReceived: [{
        "id": 53,
        "creator_details": {
          "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
          "username": "Applesauce",
          "user": 3
        },
        "star_rating": 4.0,
        "review_title": "Amazing!",
        "review_essay": "You won't believe what this guy would do for $5!",
        "date_review": "2021-06-07",
        "date_review_edited": "2021-06-07",
        "edited": true,
        "tutor_profile": 2,
        "student_profile": 3
      }]
    })
  })

  it('SET_REVIEW_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.SET_REVIEW_LOADING,
      }))
      .toEqual({
        ...initialReducerState,
        reviewLoading: true,
      })
  })

  it('SET_REVIEW_POST_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.SET_REVIEW_POST_LOADING,
      }))
      .toEqual({
        ...initialReducerState,
        reviewPostLoading: true,
      })
  })

  it('STOP_REVIEW_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.STOP_REVIEW_LOADING,
      }))
      .toEqual({
        ...initialReducerState,
        reviewLoading: false,
      })
  })

  it('STOP_REVIEW_POST_LOADING case should work', () => {
    expect(
      profile(undefined, {
        type: types.STOP_REVIEW_POST_LOADING,
      }))
      .toEqual({
        ...initialReducerState,
        reviewPostLoading: false,
      })
  })

  it('PROFILE_UPDATE_ERROR case should work', () => {
    expect(
      profile(undefined, {
        type: types.PROFILE_UPDATE_ERROR,
      }))
      .toEqual({
        ...initialReducerState,
        profileLoading: false,
      })
  })

  it('CREATE_REVIEW case should work', () => {
    expect(
      profile({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: true,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: []
      }, {
        type: types.CREATE_REVIEW,
        payload: {
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        },
      }))
      .toEqual({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: false,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }]
      })
  })

  it('EDIT_REVIEW case should work', () => {
    expect(
      profile({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: false,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }],
        reviewsReceived: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }]
      }, {
        type: types.EDIT_REVIEW,
        payload: {
          id: 53,
          updatedData: {
            "id": 53,
            "star_rating": 4.0,
            "review_title": "Bad!",
            "review_essay": "Terrible!",
            "date_review": "2021-06-07",
            "date_review_edited": "2021-06-07",
            "edited": true,
            "tutor_profile": 2,
            "student_profile": 3
          }
        }
      }))
      .toEqual({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: false,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Bad!",
          "review_essay": "Terrible!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }],
        reviewsReceived: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Bad!",
          "review_essay": "Terrible!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }]
      })
  })

  it('DELETE_REVIEW case should work', () => {
    expect(
      profile({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: false,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }],
        reviewsReceived: [{
          "id": 53,
          "creator_details": {
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GZHI1BfgS7c1RZiErYdiIQ3ouZ4%3D&Expires=1623560877",
            "username": "Applesauce",
            "user": 3
          },
          "star_rating": 4.0,
          "review_title": "Amazing!",
          "review_essay": "You won't believe what this guy would do for $5!",
          "date_review": "2021-06-07",
          "date_review_edited": "2021-06-07",
          "edited": true,
          "tutor_profile": 2,
          "student_profile": 3
        }]
      }, {
        type: types.DELETE_REVIEW,
        payload: 53,
      }))
      .toEqual({
        profile: null,
        profileLoading: false,
        profileComponentLoading: false,
        reviewLoading: false,
        reviewPostLoading: false,
        detailedMode: false,
        editMode: false,
        reviewsGiven: [],
        reviewsReceived: []
      })
  })
})