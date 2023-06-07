import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handler(req, res) {
  try {
    const { scopes } = req.body
    const { accessToken } = await getAccessToken(req, res, {
      scopes,
      returnTo: '/api/auth/jwt',
    })
    res.json(accessToken)
  } catch (error) {
    console.log('ERROR', error)
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
