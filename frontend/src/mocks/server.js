// src/mocks/server.js
import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/authHandlers'
import { profileHandlers } from './handlers/profileHandlers'
// This configures a request mocking server with the given request handlers.
const combineHandlers = [...authHandlers, ...profileHandlers]

export const server = setupServer(...combineHandlers)