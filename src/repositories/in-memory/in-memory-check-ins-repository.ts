import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma } from '@prisma/client'

export class InMemoryCheckInsRepository {
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
}
