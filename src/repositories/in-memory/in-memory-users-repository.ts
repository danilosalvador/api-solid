import { randomUUID } from 'node:crypto'
import type { Prisma, User } from '@prisma/client'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    private users: User[] = []

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user: User = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
        }

        this.users.push(user)

        return user
    }

    async findByEmail(email: string) {
        const user = this.users.find(user => user.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async findById(id: string) {
        const user = this.users.find(user => user.id === id)

        if (!user) {
            return null
        }

        return user
    }
}
