// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import NextAuth, { AuthOptions } from 'next-auth';
// import prisma from '@/src/config/prismadb';
// import CredentialsProvider  from 'next-auth/providers/credentials';
// import { Account } from '@prisma/client';
// import bcrypt from 'bcrypt'

// // const GOOGLE_AUTHORIZATION_URL =
// //   'https://accounts.google.com/o/oauth2/v2/auth?' +
// //   new URLSearchParams({
// //     prompt: 'consent',
// //     access_type: 'offline',
// //     response_type: 'code',
// //   });

// export const authOptions: AuthOptions = prisma && {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: {label: 'email', type: 'text'},
//         password: {label: 'password', type: 'password'}
//       },
//       async authorize(credentials) {
//         if(!credentials?.email || !credentials?.password) {
//           throw new Error('Invalid credentials')
//         }

//         const user = await prisma?.user?.findUnique({
//           where: {
//             email: credentials?.email
//           }
//         })

//         if(!user || !user?.hashedPassword) {
//           throw new Error('Invalid credentials')
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials?.password,
//           user.hashedPassword
//         )

//         if(!isCorrectPassword) {
//           throw new Error('Invalid credentials')
//         }

//         return user
//       }
//     })
//   ],
//   pages: {
//     signIn: '/',
//   },
//   debug: process.env.NODE_ENV === 'development',
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     jwt: async ({ token, account, user }) => {
//       if (account && user) {
//         // token.accessToken = account?.access_token;
//         // token.id = account?.userId;
//         // token.refreshToken = account?.refresh_token;

//         return {
//           accessToken: account.access_token,
//           accessTokenExpires: Date.now() + Number(account?.expires_in) * 1000,
//           refreshToken: account.refresh_token,
//           user
//         }
//       }

//       if (Date.now() < Number(token?.accessTokenExpires)) {
//         return token
//       }

//       return token
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// declare module "next-auth" {
//   interface Session {
//     error?: "RefreshAccessTokenError"
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     access_token: string
//     expires_at: number
//     refresh_token: string
//     error?: "RefreshAccessTokenError"
//   }
// }

// export default NextAuth(authOptions);
