import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  const updates = await prisma.cpdcUpdate.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ updates });
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can publish CPDC updates');
  }

  try {
    const body = await request.json();
    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const update = await prisma.cpdcUpdate.create({
      data: {
        title,
        content,
        category: category || 'General',
      },
    });

    return NextResponse.json({ update }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create update' }, { status: 500 });
  }
}
