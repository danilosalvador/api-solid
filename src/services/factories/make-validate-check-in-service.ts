import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInService } from '../validate-check-in'

export function makeValidateCheckInService() {
    const repository = new PrismaCheckInsRepository()
    const service = new ValidateCheckInService(repository)

    return service
}
