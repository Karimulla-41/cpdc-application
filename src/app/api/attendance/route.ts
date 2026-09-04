import { NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse, forbiddenResponse, isStaffOrAdmin, assertOwnDataOrAdmin } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from '@/types/models';

export async function GET(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get('userId');
  const eventId = searchParams.get('eventId');

  const targetUserId = requestedUserId || sessionUser.userId;

  if (!assertOwnDataOrAdmin(sessionUser, targetUserId)) {
    return forbiddenResponse('Access Denied: You are not authorized to view another student\'s attendance data.');
  }

  if (isStaffOrAdmin(sessionUser.role) && !requestedUserId) {
    let where: any = {};
    if (eventId) where.eventId = eventId;

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        event: { select: { id: true, title: true, date: true, venue: true } },
        user: { select: { id: true, name: true, studentId: true, department: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ attendances });
  }

  const userAttendances = await prisma.attendance.findMany({
    where: { userId: targetUserId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalCompletedEvents = await prisma.event.count({
    where: { status: 'COMPLETED' },
  });

  const attendedCount = userAttendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
  const attendancePercentage = totalCompletedEvents > 0 
    ? Math.round((attendedCount / totalCompletedEvents) * 100) 
    : 0;

  return NextResponse.json({
    attendances: userAttendances,
    stats: {
      attendedCount,
      totalEvents: totalCompletedEvents || userAttendances.length,
      attendancePercentage,
    },
  });
}

export async function POST(request: Request) {
  const sessionUser = await getAuthenticatedUser();
  if (!sessionUser) return unauthorizedResponse();

  if (!isStaffOrAdmin(sessionUser.role)) {
    return forbiddenResponse('Only Staff Coordinators and Admins can update attendance records.');
  }

  try {
    const body = await request.json();
    const { eventId, userId, status } = body;

    if (!eventId || !userId || !status) {
      return NextResponse.json({ error: 'eventId, userId, and status are required' }, { status: 400 });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      update: {
        status: status as AttendanceStatus,
      },
      create: {
        eventId,
        userId,
        status: status as AttendanceStatus,
      },
      include: {
        event: { select: { title: true } },
        user: { select: { name: true, studentId: true } },
      },
    });

    return NextResponse.json({ attendance });
  } catch (error: any) {
    console.error('Error recording attendance:', error);
    return NextResponse.json({ error: error?.message || 'Failed to record attendance' }, { status: 500 });
  }
}
