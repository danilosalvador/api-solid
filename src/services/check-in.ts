import type { CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInServiceParams {
    userId: string
    gymId: string
}

interface CheckInServiceResponse {
    checkIn: CheckIn
}

export class CheckInService {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
        gymId,
    }: CheckInServiceParams): Promise<CheckInServiceResponse> {
        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId,
        })

        return {
            checkIn,
        }
    }
}
