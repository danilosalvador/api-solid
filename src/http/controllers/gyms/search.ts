import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service'

export async function search(request: FastifyRequest, response: FastifyReply) {
    const searchQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const { query, page } = searchQuerySchema.parse(request.query)

    const service = makeSearchGymsService()

    const { gyms } = await service.execute({
        query,
        page,
    })

    return response.status(200).send({ gyms })
}
