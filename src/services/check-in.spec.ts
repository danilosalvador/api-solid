import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

let repository: InMemoryCheckInsRepository
let service: CheckInService

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(1986, 10, 20, 19, 45, 0))

        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        })

        await expect(
            async () =>
                await service.execute({
                    userId: 'user-id',
                    gymId: 'gym-id',
                })
        ).rejects.toBeInstanceOf(Error)
    })

    it('should not be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(1986, 4, 15, 8, 30, 0))

        await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        })

        vi.setSystemTime(new Date(1986, 10, 20, 19, 45, 0))

        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
