import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'

import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterServiceParams {
    name: string
    email: string
    password: string
}

export async function registerService({
    name,
    email,
    password,
}: RegisterServiceParams) {
    const password_hash = await hash(password, 8)

    const emailExists = await prisma.user.findUnique({
        where: { email },
    })

    if (emailExists) {
        throw new Error('Email already in use')
    }

    const prismaUsersRepository = new PrismaUsersRepository()
    await prismaUsersRepository.create({
        name,
        email,
        password_hash,
    })
}
