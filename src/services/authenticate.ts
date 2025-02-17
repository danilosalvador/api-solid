import { compare } from 'bcryptjs'

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'

import type { UsersRepository } from '@/repositories/users-repository'
import type { User } from '@prisma/client'

interface AuthenticateServiceParams {
    email: string
    password: string
}

interface AuthenticateServiceResponse {
    user: User
}

export class AuthenticateService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateServiceParams): Promise<AuthenticateServiceResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatch = await compare(password, user.password_hash)

        if (!doesPasswordMatch) {
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}
