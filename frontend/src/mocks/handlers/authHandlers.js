// src/mocks/handlers.js
import { rest } from 'msw'
import { DOMAINS, ENDPOINTS } from "../../store/endpoints"
export const authHandlers = [
  rest.get('http://localhost' + DOMAINS.AUTH + ENDPOINTS.LOAD_USER, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": 36,
        "username": "fakeacc",
        "email": "fakeacc@gmail.com"
      })
    )
  }),
  rest.post('http://localhost/api/auth/login', (req, res, ctx) => {
    // Persist user's authentication in the session
    if (req.body.username === "") {
      return res(
        ctx.status(400)
      )
    }

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        "user": {
          "id": 35,
          "username": "Kestrel",
          "email": "Kestrel@gmail.com"
        },
        "token": "600dde94af35008617b175734b16e97f30815f104e9ae0d1ce874221e333b62b"
      })
    )
  }),
  rest.post('http://localhost/api/auth/register', (req, res, ctx) => {
    // Persist user's authentication in the session
    if (req.body.username === "") {
      return res(
        ctx.status(400)
      )
    }

    return res(
      // Respond with a 200 status code
      ctx.status(200),
      ctx.json({
        "user": {
          "id": 35,
          "username": "Kestrel",
          "email": "Kestrel@gmail.com"
        },
        "token": "600dde94af35008617b175734b16e97f30815f104e9ae0d1ce874221e333b62b"
      })
    )
  }),
  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    )
  }),
]