import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handler(req, res) {
  try {
    console.log(req.body)
    const { scopes } = req.body
    console.log(scopes)
    const { accessToken } = await getAccessToken(req, res, {
      scopes,
    })
    // const { accessToken } = await getAccessToken(req, res)
    console.log(accessToken)
    res.json(accessToken)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}
