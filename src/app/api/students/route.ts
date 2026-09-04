import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { Role, ExecutiveDesignation } from '@/types/models';

export async function GET() {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can access the student & executive directory.');
  }

  const students = await prisma.user.findMany({
    where: {
      role: { in: [Role.STUDENT, Role.EXECUTIVE] },
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      department: true,
      year: true,
      section: true,
      phone: true,
      role: true,
      profileCompleted: true,
      profileImage: true,
      executiveProfile: {
        select: { designation: true, active: true },
      },
    },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only authorized Staff Coordinators and Admins can manage student roles and designations.');
  }

  try {
    const body = await request.json();
    const { userId, role, designation } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (role === Role.EXECUTIVE) {
      const desig = (designation as ExecutiveDesignation) || ExecutiveDesignation.EXECUTIVE_MEMBER;
      
      // Update user role to EXECUTIVE
      await prisma.user.update({
        where: { id: userId },
        data: { role: Role.EXECUTIVE },
      });

      // Upsert ExecutiveProfile
      await prisma.executiveProfile.upsert({
        where: { userId },
        update: {
          designation: desig,
          photo: targetUser.profileImage || null,
          active: true,
        },
        create: {
          userId,
          designation: desig,
          photo: targetUser.profileImage || null,
          active: true,
        },
      });
    } else {
      // Revert user role to STUDENT
      await prisma.user.update({
        where: { id: userId },
        data: { role: Role.STUDENT },
      });

      // Remove ExecutiveProfile
      await prisma.executiveProfile.deleteMany({
        where: { userId },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { executiveProfile: true },
    });

    return NextResponse.json({
      message: `User role successfully updated to ${role} (${designation || 'N/A'})`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating student role & executive designation:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update student role' }, { status: 500 });
  }
}
