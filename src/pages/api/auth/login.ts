import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Cookies from 'cookies';
import prisma from '@/src/config/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method !== 'POST') {
    return res.status(500).json('Not this method');
  }
  try {
    const cookies = new Cookies(req, res);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        ?.status(500)
        .json({ message: 'Check your credentials', success: false });
    }

    const userDetail = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userDetail || !userDetail?.hashedPassword) {
      return res?.status(404).json({ message: 'User not found!', success: false });
    }

    if (!userDetail?.activated) {
      return res
        ?.status(400)
        .json({ message: 'This account is deactivated!', success: false });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      userDetail?.hashedPassword as string
    );

    if (!isCorrectPassword) {
      return res
        ?.status(400)
        .json({ message: 'Incorrect credentials', success: false });
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

    const refreshToken = jwt.sign(
      {
        data: userDetail?.email,
      },
      process.env.NEXTAUTH_SECRET || 'thisisothersecret',
      { expiresIn: '8h' }
    );

    cookies.set('refresh_token', refreshToken, { httpOnly: false });

    return res?.status(200).json({
      success: true,
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
}
