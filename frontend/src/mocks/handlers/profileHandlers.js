import { rest } from 'msw'
import { DOMAINS, ENDPOINTS } from "../../store/endpoints"
export const profileHandlers = [
  rest.delete('http://localhost' + DOMAINS.VIDEO + "/" + 2, (req, res, ctx) => {
    // Persist user's authentication in the session
    return res(
      // Respond with a 200 status code
      ctx.status(204),
    )
  }),
]