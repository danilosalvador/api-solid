import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history'

let repository: InMemoryCheckInsRepository
let service: FetchUserCheckInsHistoryService

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new FetchUserCheckInsHistoryService(repository)
    })

    it('should be able to fetch check-in history', async () => {
        await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        await repository.create({
            gym_id: 'gym-02',
            user_id: 'user-01',
        })

        const { checkIns } = await service.execute({
            userId: 'user-01',
            page: 1,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' }),
        ])
    })

    it('should be able to fetch paginated check-in history', async () => {
        for (let i = 1; i <= 22; i++) {
            await repository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01',
            })
        }

        const { checkIns } = await service.execute({
            userId: 'user-01',
            page: 2,
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ])
    })
})
