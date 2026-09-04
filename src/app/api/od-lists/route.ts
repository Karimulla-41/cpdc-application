import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { sendODListEmail } from '@/lib/email';

export async function GET() {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can view OD lists.');
  }

  const odLists = await prisma.oDList.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { title: true, date: true, venue: true } },
      students: {
        include: {
          user: { select: { id: true, name: true, studentId: true, department: true } },
        },
      },
    },
  });

  return NextResponse.json({ odLists });
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can create and send OD lists.');
  }

  try {
    const body = await request.json();
    const { eventId, recipientEmail, subject, studentIds } = body;

    if (!eventId || !recipientEmail || !subject || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'Event, recipient email, subject, and at least one student are required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true, studentId: true, department: true },
    });

    // Send transactional email
    const emailResult = await sendODListEmail({
      recipientEmail,
      subject,
      eventName: event.title,
      eventDate: event.date,
      venue: event.venue,
      students: students.map((s) => ({
        name: s.name,
        studentId: s.studentId || 'N/A',
        department: s.department || 'N/A',
      })),
    });

    // Create OD List record in database
    const odList = await prisma.oDList.create({
      data: {
        eventId,
        recipientEmail,
        subject,
        status: emailResult.previewMode ? 'SENT (PREVIEW MODE)' : 'SENT',
        students: {
          create: studentIds.map((uId: string) => ({
            userId: uId,
          })),
        },
      },
      include: {
        event: true,
        students: {
          include: {
            user: { select: { name: true, studentId: true } },
          },
        },
      },
    });

    return NextResponse.json({
      message: 'OD List dispatched successfully',
      odList,
      previewMode: emailResult.previewMode,
    });
  } catch (error: any) {
    console.error('Error sending OD list:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send OD list' }, { status: 500 });
  }
}
