import { LateCheckInValidationError } from '@/errors/late-check-in-validation-error'
import { NotFoundError } from '@/errors/not-found-error'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '@prisma/client'
import dayjs from 'dayjs'

interface ValidateCheckInServiceRequest {
    checkInId: string
}

interface ValidateCheckInServiceResponse {
    checkIn: CheckIn
}

export class ValidateCheckInService {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        checkInId,
    }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new NotFoundError()
        }

        checkIn.validated_at = new Date()

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        )

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError()
        }

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn,
        }
    }
}
