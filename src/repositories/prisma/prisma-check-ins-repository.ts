import type { CheckIn, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        })
        return checkIn
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: { id: data.id },
            data: data,
        })
        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date') // YYYY-MM-DDT00:00:00
        const endOfTheDay = dayjs(date).endOf('date') // YYYY-MM-DD23:59:59

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(), // gte:maior ou igual
                    lte: endOfTheDay.toDate(), // lte:menor ou igual
                },
            },
        })

        return checkIn
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: { user_id: userId },
            take: 20,
            skip: (page - 1) * 20,
        })
        return checkIns
    }

    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: { user_id: userId },
        })
        return count
    }

    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: { id },
        })
        return checkIn
    }
}
