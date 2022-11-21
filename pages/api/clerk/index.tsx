import { getClerk } from '@lib/database/clerk'
import { NextApiRequest, NextApiResponse } from 'next'
import { requireScope } from '@lib/swr/utils'

const apiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    fetch(`/api/auth/me`)
      .then((data) => data.json())
      .then((user) => {
        console.log(user)
        return getClerk(user?.sub)
      })
      .then((data) => {
        res.status(200).json(data)
      })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    })
  }
}

export default requireScope('read:clerk', apiRoute)
