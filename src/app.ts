import fastify from 'fastify'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

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
