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
          "created_at": 1622812186,
        }])
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
        "created_at": 1622812186,
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
        "id": 13,
        "username": "Pearsauce",
        "profilePic": "user-images/shrug_gumball_by_bornreprehensible-d7mr2jr.png",
        "userId": 1,
        "comment_text": "Physics is really, really cool!",
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
        "comment_text": "@Hamburger This video is terrible, I can't understand him at all",
        "date_comment": "2021-06-10",
      })
    )
  }),
  //POST create replies(error)
  rest.post('http://localhost' + DOMAINS.COMMENTS + ENDPOINTS.GET_ADD_REPLY + '/0', (req, res, ctx) => {
    return res(
      ctx.status(400)
    )
  }),
]