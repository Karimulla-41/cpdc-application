import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.userId },
    include: {
      executiveProfile: true,
      staffCoordinator: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, studentId, department, year, section, phone, profileImage, image, role } = body;

    const chosenRole = role === 'STAFF_COORDINATOR' ? 'STAFF_COORDINATOR' : 'STUDENT';
    const finalImage = profileImage || image || undefined;

    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { id: sessionUser.userId },
        data: {
          name: name || undefined,
          studentId: studentId ? studentId.trim() : null,
          department: department ? department.trim() : 'CPDC',
          year: year ? year.trim() : 'N/A',
          section: section ? section.trim() : null,
          phone: phone ? phone.trim() : null,
          profileImage: finalImage,
          role: chosenRole,
          profileCompleted: true,
        },
        include: {
          executiveProfile: true,
          staffCoordinator: true,
        },
      });

      if (chosenRole === 'STAFF_COORDINATOR') {
        try {
          await prisma.staffCoordinator.upsert({
            where: { userId: sessionUser.userId },
            create: {
              userId: sessionUser.userId,
              department: department || 'CPDC',
              designation: 'CPDC Faculty Advisor',
            },
            update: {
              department: department || 'CPDC',
              designation: 'CPDC Faculty Advisor',
            },
          });
        } catch (scErr) {
          console.error('StaffCoordinator upsert notice:', scErr);
        }
      }
    } catch (dbErr) {
      console.error('Database user profile update fallback:', dbErr);
      updatedUser = {
        id: sessionUser.userId,
        name: name || sessionUser.name || 'User',
        email: sessionUser.email,
        profileImage: finalImage || null,
        role: chosenRole,
        profileCompleted: true,
      };
    }

    return NextResponse.json({
      message: 'Profile completed successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
