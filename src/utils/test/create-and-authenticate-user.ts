import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
    await request(app.server).post('/users').send({
        name: 'Danilo Salvador',
        email: 'danilo.salvador@test.com',
        password: '123@321',
    })

    const authResponse = await request(app.server).post('/sessions').send({
        email: 'danilo.salvador@test.com',
        password: '123@321',
    })

    const { token } = authResponse.body

    return {
        token,
    }
}
