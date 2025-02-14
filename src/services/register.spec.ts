import { expect, describe, it } from 'vitest'
import { compare } from 'bcryptjs'

import { UserRegisterService } from './register'

import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userRegisterService = new UserRegisterService(usersRepository)

        const { user } = await userRegisterService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userRegisterService = new UserRegisterService(usersRepository)

        const password = '123456'

        const { user } = await userRegisterService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password,
        })

        const isPasswordHashed = await compare(password, user.password_hash)

        expect(isPasswordHashed).toBe(true)
    })

    it('should not allow registration with an already registered email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const userRegisterService = new UserRegisterService(usersRepository)

        const email = 'johndoe@example.com'

        await userRegisterService.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        expect(async () => {
            await userRegisterService.execute({
                name: 'John Doe',
                email,
                password: '123456',
            })
        }).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
