import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library.js'
import { MaxDistanceError } from '@/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/errors/max-number-of-check-ins-error'

let repositoryCheckIns: InMemoryCheckInsRepository
let repositoryGyms: InMemoryGymsRepository
let service: CheckInService

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        repositoryCheckIns = new InMemoryCheckInsRepository()
        repositoryGyms = new InMemoryGymsRepository()
        service = new CheckInService(repositoryCheckIns, repositoryGyms)

        repositoryGyms.create({
            id: 'gym-id',
            title: 'Academia',
            description: null,
            phone: null,
            latitude: -23.4099604,
            longitude: -47.3804479,
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
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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

    it('should not be able to check in on distance gym', async () => {
        repositoryGyms.gyms.push({
            id: 'gym-02',
            title: 'Academia 02',
            description: '',
            phone: '',
            latitude: new Decimal(-23.6820691),
            longitude: new Decimal(-46.5698498),
        })

        await expect(
            async () =>
                await service.execute({
                    userId: 'user-01',
                    gymId: 'gym-02',
                    userLatitude: -23.4099604,
                    userLongitude: -47.3804479,
                })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})
