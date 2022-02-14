import { Role } from '@prisma/client'
import jwt from '@tsndr/cloudflare-worker-jwt'
import prisma from './db'

export const errorResponse = async (status: number, message: string) => {
  return new Response(
    JSON.stringify({
      status: 'error',
      message,
    }),
    {
      status,
    },
  )
}

export const getUser = async (username: string) =>
  await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      password: true,
      role: true,
      createdAt: true,
    },
    where: {
      username,
    },
  })

type UserPayload = {
  id: string
  username: string
  role: Role
  createdAt?: Date
  exp?: number
}

const expiresIn: number = parseInt(ACCESS_TOKEN_EXPIRY, 10)
const expiry = Math.floor(Date.now() / 1000) + expiresIn * 60 //Minutes

export const generateRefreshToken = async (user: UserPayload) => {
  user['exp'] = expiry
  return jwt.sign(user, REFRESH_TOKEN_SECRET)
}

export const generateAccessToken = async (user: UserPayload) => {
  user['exp'] = expiry
  return jwt.sign(user, ACCESS_TOKEN_SECRET)
}
