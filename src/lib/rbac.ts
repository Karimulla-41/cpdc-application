import { getAuthSession } from './session';
import { Role } from '@/types/models';
import { NextResponse } from 'next/server';

export interface AuthContext {
  userId: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
}

export async function getAuthenticatedUser(): Promise<AuthContext | null> {
  const session = await getAuthSession();
  if (!session || !session.user || !session.user.id) {
    return null;
  }
  return {
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role as Role,
    profileCompleted: session.user.profileCompleted,
  };
}

export function isStaffOrAdmin(role: Role): boolean {
  return role === Role.STAFF_COORDINATOR || role === Role.ADMIN;
}

export function assertOwnDataOrAdmin(sessionUser: AuthContext, targetUserId: string): boolean {
  if (isStaffOrAdmin(sessionUser.role)) {
    return true;
  }
  return sessionUser.userId === targetUserId;
}

export function unauthorizedResponse(message = 'Unauthorized access') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = 'Forbidden: You do not have permission to access this resource') {
  return NextResponse.json({ error: message }, { status: 403 });
}
