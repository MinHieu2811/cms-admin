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

    const {size, page, sort} = req?.query
    const sizeNum = Number(size) | 20
    const pageNum = Number(page) | 0
    const sortingOrd = (sort as string)?.split(",")[1] === 'desc' ? 'desc' : 'asc'

    const userList = await prisma?.user?.findMany({
      orderBy: {
        createdAt: sortingOrd,
      },
      // skip: sizeNum * (pageNum + 1),
      take: sizeNum * (pageNum + 1)
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
