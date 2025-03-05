import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile-service'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, response: FastifyReply) {
    const getUserProfile = makeGetUserProfileService()

    const { user } = await getUserProfile.execute({
        userId: request.user.sub,
    })

    const { password_hash, ...userWithoutPassword } = user
    return response.status(200).send({ user: userWithoutPassword })
}
