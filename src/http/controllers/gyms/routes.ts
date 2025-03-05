import type { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)
    // app.post('/users', register)
    // app.post('/sessions', authenticate)
    // /** Authenticated */
    // app.get('/me', { onRequest: [verifyJWT] }, profile)
}
