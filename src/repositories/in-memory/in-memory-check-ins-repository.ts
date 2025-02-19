import { randomUUID } from 'node:crypto'
import type { CheckIn, Prisma } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

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
        const startOfTheDay = dayjs(date).startOf('date') // YYYY-MM-DDT00:00:00
        const endOfTheDay = dayjs(date).endOf('date') // YYYY-MM-DD23:59:59

        const checkOnSameDate = this.checkIns.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate =
                checkInDate.isAfter(startOfTheDay) &&
                checkInDate.isBefore(endOfTheDay)

            return checkIn.user_id === userId && isOnSameDate
        })

        if (!checkOnSameDate) {
            return null
        }

        return checkOnSameDate
    }

    async findManyByUserId(userId: string, page: number) {
        return this.checkIns
            .filter(checkIn => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20)
    }

    async countByUserId(userId: string) {
        return this.checkIns.filter(checkIn => checkIn.user_id === userId)
            .length
    }
}
