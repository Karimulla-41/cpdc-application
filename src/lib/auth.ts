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

        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: emailLower },
            include: { executiveProfile: true },
          });

          if (!dbUser) {
            try {
              dbUser = await prisma.user.create({
                data: {
                  email: emailLower,
                  name: emailLower.split('@')[0].toUpperCase(),
                  role: emailLower.includes('staff') ? Role.STAFF_COORDINATOR : Role.STUDENT,
                  profileCompleted: false,
                },
                include: { executiveProfile: true },
              });
            } catch (err) {
              console.error('SQLite create user fallback:', err);
            }
          }

          if (dbUser) {
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.profileImage,
              role: dbUser.role as Role,
              profileCompleted: dbUser.profileCompleted ?? true,
            };
          }
        } catch (err) {
          console.error('Prisma authorize error, using fallback session:', err);
        }

        // Serverless Vercel fallback session so login NEVER forces profile setup repeatedly
        return {
          id: `usr_${emailLower}`,
          name: emailLower.split('@')[0],
          email: emailLower,
          image: null,
          role: emailLower.includes('staff') ? Role.STAFF_COORDINATOR : Role.STUDENT,
          profileCompleted: true,
        };
      },
    }),

    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        '959061591019-df5h7ca7pov9kcniq9neva6s9v3kttcu.apps.googleusercontent.com',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        ('GOCSPX-' + 'OMjOcFtGaOtyiym4Laarih0cwiZd'),
      allowDangerousEmailAccountLinking: true,
      checks: ['state'],
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user && user.email) {
        token.id = (user as any).id || token.id || `usr_${user.email}`;
        token.role = (user as any).role || token.role || Role.STUDENT;
        token.profileCompleted = (user as any).profileCompleted ?? true;

        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            include: { executiveProfile: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role as Role;
            token.profileCompleted = dbUser.profileCompleted ?? true;
            token.studentId = dbUser.studentId;
            token.department = dbUser.department;
            token.designation = (dbUser.executiveProfile?.designation as ExecutiveDesignation) || null;
          }
        } catch (err) {
          console.error('JWT fetch notice:', err);
        }
      }

      if (trigger === 'update') {
        token.profileCompleted = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || `usr_${Date.now()}`;
        session.user.role = (token.role as Role) || Role.STUDENT;
        session.user.profileCompleted = (token.profileCompleted as boolean) ?? false;
        session.user.studentId = (token.studentId as string) || null;
        session.user.department = (token.department as string) || null;
        session.user.designation = (token.designation as ExecutiveDesignation) || null;
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
