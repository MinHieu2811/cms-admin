import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req?.method !== 'GET') {
    return res.status(500).json({
      success: false,
      message: 'Not this method!'
    })
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

    const { userId } = req.query

    if(!userId) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ID'
      })
    }

    const userDetail = await prisma?.user?.findUnique({
      where: {
        id: userId as string
      }
    })

    if(!userDetail) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    res.status(200).json({
      success: true,
      data: userDetail
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
}