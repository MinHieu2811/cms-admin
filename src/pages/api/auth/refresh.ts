import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/src/config/prismadb';
import Cookies from 'cookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method !== 'GET') {
    res?.status(500).json({
      success: false,
      message: 'Not this method!',
    });
  }

  try {
    const cookies = new Cookies(req, res);

    const token = cookies?.get('refresh_token');

    const decoded = jwt.verify(
      token || '',
      process.env.NEXTAUTH_SECRET || 'thisisothersecret'
    ) as jwt.JwtPayload;

    const userDetail = await prisma?.user.findUnique({
      where: {
        email: decoded?.data?.email,
      },
    });

    if (!userDetail) {
      res
        .status(500)
        .json({ success: false, message: 'Something went wrong!' });
    }

    const accessToken = jwt.sign(
      {
        data: {
          name: userDetail?.name,
          email: userDetail?.email,
          activated: userDetail?.activated,
          authorities: userDetail?.authorities,
          image: userDetail?.image,
          id: userDetail?.id,
        },
      },
      process?.env.NEXTAUTH_SECRET || 'thisissecret',
      { expiresIn: '1h' }
    );

    res.status(200).json(accessToken);
  } catch (err) {
    res.status(401).json(err)
  }
}
