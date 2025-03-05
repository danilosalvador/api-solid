import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Profile (e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get user profile', async () => {
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

        const profileResponse = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(profileResponse.statusCode).toEqual(200)
        expect(profileResponse.body.user).toEqual(
            expect.objectContaining({
                email: 'danilo.salvador@test.com',
            })
        )
    })
})
