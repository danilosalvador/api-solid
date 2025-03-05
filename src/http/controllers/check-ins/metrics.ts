import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserMetrics } from '@/services/factories/make-get-user-metrics-service'

export async function metrics(request: FastifyRequest, response: FastifyReply) {
    const service = makeGetUserMetrics()

    const { checkInsCount } = await service.execute({
        userId: request.user.sub,
    })

    return response.status(200).send({ checkInsCount })
}
