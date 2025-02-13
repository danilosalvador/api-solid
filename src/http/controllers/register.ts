import type { FastifyReply, FastifyRequest } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

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
    const password_hash = await hash(password, 8)

    const emailExists = await prisma.user.findUnique({
        where: { email },
    })

    if (emailExists) {
        return response.status(409).send()
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash,
        },
    })

    return response.status(201).send()
}
