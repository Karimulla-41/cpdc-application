import { Role, ExecutiveDesignation } from '@/types/models';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role: Role;
      profileCompleted: boolean;
      studentId?: string | null;
      department?: string | null;
      designation?: ExecutiveDesignation | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: Role;
    profileCompleted: boolean;
    studentId?: string | null;
    department?: string | null;
    designation?: ExecutiveDesignation | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: Role;
    profileCompleted: boolean;
    studentId?: string | null;
    department?: string | null;
    designation?: ExecutiveDesignation | null;
  }
}
