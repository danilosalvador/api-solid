import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
    private checkIns: CheckIn[] = []

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn: CheckIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
        }

        this.checkIns.push(checkIn)

        return checkIn
    }

    async findByUserIdOnDate(
        userId: string,
        date: Date
    ): Promise<CheckIn | null> {
        const checkOnSameDate = this.checkIns.find(
            checkIn => checkIn.user_id === userId
        )

        if (!checkOnSameDate) {
            return null
        }

        return checkOnSameDate
    }
}
