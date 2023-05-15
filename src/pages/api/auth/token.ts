import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req?.method !== 'GET') {
    res.status(500).json('Not this method')
  }

  const token = await getToken({req, secret})
  if(!token) {
    res.status(500).json('Something went wrong!')
  }

  res?.status(200).json({
    token: token
  })
}
