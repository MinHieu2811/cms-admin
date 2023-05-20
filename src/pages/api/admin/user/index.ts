import { NextApiRequest, NextApiResponse } from 'next';
import jwtDecode from 'jwt-decode';
import prisma from '@/src/config/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method !== 'GET') {
    return res.status(500).json({
      success: false,
      message: 'Not this method',
    });
  }

  try {
    const token =
      req?.headers?.authorization?.startsWith('Bearer') &&
      req?.headers?.authorization?.split(' ')[1];

    const decoded = jwtDecode(token as string) as any;

    if (decoded?.exp * 1000 < Date?.now()) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized' });
    }

    const userList = await prisma?.user?.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    if (!userList?.length) {
      return res
        .status(200)
        .json({ success: true, message: 'No users found!' });
    }

    res.status(200).json({
      data: {
        content: userList,
        totalItems: userList?.length
      },
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    })
  }
}
