import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

let repository: InMemoryCheckInsRepository
let service: CheckInService

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
