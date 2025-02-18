import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { UserRegisterService } from './register'

import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let repository: InMemoryUsersRepository
let service: UserRegisterService

describe('Register Use Case', () => {
    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        service = new UserRegisterService(repository)
    })

    it('should be able to register', async () => {
        const { user } = await service.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const password = '123456'

        const { user } = await service.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password,
        })

        const isPasswordHashed = await compare(password, user.password_hash)

        expect(isPasswordHashed).toBe(true)
    })

    it('should not allow registration with an already registered email', async () => {
        const email = 'johndoe@example.com'

        await service.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(async () => {
            await service.execute({
                name: 'John Doe',
                email,
                password: '123456',
            })
        }).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
