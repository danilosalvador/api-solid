import { SearchGymsService } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsService() {
    const repository = new PrismaGymsRepository()
    const service = new SearchGymsService(repository)

    return service
}
