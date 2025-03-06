import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create Gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '15912341234',
                latitude: -23.4099604,
                longitude: -47.3804479,
            })

        expect(response.statusCode).toEqual(201)
    })
})
