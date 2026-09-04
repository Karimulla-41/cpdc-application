import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@/types/models';

export async function GET(request: Request) {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause = {};
    if (status && (status === 'UPCOMING' || status === 'COMPLETED' || status === 'CANCELLED')) {
      whereClause = { status: status as EventStatus };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { attendances: true, registrations: true },
        },
      },
    });

    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can create events');
  }

  try {
    const body = await request.json();
    const { title, description, date, startTime, endTime, venue, posterUrl, registrationUrl, status } = body;

    if (!title || !description || !date || !startTime || !endTime || !venue) {
      return NextResponse.json({ error: 'Title, description, date, times, and venue are required' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date,
        startTime,
        endTime,
        venue,
        posterUrl: posterUrl || null,
        registrationUrl: registrationUrl || null,
        status: status ? (status as EventStatus) : EventStatus.UPCOMING,
      },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create event' }, { status: 500 });
  }
}
