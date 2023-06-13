import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/config/prismadb';
import nodemailer from 'nodemailer';
import { generateCode } from '@/src/utils';

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
    const { email } = req?.body;

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

    const accessCode = generateCode();

    const smtTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cuunhatnhat51@gmail.com',
        pass: 'cnavmslaggcejjpi',
      },
    });
    await prisma?.user?.update({
      where: {
        email: email,
      },
      data: {
        token: accessCode,
      },
    });
    const mailOptions = {
      from: 'cuunhatnhat51@gmail.com',
      to: email,
      subject: 'Account Activation Link',
      text:
        'You are receiving this beacause you have requested the reset of the password for SolStore COSMETIC' +
        '\n\n' +
        'Your reset code is:' +
        accessCode +
        '\n\n' +
        'If you did not request this, please ignore this email' +
        '\n\n',
    };
    const emailSms = await smtTransport.sendMail(mailOptions);

    if (!emailSms?.accepted?.length) {
      return res.status(500).json({
        success: false,
        message: 'Email can not sent!',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Email is sent! Check your email and the token will expire in 15 minutes',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
}
