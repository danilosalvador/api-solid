import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let repository: InMemoryGymsRepository
let service: FetchNearbyGymsService

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryGymsRepository()
        service = new FetchNearbyGymsService(repository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await repository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        await repository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -27.0610928,
            longitude: -49.5229501,
        })

        const { gyms } = await service.execute({
            userLatitude: -27.2092052,
            userLongitude: -49.6401091,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
    })
})
