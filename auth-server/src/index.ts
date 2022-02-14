import { Router } from 'itty-router'
import login from './login'

const router = Router()

declare global {
  const ACCESS_TOKEN_SECRET: string
  const ACCESS_TOKEN_EXPIRY: string
  const REFRESH_TOKEN_SECRET: string
}

router.post('/login', login)

router.all('*', () => new Response('404, not found!', { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
