import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileService } from '../get-user-profile'

export function makeGetUserProfileService() {
    const repository = new PrismaUsersRepository()
    const service = new GetUserProfileService(repository)

    return service
}
