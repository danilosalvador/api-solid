import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeNearbyGymsService } from '@/services/factories/make-nearby-gyms-service'

export async function nearby(request: FastifyRequest, response: FastifyReply) {
    const nearbyQuerySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { latitude, longitude } = nearbyQuerySchema.parse(request.query)

    const service = makeNearbyGymsService()

    const { gyms } = await service.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return response.status(200).send({ gyms })
}
