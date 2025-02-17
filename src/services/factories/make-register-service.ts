import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserRegisterService } from '../register'

export function makeRegisterService() {
    const repository = new PrismaUsersRepository()
    const service = new UserRegisterService(repository)

    return service
}
