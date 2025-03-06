import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Refresh Token (e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to refresh token', async () => {
        await request(app.server).post('/users').send({
            name: 'Danilo Salvador',
            email: 'danilo.salvador@test.com',
            password: '123@321',
        })

        const authResponse = await request(app.server).post('/sessions').send({
            email: 'danilo.salvador@test.com',
            password: '123@321',
        })

        const cookies = authResponse.get('Set-Cookie')

        expect(cookies).toBeDefined()

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies as string[])
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String),
        })
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken='),
        ])
    })
})
