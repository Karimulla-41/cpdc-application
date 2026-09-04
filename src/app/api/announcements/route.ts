import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { Priority } from '@/types/models';

export async function GET() {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return unauthorizedResponse();

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ announcements });
  } catch (err) {
    return NextResponse.json({ announcements: [] });
  }
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can publish announcements');
  }

  try {
    const body = await request.json();
    const { title, content, imageUrl, priority } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        priority: priority ? (priority as Priority) : Priority.MEDIUM,
      },
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create announcement' }, { status: 500 });
  }
}
