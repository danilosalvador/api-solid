import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

export function makeAuthenticateService() {
    const repository = new PrismaUsersRepository()
    const service = new AuthenticateService(repository)

    return service
}
