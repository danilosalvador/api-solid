import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'

import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _, response) => {
    if (error instanceof ZodError) {
        return response.status(400).send({
            message: 'Validation error',
            details: error.format(),
        })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        // TODO: Send error to monitoring service (DataDog/NewRelic/Sentry)
    }

    return response.status(500).send({
        message: 'Internal server error',
    })
})
