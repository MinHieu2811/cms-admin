import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/config/prismadb';
import bcrypt from 'bcrypt'

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
    const { email, newPassword, oldPassword } = req?.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    const userInfo = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }

    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      userInfo?.hashedPassword as string
    );

    if(!isCorrectPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect!'
      })
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await prisma?.user?.update({
      where: {
        id: userInfo?.id
      },
      data: {
        login: newPassword,
        hashedPassword: newHashedPassword
      }
    })

    if(!updatedUser) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot update password!',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Password is updated! Please login again',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
}
