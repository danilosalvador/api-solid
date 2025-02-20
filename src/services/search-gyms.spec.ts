import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsService } from './search-gyms'

let repository: InMemoryGymsRepository
let service: SearchGymsService

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryGymsRepository()
        service = new SearchGymsService(repository)
    })

    it('should be able to search for gyms', async () => {
        await repository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        await repository.create({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        const { gyms } = await service.execute({
            query: 'JavaScript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    })

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await repository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -27.2092052,
                longitude: -49.6401091,
            })
        }

        const { gyms } = await service.execute({
            query: 'JavaScript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
    })
})
