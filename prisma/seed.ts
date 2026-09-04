import { PrismaClient } from '@prisma/client';
import { Role, ExecutiveDesignation, EventStatus, Priority, AttendanceStatus } from '../src/types/models';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CPDC database...');

  // Clean existing tables
  await prisma.eventWinner.deleteMany();
  await prisma.oDListStudent.deleteMany();
  await prisma.oDList.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.cpdcUpdate.deleteMany();
  await prisma.executiveProfile.deleteMany();
  await prisma.staffCoordinator.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cpdc.edu.in',
      name: 'Dr. R. K. Sharma',
      role: Role.ADMIN,
      profileCompleted: true,
      department: 'Administration',
      phone: '+91 9876543210',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 2. Create Staff Coordinator 1
  const staffUser1 = await prisma.user.create({
    data: {
      email: 'staff1@cpdc.edu.in',
      name: 'Prof. Anitha Rao',
      role: Role.STAFF_COORDINATOR,
      profileCompleted: true,
      department: 'Computer Science & Engineering',
      phone: '+91 9876543211',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.staffCoordinator.create({
    data: {
      userId: staffUser1.id,
      department: 'CSE',
      designation: 'CPDC Senior Staff Coordinator',
    },
  });

  // 3. Create Staff Coordinator 2
  const staffUser2 = await prisma.user.create({
    data: {
      email: 'staff2@cpdc.edu.in',
      name: 'Dr. K. V. Sharma',
      role: Role.STAFF_COORDINATOR,
      profileCompleted: true,
      department: 'Information Technology',
      phone: '+91 9876543299',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.staffCoordinator.create({
    data: {
      userId: staffUser2.id,
      department: 'IT',
      designation: 'CPDC Faculty Advisor & Staff Coordinator',
    },
  });

  // 4. Create Executive President
  const presidentUser = await prisma.user.create({
    data: {
      email: 'president@cpdc.edu.in',
      name: 'Sarah Jenkins',
      role: Role.EXECUTIVE,
      profileCompleted: true,
      studentId: '23CS001',
      department: 'CSE',
      year: '4th Year',
      section: 'A',
      phone: '+91 9876543212',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.executiveProfile.create({
    data: {
      userId: presidentUser.id,
      designation: ExecutiveDesignation.PRESIDENT,
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      displayOrder: 1,
    },
  });

  // 5. Create Executive Vice President
  const vpUser = await prisma.user.create({
    data: {
      email: 'vp@cpdc.edu.in',
      name: 'Rohan Verma',
      role: Role.EXECUTIVE,
      profileCompleted: true,
      studentId: '23ECE014',
      department: 'ECE',
      year: '4th Year',
      section: 'B',
      phone: '+91 9876543213',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.executiveProfile.create({
    data: {
      userId: vpUser.id,
      designation: ExecutiveDesignation.VICE_PRESIDENT,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      displayOrder: 2,
    },
  });

  // 6. Create Executive Secretary
  const secretaryUser = await prisma.user.create({
    data: {
      email: 'secretary@cpdc.edu.in',
      name: 'Aarav Patel',
      role: Role.EXECUTIVE,
      profileCompleted: true,
      studentId: '23IT042',
      department: 'IT',
      year: '3rd Year',
      section: 'A',
      phone: '+91 9876543214',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.executiveProfile.create({
    data: {
      userId: secretaryUser.id,
      designation: ExecutiveDesignation.SECRETARY,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      displayOrder: 3,
    },
  });

  // 7. Create Executive Treasurer
  const treasurerUser = await prisma.user.create({
    data: {
      email: 'treasurer@cpdc.edu.in',
      name: 'Priya Sharma',
      role: Role.EXECUTIVE,
      profileCompleted: true,
      studentId: '23EEE009',
      department: 'EEE',
      year: '3rd Year',
      section: 'A',
      phone: '+91 9876543215',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.executiveProfile.create({
    data: {
      userId: treasurerUser.id,
      designation: ExecutiveDesignation.TREASURER,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      displayOrder: 4,
    },
  });

  // 8. Create 5 Selected Executive Team Members
  const execNames = [
    { name: 'Kavya Menon', email: 'exec1@cpdc.edu.in', dept: 'CSE', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { name: 'David Miller', email: 'exec2@cpdc.edu.in', dept: 'IT', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Ananya Roy', email: 'exec3@cpdc.edu.in', dept: 'ECE', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
    { name: 'Rahul Sundaram', email: 'exec4@cpdc.edu.in', dept: 'MECH', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' },
    { name: 'Neha Gupta', email: 'exec5@cpdc.edu.in', dept: 'AI&DS', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  ];

  for (let i = 0; i < execNames.length; i++) {
    const item = execNames[i];
    const u = await prisma.user.create({
      data: {
        email: item.email,
        name: item.name,
        role: Role.EXECUTIVE,
        profileCompleted: true,
        studentId: `23EX00${i + 1}`,
        department: item.dept,
        year: '3rd Year',
        section: 'A',
        phone: `+91 987654320${i + 1}`,
        profileImage: item.photo,
      },
    });

    await prisma.executiveProfile.create({
      data: {
        userId: u.id,
        designation: ExecutiveDesignation.EXECUTIVE_MEMBER,
        photo: item.photo,
        displayOrder: 5 + i,
      },
    });
  }

  // 9. Create Student A
  const studentA = await prisma.user.create({
    data: {
      email: 'studenta@cpdc.edu.in',
      name: 'Alex Johnson',
      role: Role.STUDENT,
      profileCompleted: true,
      studentId: '23CS105',
      department: 'CSE',
      year: '3rd Year',
      section: 'B',
      phone: '+91 9123456789',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 10. Create Student B
  const studentB = await prisma.user.create({
    data: {
      email: 'studentb@cpdc.edu.in',
      name: 'Kavya Nair',
      role: Role.STUDENT,
      profileCompleted: true,
      studentId: '23IT204',
      department: 'IT',
      year: '2nd Year',
      section: 'A',
      phone: '+91 9123456790',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  });

  // Create Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Resume Building & Portfolio Hackathon 2026',
      description: 'Master industry standard resume formatting, ATS optimization, and portfolio presentation guided by tech recruiters.',
      date: '28 August 2026',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'Seminar Hall 1',
      status: EventStatus.COMPLETED,
      posterUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
      registrationUrl: 'https://forms.google.com/sample-resume-workshop',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Aptitude & Technical Problem Solving Championship',
      description: 'Comprehensive boot camp focusing on quantitative reasoning, logical deduction, and DSA code walkthroughs.',
      date: '25 August 2026',
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      venue: 'Main Auditorium',
      status: EventStatus.COMPLETED,
      posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      registrationUrl: 'https://forms.google.com/sample-aptitude',
    },
  });

  const upcomingEvent1 = await prisma.event.create({
    data: {
      title: 'Global Placement Drive 2026 & Leadership Summit',
      description: 'Interact with top hiring managers from Fortune 500 tech companies and learn directly about summer internship opportunities.',
      date: '15 September 2026',
      startTime: '09:30 AM',
      endTime: '04:30 PM',
      venue: 'Campus Convention Center',
      status: EventStatus.UPCOMING,
      posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      registrationUrl: 'https://forms.google.com/placement-drive-2026',
    },
  });

  // Seed Event Winners
  await prisma.eventWinner.createMany({
    data: [
      {
        eventId: event1.id,
        position: '1ST_PLACE',
        title: '🥇 1st Place - Gold Trophy',
        winnerName: 'Alex Johnson',
        studentId: '23CS105',
        department: 'CSE',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        prize: 'Rs. 10,000 Cash Prize + Trophy',
      },
      {
        eventId: event1.id,
        position: '2ND_PLACE',
        title: '🥈 2nd Place - Silver Medal',
        winnerName: 'Kavya Nair',
        studentId: '23IT204',
        department: 'IT',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        prize: 'Rs. 5,000 Cash Prize + Certificate',
      },
      {
        eventId: event2.id,
        position: '1ST_PLACE',
        title: '🥇 1st Place - Champion Trophy',
        winnerName: 'Rohan Verma',
        studentId: '23ECE014',
        department: 'ECE',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        prize: 'Rs. 15,000 Cash Prize + Gold Medal',
      },
    ],
  });

  // Seed Attendance
  await prisma.attendance.createMany({
    data: [
      { eventId: event1.id, userId: studentA.id, status: AttendanceStatus.PRESENT },
      { eventId: event2.id, userId: studentA.id, status: AttendanceStatus.PRESENT },
      { eventId: event1.id, userId: studentB.id, status: AttendanceStatus.PRESENT },
    ],
  });

  // Seed Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Registration Open: Global Placement Drive 2026',
        content: 'Eligible 3rd & 4th year students can now register for the upcoming placement drive through the official Google Form.',
        priority: Priority.HIGH,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      },
    ],
  });

  // Seed CPDC Updates
  await prisma.cpdcUpdate.createMany({
    data: [
      {
        title: 'CPDC Executive Team 2026-2027 Announced',
        content: 'We are thrilled to welcome our new student executive leadership team for the upcoming academic session.',
        category: 'Club Announcement',
      },
    ],
  });

  console.log('CPDC Database successfully re-seeded with Event Winners & Executive Leadership!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
