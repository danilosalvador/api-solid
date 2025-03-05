import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'

export async function validate(
    request: FastifyRequest,
    response: FastifyReply
) {
    const validateParamsSchema = z.object({
        checkInId: z.string().uuid(),
    })

    const { checkInId } = validateParamsSchema.parse(request.params)

    const service = makeValidateCheckInService()

    const { checkIn } = await service.execute({
        checkInId,
    })

    return response.status(204).send()
}
