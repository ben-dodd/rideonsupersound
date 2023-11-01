import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handler(req, res) {
  try {
    const { scopes } = req.body
    let now = Date.now()
    const { accessToken } = await getAccessToken(req, res, {
      scopes,
      returnTo: '/api/auth/jwt',
    })
    console.log('getAccessToken took', Date.now() - now, 'ms')
    res.json(accessToken)
  } catch (error) {
    if (error.error === 'invalid_grant') {
      res.redirect('/error').end()
    } else {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}
