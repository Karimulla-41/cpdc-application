'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Award,
  Bell,
  CheckCircle2,
  Users,
  Trophy,
  Image as ImageIcon,
  UserCheck,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { CardSkeleton } from './Skeleton';
import { useLanguage } from '@/lib/i18n';
import { getGreeting, getDailyMotivationQuote } from '@/lib/motivation';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  posterUrl: string | null;
  registrationUrl: string | null;
  status: string;
}

interface WinnerItem {
  id: string;
  eventId: string;
  position: string;
  title: string;
  winnerName: string;
  studentId: string | null;
  department: string | null;
  photoUrl: string | null;
  prize: string | null;
  event: EventItem;
}

interface EventWithWinners extends EventItem {
  winners: WinnerItem[];
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: string;
  createdAt: string;
}

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  photo: string;
}

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  department: string | null;
  year: string | null;
  photo: string;
}

interface AttendanceStats {
  attendedCount: number;
  totalEvents: number;
  attendancePercentage: number;
}

interface StudentDashboardProps {
  activeTab?: string;
}

export function StudentDashboard({ activeTab = 'all' }: StudentDashboardProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsWithWinners, setEventsWithWinners] = useState<EventWithWinners[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [staffCoordinators, setStaffCoordinators] = useState<StaffMember[]>([]);
  const [studentLeadership, setStudentLeadership] = useState<TeamMember[]>([]);
  const [executives, setExecutives] = useState<TeamMember[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    attendedCount: 0,
    totalEvents: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [evRes, annRes, attRes, teamRes, winRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements'),
          fetch('/api/attendance'),
          fetch('/api/team'),
          fetch('/api/winners'),
        ]);

        if (evRes.ok) {
          const d = await evRes.json();
          setEvents(d.events || []);
        }

        if (annRes.ok) {
          const d = await annRes.json();
          setAnnouncements(d.announcements || []);
        }

        if (attRes.ok) {
          const d = await attRes.json();
          setAttendanceStats(
            d.stats || { attendedCount: 0, totalEvents: 0, attendancePercentage: 0 }
          );
        }

        if (teamRes.ok) {
          const d = await teamRes.json();
          setStaffCoordinators(d.staffCoordinators || []);
          setStudentLeadership(d.studentLeadership || []);
          setExecutives(d.executives || []);
        }

        if (winRes.ok) {
          const d = await winRes.json();
          setEventsWithWinners(d.eventsWithWinners || []);
        }
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDesignation = (desig: string) => {
    switch (desig) {
      case 'PRESIDENT':
        return t('president');
      case 'VICE_PRESIDENT':
        return t('vicePresident');
      case 'SECRETARY':
        return t('secretary');
      case 'TREASURER':
        return t('treasurer');
      default:
        return desig || t('executiveMember');
    }
  };

  const upcomingEvents = events.filter((e) => e.status === 'UPCOMING');
  const completedEvents = events.filter((e) => e.status === 'COMPLETED');

  const greeting = getGreeting();
  const dailyMotivation = getDailyMotivationQuote();

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Glass Header Banner */}
      <div className="glass-header text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {greeting}, {user?.name || t('student')}! 👋
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm font-normal">
              {t('portalTitle')} &bull; Dhaanish Chennai &bull; {t('careerHub')}
            </p>

            {/* Daily Motivational Card */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-200 font-medium shadow-xs">
                <Sparkles className="w-4 h-4 text-[#D4A72C] shrink-0 animate-pulse" />
                <span>"{dailyMotivation.quote}" &bull; <strong className="text-white font-bold">{dailyMotivation.author}</strong></span>
              </div>
            </div>
          </div>

          {/* Glass Attendance Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 shrink-0 min-w-[220px] shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-[#D4A72C] text-[#163A5F] flex items-center justify-center font-bold text-xl shadow">
              {attendanceStats.attendancePercentage}%
            </div>
            <div>
              <p className="text-xs text-slate-200 font-normal">{t('myAttendance')}</p>
              <p className="text-base font-bold text-white">
                {attendanceStats.attendedCount} / {attendanceStats.totalEvents} Events
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW: EVENT WINNERS TAB */}
      {activeTab === 'winners' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="border-b border-[#D9DEE3]/70 pb-3">
            <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4A72C]" />
              {t('winnerChampions')}
            </h2>
            <p className="text-xs text-[#667085]">
              {t('eventWinners')} &bull; Dhaanish Chennai competitions & skill championships.
            </p>
          </div>

          {eventsWithWinners.filter(e => e.winners && e.winners.length > 0).length === 0 ? (
            <div className="p-8 text-center text-[#667085] text-xs">
              No event winners announced yet.
            </div>
          ) : (
            <div className="space-y-8">
              {eventsWithWinners
                .filter((e) => e.winners && e.winners.length > 0)
                .map((ev) => (
                  <div key={ev.id} className="p-5 rounded-xl bg-[#F7F8F5]/80 border border-[#D9DEE3] space-y-4">
                    {/* Event Detail Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9DEE3] pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#163A5F] bg-white px-2 py-0.5 rounded border border-[#D9DEE3]">
                          {t('portalTitle')}
                        </span>
                        <h3 className="font-bold text-[#1F2933] text-base pt-1">{ev.title}</h3>
                        <p className="text-xs text-[#667085] flex items-center gap-3 mt-0.5">
                          <span>📅 {ev.date}</span>
                          <span>📍 {ev.venue}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#D4A72C] bg-white px-3 py-1 rounded-md border border-[#D9DEE3] self-start sm:self-center shadow-xs">
                        🏆 {ev.winners.length} Winner(s)
                      </span>
                    </div>

                    {/* Winners Glass Hover Cards List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ev.winners.map((win) => (
                        <div
                          key={win.id}
                          className="glass-card-hover rounded-xl p-4 flex items-center gap-4 relative overflow-hidden"
                        >
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4A72C] shrink-0 shadow-sm">
                            <img
                              src={
                                win.photoUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={win.winnerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#163A5F] bg-[#D4A72C]/20 px-2 py-0.5 rounded">
                              {win.title}
                            </span>
                            <h4 className="font-bold text-[#1F2933] text-sm pt-0.5">{win.winnerName}</h4>
                            <p className="text-xs text-[#667085]">
                              {win.department || t('student')} {win.studentId ? `(${win.studentId})` : ''}
                            </p>
                            {win.prize && (
                              <p className="text-[11px] font-semibold text-[#3F7D58] pt-1">🎁 {win.prize}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW: PREVIOUS EVENTS & PHOTOS TAB */}
      {activeTab === 'previous_events' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9DEE3]/70 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#2F6F7E]" />
                {t('previousEvents')}
              </h2>
              <p className="text-xs text-[#667085]">
                {t('archivedPhotos')}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#163A5F] bg-[#F7F8F5] px-2.5 py-1 rounded border border-[#D9DEE3]">
              {completedEvents.length} {t('eventsArchived')}
            </span>
          </div>

          {completedEvents.length === 0 ? (
            <div className="p-8 text-center text-[#667085] text-xs">
              No previous events recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="glass-card-hover rounded-xl overflow-hidden space-y-3"
                >
                  <div className="relative h-48 w-full bg-[#F7F8F5]">
                    <img
                      src={
                        ev.posterUrl ||
                        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#163A5F]/90 text-[#D4A72C] text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                      {t('completedEvent')}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#667085]">
                      <span>📅 {ev.date}</span>
                      <span>📍 {ev.venue}</span>
                    </div>
                    <h3 className="font-bold text-[#1F2933] text-sm leading-snug">{ev.title}</h3>
                    <p className="text-xs text-[#667085] line-clamp-2">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW: MAIN DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Upcoming Events */}
          <div className="lg:col-span-2 space-y-6">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#1F2933] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#163A5F]" />
                  {t('upcomingEvents')}
                </h2>
                <span className="text-xs text-[#667085] bg-white px-2.5 py-1 rounded-md border border-[#D9DEE3]">
                  {upcomingEvents.length} {t('scheduledDrives')}
                </span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="glass-card p-6 rounded-xl text-center text-[#667085] text-xs">
                  No upcoming events scheduled right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="glass-card-hover rounded-xl p-5 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#163A5F] bg-[#163A5F]/10 px-2 py-0.5 rounded">
                            {t('upcomingEvent')}
                          </span>
                          <span className="text-xs text-[#667085] font-medium">{ev.date}</span>
                        </div>
                        <h3 className="font-bold text-[#1F2933] text-sm leading-snug">{ev.title}</h3>
                        <p className="text-xs text-[#667085] line-clamp-2">{ev.description}</p>
                        <div className="text-xs text-[#667085] space-y-1 pt-1">
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {ev.startTime} - {ev.endTime}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.venue}
                          </p>
                        </div>
                      </div>

                      <div>
                        {ev.registrationUrl ? (
                          <a
                            href={ev.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-semibold text-xs rounded-lg transition shadow-xs"
                          >
                            <span>{t('registerForm')}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 bg-[#F7F8F5] text-[#667085] font-medium text-xs rounded-lg border border-[#D9DEE3] cursor-not-allowed"
                          >
                            {t('registrationOpening')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Attendance Records */}
            <section className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#163A5F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F7D58]" />
                {t('myAttendanceLogs')}
              </h2>
              <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#D9DEE3] text-xs text-[#667085]">
                Attendance is verified dynamically during active events via CPDC QR check-ins.
              </div>
            </section>
          </div>

          {/* Right 1 Column: Announcements Sidebar */}
          <div className="space-y-6">
            <section className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9DEE3]/70 pb-3">
                <h2 className="text-sm font-bold text-[#163A5F] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C58A1A]" />
                  {t('announcements')}
                </h2>
                <span className="text-[10px] font-bold text-[#163A5F] bg-[#F7F8F5] px-2 py-0.5 rounded border border-[#D9DEE3]">
                  Live Hub
                </span>
              </div>

              {announcements.length === 0 ? (
                <p className="text-xs text-[#667085]">No active announcements.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3.5 rounded-xl bg-[#F7F8F5]/80 border border-[#D9DEE3] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            ann.priority === 'HIGH'
                              ? 'bg-amber-100 text-[#C58A1A]'
                              : 'bg-blue-50 text-[#163A5F]'
                          }`}
                        >
                          {ann.priority}
                        </span>
                        <span className="text-[10px] text-[#667085]">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1F2933] text-xs">{ann.title}</h4>
                      <p className="text-[11px] text-[#667085] leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* VIEW: CPDC TEAM & LEADERSHIP TAB */}
      {(activeTab === 'team' || activeTab === 'all') && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="border-b border-[#D9DEE3]/70 pb-3">
            <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#163A5F]" />
              {t('cpdcTeam')}
            </h2>
            <p className="text-xs text-[#667085]">
              {t('appointedTeam')}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163A5F] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#2F6F7E]" /> {t('staffCoordinators')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staffCoordinators.map((staff) => (
                <div key={staff.id} className="glass-card-hover p-4 rounded-xl flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D9DEE3] shrink-0 shadow-xs">
                    <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold text-[#163A5F] bg-white px-2 py-0.5 rounded border border-[#D9DEE3] mb-1">
                      {staff.designation}
                    </span>
                    <h4 className="font-bold text-[#1F2933] text-sm">{staff.name}</h4>
                    <p className="text-xs text-[#667085]">{staff.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#D9DEE3]/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163A5F] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4A72C]" /> {t('studentLeadership')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {studentLeadership.map((member) => (
                <div key={member.id} className="glass-card-hover p-4 rounded-xl text-center space-y-2">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-[#D4A72C] shadow-xs">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold text-[#163A5F] bg-white px-2 py-0.5 rounded border border-[#D9DEE3] mb-0.5">
                      {formatDesignation(member.designation)}
                    </span>
                    <h4 className="font-bold text-[#1F2933] text-xs">{member.name}</h4>
                    <p className="text-[11px] text-[#667085]">{member.department} &bull; {member.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {executives.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#D9DEE3]/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#2F6F7E]" /> {t('executiveMembers')} ({executives.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {executives.map((member) => (
                  <div key={member.id} className="glass-card-hover p-3 rounded-xl text-center space-y-1.5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto border border-[#D9DEE3]">
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1F2933] text-xs">{member.name}</h5>
                      <p className="text-[10px] text-[#667085]">{member.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
