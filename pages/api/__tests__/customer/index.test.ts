// import { dbCreateCustomer } from 'lib/database/customer'
// import { mockRequestResponse } from '../utils'
// import handler from '../../customer'
// import { requireScope } from 'lib/api/utils'
// import { NextApiHandler } from 'next'
// import { NextAuthenticatedApiRequest } from '@serverless-jwt/next/dist/types'

jest.mock('lib/database/customer')
jest.mock('lib/api/utils')

// describe('POST /api/v1/customer', () => {
//   it('creates a new customer in the database and returns an id', async () => {
//     dbCreateCustomer.mockImplementation(() => Promise.resolve([1]))
//     requireScope.mockImplementation((scope: string, apiRoute: NextApiHandler) =>
//       verifyJwt(async (req: NextAuthenticatedApiRequest, res) =>
//         apiRoute(req, res)
//       )
//     )
//     const { req, res } = mockRequestResponse('POST', 'clerk')
//     req.body = { name: 'Test customer' }
//     await handler(req, res)
//     expect(res.statusCode).toBe(200)
//     expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' })
//     expect(res.json).toHaveLength(1)
//     expect(res.json[0]).toBe(1)
//   })
// })
