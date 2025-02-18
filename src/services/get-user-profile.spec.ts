import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'
import { NotFoundError } from '@/errors/not-found-error'

let repository: InMemoryUsersRepository
let service: GetUserProfileService

describe('Get User Profile Use Case', () => {
    beforeEach(() => {
        repository = new InMemoryUsersRepository()
        service = new GetUserProfileService(repository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await repository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 8),
        })

        const { user } = await service.execute({
            userId: createdUser.id,
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it('should be able to get user profile with wrong id', async () => {
        expect(
            async () =>
                await service.execute({
                    userId: 'non-existing-id',
                })
        ).rejects.toBeInstanceOf(NotFoundError)
    })
})
