import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { ValidateCheckInService } from './validate-check-in'
import { NotFoundError } from '@/errors/not-found-error'

let repository: InMemoryCheckInsRepository
let service: ValidateCheckInService

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new ValidateCheckInService(repository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const { checkIn } = await service.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(repository.checkIns[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(
            async () =>
                await service.execute({
                    checkInId: 'inexistent-check-in-id',
                })
        ).rejects.toBeInstanceOf(NotFoundError)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(
            async () =>
                await service.execute({
                    checkInId: createdCheckIn.id,
                })
        ).rejects.toBeInstanceOf(Error)
    })
})
