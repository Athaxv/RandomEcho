import { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

interface AuthUser extends NextAuthUser {
  _id: string;
  isVerified: boolean;
  isAcceptingMessages?: boolean;
  username?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'identifier' | 'password', string> | undefined
      ): Promise<AuthUser | null> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) throw new Error('No user found with this email or username');
        if (!user.isVerified) throw new Error('Please verify your account before logging in');

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error('Incorrect password');

        const typedUser = user as typeof user & { _id: string };

        return {
          id: typedUser._id.toString(), // <-- Here, provide 'id' as required by NextAuth
          _id: typedUser._id.toString(),
          email: typedUser.email,
          username: typedUser.username,
          isVerified: typedUser.isVerified,
          isAcceptingMessages: typedUser.isAcceptingMessage,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token._id = (user as AuthUser)._id;
        token.username = (user as AuthUser).username;
        token.isVerified = (user as AuthUser).isVerified;
        token.isAcceptingMessages = (user as AuthUser).isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user && token) {
        session.user._id = token._id as string;
        session.user.username = token.username as string | undefined;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean | undefined;
      }
      return session;
    },
  },
};
