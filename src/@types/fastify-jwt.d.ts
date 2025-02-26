import '@fastify/jwt'

// https://github.com/fastify/fastify-jwt?tab=readme-ov-file#typescript-1
declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: {
            sub: string
        }
    }
}
