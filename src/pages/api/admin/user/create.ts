import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req?.method !== 'POST') {
    res.status(500).json({
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

    const {email, hashedPassword: password, langKey, authorities, name} = req?.body

    const user = await prisma?.user?.findMany({
      where: {
        email: email
      }
    })

    if(user?.length) {
      res?.status(500)?.json({
        success: false,
        message: 'This email has already exist!'
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await prisma?.user?.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        langKey: langKey,
        activated: false,
        authorities: authorities
      }
    })

    res?.status(200).json({
      success: true,
      data: createdUser
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
}