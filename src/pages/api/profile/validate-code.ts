import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/config/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(500).json({
      success: false,
      message: 'Not this method!',
    });
  }

  try {
    const { code } = req?.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    const userInfo = await prisma?.user?.findFirst({
      where: {
        token: code
      }
    })

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    await prisma?.user?.update({
      where: {
        id: userInfo?.id
      }, data: {
        token: ""
      }
    })

    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
}
