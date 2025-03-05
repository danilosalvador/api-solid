import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCheckInService } from '@/services/factories/make-check-in-service'

export async function create(request: FastifyRequest, response: FastifyReply) {
    const createParamsSchema = z.object({
        gymId: z.string().uuid(),
    })
    const createBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { gymId } = createParamsSchema.parse(request.params)
    const { latitude, longitude } = createBodySchema.parse(request.body)

    const service = makeCheckInService()

    await service.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return response.status(201).send()
}
