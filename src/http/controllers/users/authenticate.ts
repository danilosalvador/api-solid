import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
    request: FastifyRequest,
    response: FastifyReply
) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const service = makeAuthenticateService()

        const { user } = await service.execute({
            email,
            password,
        })

        const { role, id: sub } = user

        const token = await response.jwtSign(
            {
                role,
            },
            {
                sign: {
                    sub,
                },
            }
        )

        const refreshToken = await response.jwtSign(
            {
                role,
            },
            {
                sign: {
                    sub,
                    expiresIn: '7d',
                },
            }
        )

        return response
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true, // Cookie será encriptografado pelo HTTPS
                sameSite: true, // Acessível apenas no mesmo domínio
                httpOnly: true, // Acessível apenas pelo backend da aplicação
            })
            .status(200)
            .send({ token })
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            return response.status(400).send({ message: error.message })
        }

        throw error
    }
}
