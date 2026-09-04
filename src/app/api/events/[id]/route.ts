import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@/types/models';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      attendances: {
        include: {
          user: {
            select: { id: true, name: true, studentId: true, department: true },
          },
        },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can update events');
  }

  try {
    const body = await request.json();
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        venue: body.venue,
        posterUrl: body.posterUrl,
        registrationUrl: body.registrationUrl,
        status: body.status ? (body.status as EventStatus) : undefined,
      },
    });

    return NextResponse.json({ event: updatedEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can delete events');
  }

  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete event' }, { status: 500 });
  }
}
