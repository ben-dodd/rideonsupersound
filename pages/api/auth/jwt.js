import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handler(req, res) {
  try {
    const { scopes } = req.body
    const { accessToken } = await getAccessToken(req, res, {
      scopes,
    })
    res.json(accessToken)
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
