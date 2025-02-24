import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInService } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCheckInService() {
    const repositoryCheckIn = new PrismaCheckInsRepository()
    const repositoryGym = new PrismaGymsRepository()
    const service = new CheckInService(repositoryCheckIn, repositoryGym)

    return service
}
