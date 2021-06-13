import { rest } from 'msw'
import { DOMAINS, ENDPOINTS } from "../../store/endpoints"
export const profileHandlers = [
  //GET user basic profile
  rest.get('http://localhost' + DOMAINS.PROFILE + "/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        // data: {
        id: 25,
        is_student: true,
        is_tutor: true,
        profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/",
        user: 26,
        user_bio: "Hi, welcome to my profile! Cool profile.",
        username: "jimijam",
        video: [
          {
            id: 2,
            video_title: "Learn physics",
            video_description: "Quantum physics is a popular phrase used nowadays, but what is it about? Learn the  basics of quantum physics today!",
            subject: "Physics",
            views: 404,
            likes: 0,
            num_of_comments: 4,
            asset_id: "HcDHzBMgnn39HOx02Mv9qcO1HONggk6lJwxVwjHQwjhQ",
            playback_id: "kGCiZbuXRxBbe6yIUQFIWaG5EplDTyInrca01DX1GrvM",
            duration: 0.0,
            policy: "public",
            created_at: 1622812186,
            creator_profile: 25
          }
        ]

      })
    )
  }),
  //GET user basic profile error
  rest.get('http://localhost' + DOMAINS.PROFILE + "/0", (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //GET user detailed profile
  rest.get('http://localhost' + DOMAINS.PROFILE + ENDPOINTS.PROFILE_DETAILS + "/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
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
      })
    )
  }),
  //GET user detailed profile error
  rest.get('http://localhost' + DOMAINS.PROFILE + ENDPOINTS.PROFILE_DETAILS + "/0", (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //DELETE user video 
  rest.delete('http://localhost' + DOMAINS.VIDEO + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(204),
    )
  }),
  //DELETE user video error
  rest.delete('http://localhost' + DOMAINS.VIDEO + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(400),
    )
  }),
  //POST change user profile picture
  rest.post('http://localhost' + DOMAINS.PROFILE + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/"
      })
    )
  }),
  //POST change user profile picture (error)
  rest.post('http://localhost' + DOMAINS.PROFILE + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400),
    )
  }),
  //PATCH update user profile basic
  rest.patch('http://localhost' + DOMAINS.PROFILE + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 27,
        profile_pic: "https://thinkslice-project.s3.amazonaws.com/user-images/barrett_l7rngxa.jpg",
        username: "gyro",
        user_bio: "Hi, welcome to my profile!",
        is_tutor: true,
        is_student: true,
        user: 28,
        video: []
      })
    )
  }),
  //PATCH update user profile basic (error)
  rest.patch('http://localhost' + DOMAINS.PROFILE + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400),
    )
  }),
  //PATCH update user profile detailed
  rest.patch('http://localhost' + DOMAINS.PROFILE + ENDPOINTS.PROFILE_DETAILS + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        tutor_whatsapp: null,
        tutor_telegram: null,
        aggregate_star: 4.0,
        location: "North",
        duration_classes: [
          2,
          3
        ],
        subjects: [
          "Math",
          "Cooking"
        ],
        total_tutor_reviews: 0,
        qualifications: "Primary school tutor"
      })
    )
  }),
  //PATCH update user profile detailed (error)
  rest.patch('http://localhost' + DOMAINS.PROFILE + ENDPOINTS.PROFILE_DETAILS + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400)
    )
  }),
  //DELETE delete user profile
  rest.delete('http://localhost' + DOMAINS.PROFILE + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 204 status code
      ctx.status(204),
    )
  }),
  //DELETE delete user profile (error)
  rest.delete('http://localhost' + DOMAINS.PROFILE + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400),
    )
  }),
  //GET user student review
  rest.get('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.STUDENT + "/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        [{
          id: 49,
          creator_details: {
            profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GaQiFtfz9YMj%2Bor97HYK3VIL9vo%3D&Expires=1623606778',
            username: 'tim',
            user: 31
          },
          star_rating: 5,
          review_title: 'Amazing teacher, truly the best',
          review_essay: 'Great mentor! Super',
          date_review: '2021-06-06',
          date_review_edited: '2021-06-13',
          edited: true,
          tutor_profile: 30,
          student_profile: 25
        }]
      )
    )
  }),
  //GET user student review (error)
  rest.get('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.STUDENT + "/0", (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //GET user tutor review
  rest.get('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.TUTOR + "/1", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(
        []
      )
    )
  }),
  //GET user tutor review (error)
  rest.get('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.TUTOR + "/0", (req, res, ctx) => {
    return res(
      ctx.status(400),
    )
  }),
  //POST create user review
  rest.post('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.CREATE_REVIEW + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 49,
        creator_details: {
          profile_pic: 'https://thinkslice-project.s3.amazonaws.com/user-images/download.jpg?AWSAccessKeyId=AKIA3EDWA4JQ57MY2PM5&Signature=GaQiFtfz9YMj%2Bor97HYK3VIL9vo%3D&Expires=1623606778',
          username: 'tim',
          user: 31
        },
        star_rating: 5,
        review_title: 'Amazing teacher, truly the best',
        review_essay: 'Great mentor! Super',
        date_review: '2021-06-06',
        date_review_edited: '2021-06-13',
        edited: true,
        tutor_profile: 30,
        student_profile: 25

      })
    )
  }),
  //POST create user review (error)
  rest.post('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.CREATE_REVIEW + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(400),
    )
  }),
  //PATCH edit user review
  rest.patch('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 52,
        star_rating: 5.0,
        review_title: "Amazing!",
        review_essay: "You won't believe what this guy would do for $5!",
        date_review: "2021-06-07",
        date_review_edited: "2021-06-07",
        edited: false,
        tutor_profile: 2,
        student_profile: 1
      })
    )
  }),
  //PATCH edit user review (error)
  rest.patch('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400)
    )
  }),
  //DELETE delete user review
  rest.delete('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + "/" + 1, (req, res, ctx) => {
    return res(
      // Respond with a 204 status code
      ctx.status(204),
    )
  }),
  //DELETE delete user review (error)
  rest.delete('http://localhost/' + DOMAINS.REVIEWS + ENDPOINTS.EDIT_DELETE_REVIEW + "/" + 0, (req, res, ctx) => {
    return res(
      // Respond with a 400 status code
      ctx.status(400),
    )
  }),
]


