import { compare } from 'bcryptjs'

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'

import type { UsersRepository } from '@/repositories/users-repository'
import type { User } from '@prisma/client'
import { NotFoundError } from '@/errors/not-found-error'

interface GetUserProfileServiceParams {
    userId: string
}

interface GetUserProfileServiceResponse {
    user: User
}

export class GetUserProfileService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        userId,
    }: GetUserProfileServiceParams): Promise<GetUserProfileServiceResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new NotFoundError()
        }

        return {
            user,
        }
    }
}
