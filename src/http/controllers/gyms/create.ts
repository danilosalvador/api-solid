import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGymService } from '@/services/factories/make-create-gym-service'

export async function create(request: FastifyRequest, response: FastifyReply) {
    const createBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { title, description, phone, latitude, longitude } =
        createBodySchema.parse(request.body)

    const service = makeCreateGymService()

    await service.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    })

    return response.status(201).send()
}
