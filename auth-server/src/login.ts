import { Request } from 'itty-router'
import {
  errorResponse,
  generateAccessToken,
  generateRefreshToken,
  getUser,
} from './util'
import prisma from './db'
import bcrypt from 'bcryptjs'

export default async (request: Request) => {
  try {
    const body: { username: string; password: string } = await request.json?.()

    const { username, password } = body

    const checkUser = await getUser(username)
    if (!checkUser)
      return errorResponse(401, 'Invalid Credentials, please try again!')

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password,
    )

    if (!checkPasswordMatch)
      return errorResponse(401, 'Invalid Credentials, please try again!')

    const { password: userpass, ...user } = checkUser
    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    await prisma.session.create({
      data: {
        refreshToken,
        user_id: user.id,
      },
    })

    return new Response(
      JSON.stringify({
        user,
        accessToken,
        refreshToken,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
  } catch (exception) {
    console.log(exception)
  }
}
