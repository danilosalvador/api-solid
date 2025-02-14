import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { expect, describe, it } from 'vitest'
import { UserRegisterService } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
        // Arrange
        const prismaUsersRepository = new PrismaUsersRepository()

        const userRegisterService = new UserRegisterService(
            prismaUsersRepository
        )

        const password = '123456'

        const { user } = await userRegisterService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password,
        })

        const isPasswordHashed = await compare(password, user.password_hash)

        expect(isPasswordHashed).toBe(true)
    })
})
