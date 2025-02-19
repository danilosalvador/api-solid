import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym'

let repository: InMemoryGymsRepository
let service: CreateGymService

describe('Gym Use Case', () => {
    beforeEach(() => {
        repository = new InMemoryGymsRepository()
        service = new CreateGymService(repository)
    })

    it('should be able to register', async () => {
        const { gym } = await service.execute({
            title: 'Academia JS',
            description: null,
            phone: null,
            latitude: -23.4099604,
            longitude: -47.3804479,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})
