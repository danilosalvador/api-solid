import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { ValidateCheckInService } from './validate-check-in'
import { NotFoundError } from '@/errors/not-found-error'

let repository: InMemoryCheckInsRepository
let service: ValidateCheckInService

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new ValidateCheckInService(repository)

        // vi.useFakeTimers()
    })

    afterEach(() => {
        // vi.useRealTimers()
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
        await expect(() =>
            service.execute({
                checkInId: 'inexistent-check-in-id',
            })
        ).rejects.toBeInstanceOf(NotFoundError)
    })
})
