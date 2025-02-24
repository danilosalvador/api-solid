import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymService } from '../create-gym'

export function makeCreateGymService() {
    const repository = new PrismaGymsRepository()
    const service = new CreateGymService(repository)

    return service
}
