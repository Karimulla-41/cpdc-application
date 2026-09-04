import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { Role, ExecutiveDesignation } from '@/types/models';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const emailLower = credentials.email.toLowerCase().trim();

        let dbUser = await prisma.user.findUnique({
          where: { email: emailLower },
          include: { executiveProfile: true },
        });

        if (!dbUser) {
          // Auto-create testing user if requested via credentials
          dbUser = await prisma.user.create({
            data: {
              email: emailLower,
              name: emailLower.split('@')[0].toUpperCase(),
              role: emailLower.includes('staff') ? Role.STAFF_COORDINATOR : Role.STUDENT,
              profileCompleted: true,
            },
            include: { executiveProfile: true },
          });
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.profileImage,
          role: dbUser.role as Role,
          profileCompleted: dbUser.profileCompleted,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const emailLower = user.email.toLowerCase();
          const existingUser = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (!existingUser) {
            // New Google user -> Create in PostgreSQL with profileCompleted = false
            await prisma.user.create({
              data: {
                email: emailLower,
                googleId: user.id,
                name: user.name || 'CPDC User',
                profileImage: user.image,
                role: Role.STUDENT,
                profileCompleted: false,
              },
            });
          } else if (!existingUser.googleId) {
            // Existing pre-seeded or registered user -> Link Google ID
            await prisma.user.update({
              where: { email: emailLower },
              data: { googleId: user.id },
            });
          }
        } catch (error) {
          console.error('Error during Google sign-in database synchronization:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          include: { executiveProfile: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as Role;
          token.profileCompleted = dbUser.profileCompleted;
          token.studentId = dbUser.studentId;
          token.department = dbUser.department;
          token.designation = (dbUser.executiveProfile?.designation as ExecutiveDesignation) || null;
        }
      }

      if (trigger === 'update' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() },
          include: { executiveProfile: true },
        });

        if (dbUser) {
          token.role = dbUser.role as Role;
          token.profileCompleted = dbUser.profileCompleted;
          token.studentId = dbUser.studentId;
          token.department = dbUser.department;
          token.designation = (dbUser.executiveProfile?.designation as ExecutiveDesignation) || null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.profileCompleted = token.profileCompleted as boolean;
        session.user.studentId = token.studentId as string | null;
        session.user.department = token.department as string | null;
        session.user.designation = token.designation as ExecutiveDesignation | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'cpdc_secret_production_key_2026_change_in_prod',
};
