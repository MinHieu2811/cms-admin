import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { RolesSystem } from '@/src/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method !== 'POST') {
    res.status(500).json('Not this method');
  }
  const { name, email, password, langKey } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma?.user.create({
    data: {
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      langKey: langKey,
      activated: false,
      authorities: [RolesSystem?.USER],
      login: password,
    },
  });

  res?.status(200).json({
    user: user,
  });
}
