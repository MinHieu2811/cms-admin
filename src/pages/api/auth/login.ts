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
    res.status(500).json('Not this method');
  }
  const cookies = new Cookies(req, res);
  const { email, password } = req.body;

  if (!email || !password) {
    res
      ?.status(500)
      .json({ message: 'Check your credentials', success: false });
  }

  const userDetail = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userDetail || !userDetail?.hashedPassword) {
    res?.status(404).json({ message: 'User not found!', success: false });
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    userDetail?.hashedPassword as string
  );

  if (!isCorrectPassword) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign(
    {
      data: userDetail,
    },
    process?.env.NEXTAUTH_SECRET || 'thisissecret',
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    {
      data: userDetail?.hashedPassword,
    },
    process.env.NEXTAUTH_SECRET || 'thisisothersecret',
    { expiresIn: '8h' }
  );

  cookies.set('refresh_token', refreshToken, { httpOnly: true });

  res?.status(200).json({
    success: true,
    data: {
      userDetail,
      accessToken: accessToken,
    },
  });
}
