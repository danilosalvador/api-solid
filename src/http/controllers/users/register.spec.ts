import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Register (e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'Danilo Salvador',
            email: 'danilo.salvador@test.com',
            password: '123@321',
        })

        expect(response.statusCode).toEqual(201)
    })
})
