import { hash } from 'bcryptjs'

import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import type { UsersRepository } from '@/repositories/users-repository'
import type { User } from '@prisma/client'

interface RegisterServiceParams {
    name: string
    email: string
    password: string
}

interface RegisterServiceResponse {
    user: User
}

export class UserRegisterService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        name,
        email,
        password,
    }: RegisterServiceParams): Promise<RegisterServiceResponse> {
        const password_hash = await hash(password, 8)

        const emailExists = await this.usersRepository.findByEmail(email)

        if (emailExists) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        })

        return {
            user,
        }
    }
}
