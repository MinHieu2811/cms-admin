import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req?.method !== 'PUT') {
    return res?.status(500).json({
      success: false,
      message: 'Not this method'
    })
  }

  try {

    const cookies = new Cookies(req, res)
    const token = cookies?.get('refresh_token');

    const decoded = jwt.verify(
      token || '',
      process.env.NEXTAUTH_SECRET || 'thisisothersecret'
    ) as jwt.JwtPayload;

    const { newPassword } = req?.body

    if(!newPassword) {
      return res?.status(400)?.json({
        success: false,
        message: 'Invalid password!'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const userDetail = await prisma?.user?.update({
      where: {
        email: decoded?.data,
      },
      data: {
        hashedPassword: hashedPassword
      }
    });

    if(!userDetail) {
      return res?.status(500)?.json({
        success: false,
        message: 'Update failed!'
      })
    }

    res?.status(200)?.json({
      success: true,
      data: userDetail
    })
  } catch (err) {
    console.error(err);
    res?.status(500)?.json({
      success: false,
      message: err
    })
  }
}