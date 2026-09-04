import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return unauthorizedResponse();

    // 1. Fetch Staff Coordinators from DB
    const dbStaff = await prisma.staffCoordinator.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            profileImage: true,
          },
        },
      },
    });

    const staffCoordinators = dbStaff.map((sc) => ({
      id: sc.id,
      userId: sc.userId,
      name: sc.user.name,
      designation: sc.designation || 'Staff Coordinator',
      department: sc.department || sc.user.department || 'CPDC',
      photo: sc.user.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    }));

    // 2. Fetch Active Executive Profiles from DB
    const dbExecs = await prisma.executiveProfile.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            year: true,
            profileImage: true,
          },
        },
      },
    });

    const dbTeam = dbExecs.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      designation: p.designation,
      department: p.user.department || 'CSE',
      year: p.user.year || '3rd Year',
      photo: p.photo || p.user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      displayOrder: p.displayOrder,
    }));

    const studentLeadership = dbTeam.filter((m) =>
      ['PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER'].includes(m.designation)
    );

    const executives = dbTeam.filter((m) =>
      !['PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER'].includes(m.designation)
    );

    return NextResponse.json({
      staffCoordinators,
      studentLeadership,
      executives,
    });
  } catch (err) {
    return NextResponse.json({
      staffCoordinators: [],
      studentLeadership: [],
      executives: [],
    });
  }
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can manage team members');
  }

  try {
    const body = await request.json();
    const { name, email, roleCategory, designation, department, year, photo } = body;

    if (!name) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
    }

    const userEmail = email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@cpdc.edu`;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: userEmail,
          department: department || 'CSE',
          year: year || '3rd Year',
          profileImage: photo || null,
          role: roleCategory === 'STAFF' ? 'STAFF_COORDINATOR' : 'EXECUTIVE',
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          department: department || user.department,
          year: year || user.year,
          profileImage: photo || user.profileImage,
        },
      });
    }

    if (roleCategory === 'STAFF') {
      await prisma.staffCoordinator.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          department: department || 'CPDC',
          designation: designation || 'Staff Coordinator',
        },
        update: {
          department: department || 'CPDC',
          designation: designation || 'Staff Coordinator',
        },
      });
    } else {
      await prisma.executiveProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          designation: designation || 'EXECUTIVE_MEMBER',
          photo: photo || null,
        },
        update: {
          designation: designation || 'EXECUTIVE_MEMBER',
          photo: photo || null,
        },
      });
    }

    return NextResponse.json({ message: 'Team member updated successfully', user });
  } catch (error: any) {
    console.error('Error creating/updating team member:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update team member' }, { status: 500 });
  }
}
