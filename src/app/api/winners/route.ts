import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch all events with their winners
export async function GET() {
  try {
    const eventsWithWinners = await prisma.event.findMany({
      include: {
        winners: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const winners = await prisma.eventWinner.findMany({
      include: {
        event: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      eventsWithWinners,
      winners,
    });
  } catch (error) {
    console.error('Error fetching event winners:', error);
    return NextResponse.json({ error: 'Failed to fetch event winners' }, { status: 500 });
  }
}

// POST: Add an Event Winner (Staff / Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'STAFF_COORDINATOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Staff access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, position, title, winnerName, studentId, department, photoUrl, prize } = body;

    if (!eventId || !winnerName || !position) {
      return NextResponse.json({ error: 'Missing required fields (eventId, winnerName, position)' }, { status: 400 });
    }

    const newWinner = await prisma.eventWinner.create({
      data: {
        eventId,
        position,
        title: title || `${position} Winner`,
        winnerName,
        studentId: studentId || null,
        department: department || null,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        prize: prize || null,
      },
    });

    return NextResponse.json({ success: true, winner: newWinner });
  } catch (error) {
    console.error('Error creating event winner:', error);
    return NextResponse.json({ error: 'Failed to record event winner' }, { status: 500 });
  }
}
