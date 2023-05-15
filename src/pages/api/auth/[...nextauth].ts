import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import prisma from '@/src/config/prismadb';
import GoogleProvider from 'next-auth/providers/google';
import { Account } from '@prisma/client';

// const GOOGLE_AUTHORIZATION_URL =
//   'https://accounts.google.com/o/oauth2/v2/auth?' +
//   new URLSearchParams({
//     prompt: 'consent',
//     access_type: 'offline',
//     response_type: 'code',
//   });

export const authOptions: AuthOptions = prisma && {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { access_type: "offline", prompt: "consent" } }
    }),
  ],
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'database',
  },
  callbacks: {
    // jwt: async ({ token, account, user }) => {
    //   console.log(token);
    //   if (account && user) {
    //     // token.accessToken = account?.access_token;
    //     // token.id = account?.userId;
    //     // token.refreshToken = account?.refresh_token;

    //     return {
    //       accessToken: account.access_token,
    //       accessTokenExpires: Date.now() + Number(account?.expires_in) * 1000,
    //       refreshToken: account.refresh_token,
    //       user
    //     }
    //   }

    //   if (Date.now() < Number(token?.accessTokenExpires)) {
    //     return token
    //   }

    //   return refreshAccessToken(token)
    // },
    async session({ session, user }) {
      const [google] = await prisma?.account.findMany({
        where: { userId: user.id, provider: "google" },
      }) as Account[]
      console.log('google', google);
      if (google?.expires_at && google?.expires_at * 1000 < Date.now()) {
        // If the access token has expired, try to refresh it
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_ID || '',
              client_secret: process.env.GOOGLE_SECRET || '',
              grant_type: "refresh_token",
              refresh_token: google?.refresh_token || '',
            }),
            method: "POST",
          })

          const tokens = await response.json()

          if (!response.ok) throw tokens

          await prisma?.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
              refresh_token: tokens.refresh_token ?? google.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: google.providerAccountId,
              },
            },
          })
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          session.error = "RefreshAccessTokenError"
        }
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshAccessTokenError"
  }
}

export default NextAuth(authOptions);
