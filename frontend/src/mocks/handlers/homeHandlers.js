// src/mocks/handlers.js
import { rest } from 'msw'
import { DOMAINS, ENDPOINTS } from "../../store/endpoints"
export const homeHandlers = [
  //GET load homepage 
  rest.get('http://localhost' + DOMAINS.VIDEO + ENDPOINTS.LIST_VIDEOS, (req, res, ctx) => {
    const page = req.url.searchParams.get('n')
    if (page === "1") {
      return res(
        ctx.status(200),
        ctx.json([{
          "id": 2,
          "video_title": "Learn physics",
          "video_description": "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
          "subject": "Physics",
          "views": 404,
          "likes": 1,
          "num_of_comments": 6,
          "asset_id": "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
          "playback_id": "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
          "duration": 0,
          "policy": "public",
          "created_at": 1622812186,
          "creator_profile": {
            "id": 25,
            "profile_pic": "https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GO4eGWFHtMlaiEBVVlbvvivVgbg%3D&Expires=1623653343",
            "username": "jimijam",
            "user_bio": "Hi, welcome to my profile! Cool profilez",
            "is_tutor": true,
            "is_student": true,
            "tutor_whatsapp": 12345678,
            "tutor_telegram": "@jimijam",
            "aggregate_star": null,
            "location": "east",
            "duration_classes": [
              3,
              8
            ],
            "subjects": [
              "Biology",
              "Math",
              "Sports",
              "Visual Arts"
            ],
            "total_tutor_reviews": 0,
            "qualifications": "P6 tutor",
            "user": 26
          }
        }]
        )
      )
    } else if (page === "2") {
      return res(
        ctx.status(200),
        ctx.json([])
      )
    } else {
      //GET load homepage (error)
      return res(
        ctx.status(400),
      )
    }
  }),
  //GET load watch page
  rest.get('http://localhost' + DOMAINS.VIDEO + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        video_title: 'Learn physics',
        video_description: 'Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!',
        subject: 'Physics',
        views: 405,
        likes: 1,
        num_of_comments: 6,
        asset_id: 'HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ',
        playback_id: 'kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM',
        duration: 0,
        policy: 'public',
        created_at: 1622812186,
        creator_profile: {
          id: 1,
          profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GO4eGWFHtMlaiEBVVlbvvivVgbg%3D&Expires=1623653343',
          username: 'jimijam',
          user_bio: 'Hi, welcome to my profile! Cool profilez',
          is_tutor: true,
          is_student: true,
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
          qualifications: 'P6 tutor',
          user: 1
        }
      })
    )
  }),
  //GET load watch page (error)
  rest.get('http://localhost' + DOMAINS.VIDEO + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400)
    )
  }),
  //GET comments
  rest.get('http://localhost' + DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{
        id: 56,
        username: 'jimijam',
        profilePic: 'user-images/427ed110edb63dbe449c5a8aaefa4ca9_pe9mMiy.jpg',
        userId: 26,
        comment_text: 'Hello world',
        date_comment: '2021-06-13',
        date_comment_edited: '2021-06-13',
        edited: false,
        has_replies: false,
        commented_video: 2,
        user_commenting: 25,
        parent_comment: null,
        replies: []
      }])
    )
  }),
  //GET comments(error)
  rest.get('http://localhost' + DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //POST add comments
  rest.post('http://localhost' + DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": 51,
        "username": "gyro",
        "profilePic": "user-images/barrett_l7rngxa.jpg",
        "userId": 28,
        "comment_text": "General Kenobi",
        "date_comment": "2021-06-13",
        "date_comment_edited": "2021-06-13",
        "edited": false,
        "has_replies": false,
        "commented_video": 1,
        "user_commenting": 27,
        "parent_comment": null
      })
    )
  }),
  //POST add comments(error)
  rest.post('http://localhost' + DOMAINS.VIDEO + ENDPOINTS.GET_ADD_COMMENT + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //PATCH edit comments
  rest.patch('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": 51,
        "username": "gyro",
        "profilePic": "user-images/barrett_l7rngxa.jpg",
        "userId": 28,
        "comment_text": "General Kenobi",
        "date_comment": "2021-06-13",
        "date_comment_edited": "2021-06-13",
        "edited": false,
        "has_replies": false,
        "commented_video": 1,
        "user_commenting": 27,
        "parent_comment": null
      })
    )
  }),
  //PATCH edit comments(error)
  rest.patch('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //DELETE delete comments
  rest.delete('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/1', (req, res, ctx) => {
    return res(
      ctx.status(204),
    )
  }),
  //DELETE delete comments(error)
  rest.delete('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.EDIT_DELETE_COMMENT + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //GET get replies
  rest.get('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": 49,
        "username": "Pearsauce",
        "comment_text": "@Hamburger This video is terrible, I can't understand him at all",
        "date_comment": "2021-06-10",
      })
    )
  }),
  //GET get replies(error)
  rest.get('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400)
    )
  }),
  //POST create replies
  rest.post('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    )
  }),
  //POST create replies(error)
  rest.post('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400)
    )
  }),
  //POST create upload URL
  rest.post('http://localhost/api/videos/assets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        url: 1
      })
    )
  })
]