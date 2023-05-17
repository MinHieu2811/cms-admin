import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.method !== 'POST') {
    res.status(500).json('Not this method');
  }
  const { name, email, password, langKey } = req.body;
  console.log(name, email, password, langKey);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma?.user.create({
    data: {
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      langKey: langKey,
      activated: false,
      authorities: ['ROLE_USER'],
      login: password
    },
  });

  res?.status(200).json({
    user: user,
  });
}
