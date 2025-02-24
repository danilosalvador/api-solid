import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms'

export function makeNearbyGymsService() {
    const repository = new PrismaGymsRepository()
    const service = new FetchNearbyGymsService(repository)

    return service
}
