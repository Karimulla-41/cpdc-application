import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can delete announcements');
  }

  try {
    await prisma.announcement.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete announcement' }, { status: 500 });
  }
}
