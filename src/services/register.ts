import { hash } from 'bcryptjs'

import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import type { UsersRepository } from '@/repositories/users-repository'

interface RegisterServiceParams {
    name: string
    email: string
    password: string
}

export class UserRegisterService {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterServiceParams) {
        const password_hash = await hash(password, 8)

        const emailExists = await this.usersRepository.findByEmail(email)

        if (emailExists) {
            throw new UserAlreadyExistsError()
        }

        // const prismaUsersRepository = new PrismaUsersRepository()
        await this.usersRepository.create({
            name,
            email,
            password_hash,
        })
    }
}
