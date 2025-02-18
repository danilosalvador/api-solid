import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library.js'

let repositoryCheckIns: InMemoryCheckInsRepository
let repositoryGyms: InMemoryGymsRepository
let service: CheckInService

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        repositoryCheckIns = new InMemoryCheckInsRepository()
        repositoryGyms = new InMemoryGymsRepository()
        service = new CheckInService(repositoryCheckIns, repositoryGyms)

        repositoryGyms.gyms.push({
            id: 'gym-id',
            title: 'Academia',
            description: '',
            phone: '',
            latitude: new Decimal(-23.4099604),
            longitude: new Decimal(-47.3804479),
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: -23.4099604,
            userLongitude: -47.3804479,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(1986, 10, 20, 19, 45, 0))

        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: -23.4099604,
            userLongitude: -47.3804479,
        })

        await expect(
            async () =>
                await service.execute({
                    userId: 'user-id',
                    gymId: 'gym-id',
                    userLatitude: -23.4099604,
                    userLongitude: -47.3804479,
                })
        ).rejects.toBeInstanceOf(Error)
    })

    it('should not be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(1986, 4, 15, 8, 30, 0))

        await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: -23.4099604,
            userLongitude: -47.3804479,
        })

        vi.setSystemTime(new Date(1986, 10, 20, 19, 45, 0))

        const { checkIn } = await service.execute({
            userId: 'user-id',
            gymId: 'gym-id',
            userLatitude: -23.4099604,
            userLongitude: -47.3804479,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
