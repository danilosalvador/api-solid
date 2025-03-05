import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history-service'

export async function history(request: FastifyRequest, response: FastifyReply) {
    const searchQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })

    const { page } = searchQuerySchema.parse(request.query)

    const service = makeFetchUserCheckInsHistoryService()

    const { checkIns } = await service.execute({
        userId: request.user.sub,
        page,
    })

    return response.status(200).send({ checkIns })
}
