import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { UserRegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export async function register(
    request: FastifyRequest,
    response: FastifyReply
) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const userRegisterService = new UserRegisterService(usersRepository)

        await userRegisterService.execute({ name, email, password })
    } catch (error) {
        return response.status(409).send()
    }

    return response.status(201).send()
}
