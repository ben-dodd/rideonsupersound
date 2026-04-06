import { auth0 } from 'lib/auth0'

export default async function handler(req, res) {
  try {
    const { accessToken } = await auth0.getAccessToken()
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