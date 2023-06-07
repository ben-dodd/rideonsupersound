import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handler(req, res) {
  console.log(req.body)
  try {
    const { scopes } = req.body
    const { accessToken } = await getAccessToken(req, res, {
      scopes,
    })
    console.log('accessToken', accessToken)
    res.json(accessToken)
  } catch (error) {
    if (error.error === 'invalid_grant') {
      res.redirect('/').end()
    } else {
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message,
      })
    }
  }
}
