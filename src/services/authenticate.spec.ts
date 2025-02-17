import { expect, describe, it } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const service = new AuthenticateService(usersRepository)

        const password = '123456'
        const password_hash = await hash(password, 8)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash,
        })

        const { user } = await service.execute({
            email: 'johndoe@example.com',
            password,
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should be able to authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const service = new AuthenticateService(usersRepository)

        expect(
            async () =>
                await service.execute({
                    email: 'johndoe@example.com',
                    password: '123456',
                })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const service = new AuthenticateService(usersRepository)

        const password_hash = await hash('123456', 8)

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash,
        })

        expect(
            async () =>
                await service.execute({
                    email: 'johndoe@example.com',
                    password: '654321',
                })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
