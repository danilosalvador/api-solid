import type { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, response: FastifyReply) {
    await request.jwtVerify({
        onlyCookie: true,
    })

    /*
        TODO: Criar uma funcionalidade para salvar o refreshToken no Banco de Dados
        para que esse novo registro possa ser consultado e também invalidado.
        Exemplo: alguma tela que lista os dispositivos conectados para serem invalidados
    */

    const { role, sub } = request.user

    const token = await response.jwtSign(
        {
            role,
        },
        {
            sign: {
                sub,
            },
        }
    )

    const refreshToken = await response.jwtSign(
        {
            role,
        },
        {
            sign: {
                sub,
                expiresIn: '7d',
            },
        }
    )

    return response
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true, // Cookie será encriptografado pelo HTTPS
            sameSite: true, // Acessível apenas no mesmo domínio
            httpOnly: true, // Acessível apenas pelo backend da aplicação
        })
        .status(200)
        .send({ token })
}
