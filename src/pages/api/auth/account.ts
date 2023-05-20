import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req?.method !== 'GET') {
      res.status(500).json({
        success: false,
        message: 'Not this method',
      });
    }

    const cookies = new Cookies(req, res);
    const refreshToken = cookies?.get('refresh_token');

    const decoded = jwt?.verify(
      refreshToken || '',
      process.env.NEXTAUTH_SECRET || 'thisisothersecret'
    ) as jwt.JwtPayload;

    const userDetail = await prisma?.user?.findUnique({
      where: {
        email: decoded?.data,
      },
    });

    if (!userDetail) {
      res.status(404)?.json({
        success: false,
        message: 'User not found!',
      });

      return;
    }
    res.status(200).json({ success: true, data: userDetail });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ message: 'Unauthorized! Access Token was expired!' });
    }
    return res.status(401).json({ message: 'Unauthorized!' });
  }
}
