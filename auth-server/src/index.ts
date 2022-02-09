import { PrismaClient } from '@prisma/client'
import { Router } from 'itty-router'

const router = Router()
const prisma = new PrismaClient()

router.get(
  '/',
  async (request) =>
    new Response(
      JSON.stringify({
        message: 'Hello :)',
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    ),
)

router.all('*', () => new Response('404, not found!', { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
