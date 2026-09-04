'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Plus,
  Bell,
  CheckCircle2,
  Mail,
  Users,
  Trash2,
  UserCheck,
  Search,
  Crown,
  GraduationCap,
  Image as ImageIcon,
  Trophy,
  Award,
  Edit,
  Megaphone,
  ExternalLink,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { ODListModal } from './ODListModal';
import { useLanguage } from '@/lib/i18n';
import { ImagePicker } from './ImagePicker';
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

interface StudentItem {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  department: string | null;
  year: string | null;
  section: string | null;
  phone: string | null;
  role: string;
  profileCompleted: boolean;
  executiveProfile?: {
    designation: string;
  } | null;
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
  userId?: string;
  name: string;
  designation: string;
  department: string;
  photo: string;
}

interface TeamMember {
  id: string;
  userId?: string;
  name: string;
  designation: string;
  department: string | null;
  year: string | null;
  photo: string;
}

interface ManagementDashboardProps {
  activeTab?: string;
  setActiveTab?: (t: string) => void;
}

export function ManagementDashboard({ activeTab = 'dashboard', setActiveTab }: ManagementDashboardProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState(activeTab);
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsWithWinners, setEventsWithWinners] = useState<EventWithWinners[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [staffCoordinators, setStaffCoordinators] = useState<StaffMember[]>([]);
  const [studentLeadership, setStudentLeadership] = useState<TeamMember[]>([]);
  const [executives, setExecutives] = useState<TeamMember[]>([]);
  const [odModalOpen, setOdModalOpen] = useState(false);

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('10:00 AM');
  const [eventEnd, setEventEnd] = useState('01:00 PM');
  const [eventVenue, setEventVenue] = useState('');
  const [eventPoster, setEventPoster] = useState('');
  const [eventRegUrl, setEventRegUrl] = useState('');
  const [eventStatus, setEventStatus] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');

  // New Announcement Form State
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  // Event Winner Form State
  const [showWinnerForm, setShowWinnerForm] = useState(false);
  const [winEventId, setWinEventId] = useState('');
  const [winPosition, setWinPosition] = useState('1ST_PLACE');
  const [winTitle, setWinTitle] = useState('🥇 1st Place - Gold Trophy');
  const [winName, setWinName] = useState('');
  const [winStudentId, setWinStudentId] = useState('');
  const [winDept, setWinDept] = useState('CSE');
  const [winPhoto, setWinPhoto] = useState('');
  const [winPrize, setWinPrize] = useState('');

  // Team Leadership Management State
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamRoleCategory, setTeamRoleCategory] = useState<'STAFF' | 'STUDENT_LEADERSHIP' | 'EXECUTIVE'>('STUDENT_LEADERSHIP');
  const [teamDesignation, setTeamDesignation] = useState('PRESIDENT');
  const [teamDept, setTeamDept] = useState('CSE');
  const [teamYear, setTeamYear] = useState('4th Year');
  const [teamPhoto, setTeamPhoto] = useState('');

  // Role Management Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [targetRole, setTargetRole] = useState<'STUDENT' | 'EXECUTIVE'>('STUDENT');
  const [targetDesignation, setTargetDesignation] = useState<string>('EXECUTIVE_MEMBER');
  const [updatingRole, setUpdatingRole] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab) setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [evRes, stRes, annRes, teamRes, winRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/students'),
        fetch('/api/announcements'),
        fetch('/api/team'),
        fetch('/api/winners'),
      ]);

      if (evRes.ok) {
        const d = await evRes.json();
        setEvents(d.events || []);
        if (d.events?.[0]) setWinEventId(d.events[0].id);
      }

      if (stRes.ok) {
        const d = await stRes.json();
        setStudents(d.students || []);
      }

      if (annRes.ok) {
        const d = await annRes.json();
        setAnnouncements(d.announcements || []);
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
      console.error('Error fetching management data:', err);
    }
  }

  const openCreateEventModal = (defaultStatus: 'UPCOMING' | 'COMPLETED' = 'UPCOMING') => {
    setEditingEvent(null);
    setEventTitle('');
    setEventDesc('');
    setEventDate('');
    setEventVenue('');
    setEventRegUrl('');
    setEventPoster('');
    setEventStatus(defaultStatus);
    setShowEventForm(true);
  };

  const openEditEventModal = (ev: EventItem) => {
    setEditingEvent(ev);
    setEventTitle(ev.title);
    setEventDesc(ev.description);
    setEventDate(ev.date);
    setEventStart(ev.startTime);
    setEventEnd(ev.endTime);
    setEventVenue(ev.venue);
    setEventPoster(ev.posterUrl || '');
    setEventRegUrl(ev.registrationUrl || '');
    setEventStatus(ev.status as any);
    setShowEventForm(true);
  };

  const openEditTeamModal = (member: TeamMember | StaffMember, category: 'STAFF' | 'STUDENT_LEADERSHIP' | 'EXECUTIVE') => {
    setTeamName(member.name);
    setTeamRoleCategory(category);
    setTeamDesignation(member.designation);
    setTeamDept(member.department || 'CSE');
    setTeamYear((member as TeamMember).year || '3rd Year');
    setTeamPhoto(member.photo);
    setShowTeamForm(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDesc,
          date: eventDate,
          startTime: eventStart,
          endTime: eventEnd,
          venue: eventVenue,
          posterUrl: eventPoster || null,
          registrationUrl: eventRegUrl || null,
          status: eventStatus,
        }),
      });

      if (res.ok) {
        setMessage(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        setShowEventForm(false);
        setEditingEvent(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          email: teamEmail,
          roleCategory: teamRoleCategory,
          designation: teamDesignation,
          department: teamDept,
          year: teamYear,
          photo: teamPhoto,
        }),
      });

      if (res.ok) {
        setMessage(`Updated team member ${teamName}!`);
        setShowTeamForm(false);
        setTeamName('');
        setTeamPhoto('');
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save team member');
      }
    } catch (err) {
      console.error('Save team member failed:', err);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          priority: annPriority,
        }),
      });

      if (res.ok) {
        setMessage('Announcement published successfully!');
        setShowAnnForm(false);
        setAnnTitle('');
        setAnnContent('');
        setAnnPriority('MEDIUM');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Announcement deleted.');
        fetchData();
      }
    } catch (err) {
      console.error('Delete announcement failed:', err);
    }
  };

  const handleCreateWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winEventId || !winName) return;

    try {
      const res = await fetch('/api/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: winEventId,
          position: winPosition,
          title: winTitle,
          winnerName: winName,
          studentId: winStudentId,
          department: winDept,
          photoUrl: winPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          prize: winPrize,
        }),
      });

      if (res.ok) {
        setMessage(`Recorded winner ${winName} for the event!`);
        setShowWinnerForm(false);
        setWinName('');
        setWinStudentId('');
        setWinPrize('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create winner:', err);
    }
  };

  const handleRoleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setUpdatingRole(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedStudent.id,
          role: targetRole,
          designation: targetDesignation,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Updated ${selectedStudent.name}'s status to ${targetRole} (${targetDesignation})!`);
        setSelectedStudent(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to update user role');
      }
    } catch (err) {
      console.error('Error assigning role:', err);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('Event deleted.');
        fetchData();
      }
    } catch (err) {
      console.error('Delete event failed:', err);
    }
  };

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

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedEvents = events.filter((e) => e.status === 'COMPLETED');
  const upcomingEvents = events.filter((e) => e.status === 'UPCOMING');

  const greeting = getGreeting();
  const dailyMotivation = getDailyMotivationQuote();

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Glass Header Banner */}
      <div className="glass-header text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#2F6F7E] text-white uppercase tracking-wider shadow-xs">
                {t('operationsHub')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {greeting}, {user?.name || 'Staff Coordinator'}! 👋
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm font-normal">
              {t('portalTitle')} &bull; {t('eventManagement')} &bull; {t('cpdcTeam')}
            </p>
          </div>

          <button
            onClick={() => setOdModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D4A72C] hover:bg-[#b88d1d] text-[#163A5F] font-bold text-xs rounded-xl shadow-md transition shrink-0 self-start sm:self-center"
          >
            <Mail className="w-4 h-4" />
            <span>{t('generateODList')}</span>
          </button>
        </div>
      </div>

      {/* 2. Standalone Separate Daily Motivation Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-[#D4A72C]/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D4A72C]/20 border border-[#D4A72C]/50 text-[#163A5F] flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-[#C58A1A] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C58A1A] bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200/80">
                ✨ Daily Motivation
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#1F2933] italic">
              "{dailyMotivation.quote}"
            </p>
          </div>
        </div>
        <div className="self-end sm:self-center shrink-0">
          <span className="text-xs font-extrabold text-[#163A5F] bg-white px-3 py-1.5 rounded-xl border border-[#D9DEE3] shadow-xs">
            — {dailyMotivation.author}
          </span>
        </div>
      </div>

      {/* 2. Glass KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-hover p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-medium">{t('studentRoster')}</span>
            <Users className="w-4 h-4 text-[#163A5F]" />
          </div>
          <p className="text-2xl font-bold text-[#1F2933]">{students.length}</p>
        </div>

        <div className="glass-card-hover p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-medium">{t('scheduledDrives')}</span>
            <Calendar className="w-4 h-4 text-[#2F6F7E]" />
          </div>
          <p className="text-2xl font-bold text-[#1F2933]">{upcomingEvents.length}</p>
        </div>

        <div className="glass-card-hover p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-medium">{t('announcements')}</span>
            <Bell className="w-4 h-4 text-[#C58A1A]" />
          </div>
          <p className="text-2xl font-bold text-[#1F2933]">{announcements.length}</p>
        </div>

        <div className="glass-card-hover p-4 rounded-xl space-y-1 border-l-4 border-l-[#D4A72C]">
          <div className="flex items-center justify-between text-[#667085]">
            <span className="text-xs font-medium">{t('eventWinners')}</span>
            <Trophy className="w-4 h-4 text-[#D4A72C]" />
          </div>
          <p className="text-2xl font-bold text-[#1F2933]">
            {eventsWithWinners.reduce((acc, ev) => acc + (ev.winners?.length || 0), 0)}
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50/90 backdrop-blur-xs border border-emerald-200 text-[#3F7D58] text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-[#3F7D58]" />
          <span>{message}</span>
        </div>
      )}

      {/* 3. TAB: CPDC TEAM & LEADERSHIP MANAGEMENT */}
      {currentTab === 'team' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9DEE3]/70 pb-3 gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#163A5F]" />
                {t('cpdcTeam')} & Leadership Management
              </h2>
              <p className="text-xs text-[#667085]">
                Add, edit, change positions, and update photos for Staff Coordinators, Student Leaders & Executive Team.
              </p>
            </div>

            <button
              onClick={() => {
                setTeamName('');
                setTeamEmail('');
                setTeamPhoto('');
                setTeamRoleCategory('STUDENT_LEADERSHIP');
                setTeamDesignation('PRESIDENT');
                setShowTeamForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <UserPlus className="w-4 h-4 text-[#D4A72C]" />
              <span>+ Add / Manage Team Leader & Photos</span>
            </button>
          </div>

          {/* ADD / EDIT TEAM MEMBER MODAL */}
          {showTeamForm && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <form onSubmit={handleSaveTeamMember} className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100 my-8">
                <div className="flex items-center justify-between border-b border-[#D9DEE3] pb-3">
                  <h3 className="text-sm font-bold text-[#163A5F]">
                    Add / Edit Team Member & Profile Photo
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="text-[#667085] hover:text-[#1F2933]"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2933] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2933] mb-1">Team Category *</label>
                    <select
                      value={teamRoleCategory}
                      onChange={(e) => setTeamRoleCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#163A5F]"
                    >
                      <option value="STAFF">Staff & Faculty Advisor</option>
                      <option value="STUDENT_LEADERSHIP">Student Leadership (President/VP/Secretary/Treasurer)</option>
                      <option value="EXECUTIVE">Executive Member</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2933] mb-1">Designation / Position *</label>
                    {teamRoleCategory === 'STUDENT_LEADERSHIP' ? (
                      <select
                        value={teamDesignation}
                        onChange={(e) => setTeamDesignation(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#163A5F]"
                      >
                        <option value="PRESIDENT">President</option>
                        <option value="VICE_PRESIDENT">Vice President</option>
                        <option value="SECRETARY">Secretary</option>
                        <option value="TREASURER">Treasurer</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        value={teamDesignation}
                        onChange={(e) => setTeamDesignation(e.target.value)}
                        placeholder="e.g. Faculty Advisor / Executive"
                        className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2933] mb-1">Department</label>
                    <input
                      type="text"
                      value={teamDept}
                      onChange={(e) => setTeamDept(e.target.value)}
                      placeholder="e.g. CSE / IT"
                      className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2933] mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={teamYear}
                      onChange={(e) => setTeamYear(e.target.value)}
                      placeholder="e.g. 4th Year"
                      className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                    />
                  </div>
                </div>

                {/* Device File Explorer Image Picker */}
                <div>
                  <ImagePicker
                    label="Profile Photo (Select Picture from Computer / Device)"
                    value={teamPhoto}
                    onChange={setTeamPhoto}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DEE3]">
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="px-4 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#667085]"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#163A5F] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#102a46]"
                  >
                    Save Team Member & Photo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STAFF & FACULTY ADVISORS SECTION */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163A5F] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#2F6F7E]" /> {t('staffCoordinators')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staffCoordinators.map((staff) => (
                <div key={staff.id} className="glass-card-hover p-4 rounded-xl flex items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3.5">
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

                  <button
                    onClick={() => openEditTeamModal(staff, 'STAFF')}
                    className="p-2 text-slate-500 hover:text-[#163A5F] rounded-lg border border-[#D9DEE3] bg-white transition shadow-xs"
                    title="Edit Member & Photo"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#D4A72C]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* STUDENT LEADERSHIP TEAM SECTION */}
          <div className="space-y-3 pt-3 border-t border-[#D9DEE3]/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#163A5F] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4A72C]" /> {t('studentLeadership')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {studentLeadership.map((member) => (
                <div key={member.id} className="glass-card-hover p-4 rounded-xl text-center space-y-2 relative group">
                  <button
                    onClick={() => openEditTeamModal(member, 'STUDENT_LEADERSHIP')}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full border border-[#D9DEE3] text-slate-600 hover:text-[#163A5F] shadow-xs transition"
                    title="Edit Leader & Photo"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#D4A72C]" />
                  </button>

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

          {/* EXECUTIVE MEMBERS SECTION */}
          {executives.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#D9DEE3]/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#2F6F7E]" /> {t('executiveMembers')} ({executives.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {executives.map((member) => (
                  <div key={member.id} className="glass-card-hover p-3 rounded-xl text-center space-y-1.5 relative">
                    <button
                      onClick={() => openEditTeamModal(member, 'EXECUTIVE')}
                      className="absolute top-1.5 right-1.5 p-1 bg-white rounded-full border border-[#D9DEE3] text-slate-600 hover:text-[#163A5F]"
                      title="Edit Executive & Photo"
                    >
                      <Edit className="w-3 h-3 text-[#D4A72C]" />
                    </button>

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

      {/* 4. TAB: ANNOUNCEMENTS MANAGEMENT */}
      {currentTab === 'announcements' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9DEE3]/70 pb-3 gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#C58A1A]" />
                {t('officialAnnouncements')} & Notification Management
              </h2>
              <p className="text-xs text-[#667085]">
                Publish official campus circulars, placement notices, and competition alerts for all students.
              </p>
            </div>

            <button
              onClick={() => setShowAnnForm(!showAnnForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <Megaphone className="w-4 h-4 text-[#D4A72C]" />
              <span>+ Add Announcement / Publish Notice</span>
            </button>
          </div>

          {/* Add Announcement Form */}
          {showAnnForm && (
            <form onSubmit={handleCreateAnnouncement} className="bg-[#F7F8F5]/90 backdrop-blur-md p-5 rounded-xl border border-[#D9DEE3] space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#163A5F]">Create Campus Notice</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Notice Title *</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Registration Open: Global Placement Drive 2026"
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Priority Level *</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#163A5F] bg-white"
                  >
                    <option value="HIGH">HIGH Priority (Urgent Notice)</option>
                    <option value="MEDIUM">MEDIUM Priority (General Notice)</option>
                    <option value="LOW">LOW Priority (Information Notice)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">Notice Content / Details *</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Provide full description of the announcement..."
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnForm(false)}
                  className="px-4 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#667085]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          )}

          {/* Announcements List */}
          {announcements.length === 0 ? (
            <div className="p-8 text-center text-[#667085] text-xs">
              No active announcements published yet. Click above to broadcast a notice!
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-xl bg-[#F7F8F5]/80 border border-[#D9DEE3] flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ann.priority === 'HIGH'
                            ? 'bg-amber-100 text-[#C58A1A] border border-amber-300'
                            : 'bg-blue-50 text-[#163A5F] border border-blue-200'
                        }`}
                      >
                        {ann.priority} Priority
                      </span>
                      <span className="text-[11px] text-[#667085]">
                        Published on {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#1F2933] text-sm">{ann.title}</h3>
                    <p className="text-xs text-[#667085] leading-relaxed">{ann.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition shrink-0"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5. TAB 2: PREVIOUS EVENTS & PHOTO GALLERY MANAGEMENT */}
      {currentTab === 'previous_events' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9DEE3]/70 pb-3 gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#2F6F7E]" />
                {t('previousEvents')} & Photo Gallery Management
              </h2>
              <p className="text-xs text-[#667085]">
                Upload, edit event photo links, and archive past workshops & hackathons.
              </p>
            </div>

            <button
              onClick={() => openCreateEventModal('COMPLETED')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4A72C]" />
              <span>+ Add / Upload Previous Event & Photos</span>
            </button>
          </div>

          {completedEvents.length === 0 ? (
            <div className="p-8 text-center text-[#667085] text-xs">
              No previous events recorded yet. Click above to add past event photos!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="glass-card-hover rounded-xl overflow-hidden flex flex-col justify-between"
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

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
                        <span>📅 {ev.date}</span>
                        <span>📍 {ev.venue}</span>
                      </div>
                      <h3 className="font-bold text-[#1F2933] text-sm leading-snug">{ev.title}</h3>
                      <p className="text-xs text-[#667085] line-clamp-2 mt-1">{ev.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#D9DEE3] mt-2">
                      <button
                        onClick={() => openEditEventModal(ev)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-lg transition"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#D4A72C]" /> Edit / Add Photos
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                        title="Delete Previous Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 6. TAB 3: EVENT WINNERS MANAGEMENT */}
      {currentTab === 'winners' && (
        <section className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9DEE3]/70 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#163A5F] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#D4A72C]" />
                {t('winnerChampions')}
              </h2>
              <p className="text-xs text-[#667085]">
                {t('eventWinners')} &bull; CPDC competitions & skill drives.
              </p>
            </div>
            <button
              onClick={() => setShowWinnerForm(!showWinnerForm)}
              className="px-3.5 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white font-semibold text-xs rounded-xl shadow transition"
            >
              + Add Event Winner
            </button>
          </div>

          {/* Add Winner Form */}
          {showWinnerForm && (
            <form onSubmit={handleCreateWinner} className="bg-[#F7F8F5]/90 backdrop-blur-md p-5 rounded-xl border border-[#D9DEE3] space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#163A5F]">Record Winner for an Event</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Select Event *</label>
                  <select
                    value={winEventId}
                    onChange={(e) => setWinEventId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-medium bg-white"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Position / Rank *</label>
                  <select
                    value={winPosition}
                    onChange={(e) => setWinPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-medium bg-white"
                  >
                    <option value="1ST_PLACE">1st Place (Winner)</option>
                    <option value="2ND_PLACE">2nd Place (Runner Up)</option>
                    <option value="3RD_PLACE">3rd Place (2nd Runner Up)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Position Title / Award *</label>
                  <input
                    type="text"
                    required
                    value={winTitle}
                    onChange={(e) => setWinTitle(e.target.value)}
                    placeholder="e.g. 🥇 1st Place - Gold Trophy"
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Winner Student Name *</label>
                  <input
                    type="text"
                    required
                    value={winName}
                    onChange={(e) => setWinName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Student ID (Optional)</label>
                  <input
                    type="text"
                    value={winStudentId}
                    onChange={(e) => setWinStudentId(e.target.value)}
                    placeholder="e.g. 23CS105"
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Department</label>
                  <input
                    type="text"
                    value={winDept}
                    onChange={(e) => setWinDept(e.target.value)}
                    placeholder="e.g. CSE / IT"
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                  />
                </div>
              </div>

              <div>
                <ImagePicker
                  label="Winner Photo (Select File from Computer / Device)"
                  value={winPhoto}
                  onChange={setWinPhoto}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">Prize Details / Award Description</label>
                <input
                  type="text"
                  value={winPrize}
                  onChange={(e) => setWinPrize(e.target.value)}
                  placeholder="e.g. Rs. 10,000 Cash Prize + Gold Medal"
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWinnerForm(false)}
                  className="px-4 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#667085]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#163A5F] text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Publish Event Winner
                </button>
              </div>
            </form>
          )}

          {/* List of Events & Winners */}
          <div className="space-y-6">
            {eventsWithWinners.map((ev) => (
              <div key={ev.id} className="p-5 rounded-xl bg-[#F7F8F5]/80 border border-[#D9DEE3] space-y-4">
                <div className="flex items-center justify-between border-b border-[#D9DEE3] pb-2">
                  <div>
                    <h3 className="font-bold text-[#1F2933] text-sm">{ev.title}</h3>
                    <p className="text-xs text-[#667085]">📅 {ev.date} &bull; 📍 {ev.venue}</p>
                  </div>
                  <span className="text-xs font-bold text-[#D4A72C] bg-white px-2.5 py-1 rounded border border-[#D9DEE3]">
                    {ev.winners?.length || 0} Winner(s)
                  </span>
                </div>

                {(!ev.winners || ev.winners.length === 0) ? (
                  <p className="text-xs text-[#667085] italic">No winners added yet for this event.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ev.winners.map((win) => (
                      <div key={win.id} className="glass-card-hover rounded-xl p-4 flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4A72C] shrink-0">
                          <img
                            src={win.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={win.winnerName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#163A5F] bg-[#D4A72C]/20 px-2 py-0.5 rounded">
                            {win.title}
                          </span>
                          <h4 className="font-bold text-[#1F2933] text-xs pt-0.5">{win.winnerName}</h4>
                          <p className="text-[11px] text-[#667085]">{win.department} {win.studentId ? `(${win.studentId})` : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. TAB 4: EVENT MANAGEMENT */}
      {(currentTab === 'events' || currentTab === 'dashboard') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1F2933]">{t('eventManagement')}</h2>
            <button
              onClick={() => openCreateEventModal('UPCOMING')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#163A5F] hover:bg-[#102a46] text-white text-xs font-semibold rounded-xl shadow transition"
            >
              <Plus className="w-4 h-4" /> {t('addEvent')}
            </button>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="glass-card-hover rounded-xl p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ev.status === 'UPCOMING'
                          ? 'bg-[#163A5F]/10 text-[#163A5F]'
                          : 'bg-emerald-50 text-[#3F7D58]'
                      }`}
                    >
                      {ev.status === 'UPCOMING' ? t('upcomingEvent') : t('completedEvent')}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditEventModal(ev)}
                        className="text-slate-600 hover:text-[#163A5F] p-1"
                        title="Edit Event / Photos"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-[#667085] hover:text-[#B54747] p-1"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#1F2933] text-sm leading-snug">{ev.title}</h3>
                  <p className="text-[#667085] text-xs line-clamp-2">{ev.description}</p>

                  <div className="text-xs text-[#667085] font-medium space-y-1 pt-1">
                    <p>📅 {ev.date} ({ev.startTime})</p>
                    <p>📍 {ev.venue}</p>
                    {ev.registrationUrl && (
                      <a
                        href={ev.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163A5F] hover:underline pt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#D4A72C]" />
                        <span>📝 Open Google Form</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT EVENT & PHOTO MODAL */}
      {showEventForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveEvent} className="bg-white max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-[#D9DEE3] pb-3">
              <h3 className="text-sm font-bold text-[#163A5F]">
                {editingEvent ? 'Edit Event & Upload Photos' : 'Add New Event & Upload Photo'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                className="text-[#667085] hover:text-[#1F2933]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('eventTitle')} *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Annual Hackathon & Career Expo"
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('venue')} *</label>
                <input
                  type="text"
                  required
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="e.g. Auditorium Hall"
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('eventStatus')} *</label>
                <select
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#163A5F]"
                >
                  <option value="UPCOMING">{t('upcomingEvent')}</option>
                  <option value="COMPLETED">{t('completedEvent')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('date')} *</label>
                <input
                  type="text"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. 15 September 2026"
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('time')}</label>
                <input
                  type="text"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2933] mb-1">{t('description')} *</label>
              <textarea
                required
                rows={3}
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                placeholder="Event details..."
                className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
              />
            </div>

            {/* Google Form Link Input */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                Google Form Registration Link / Application URL (Optional)
              </label>
              <input
                type="url"
                value={eventRegUrl}
                onChange={(e) => setEventRegUrl(e.target.value)}
                placeholder="https://forms.google.com/..."
                className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-normal text-[#1F2933]"
              />
            </div>

            {/* Device File Explorer Image Picker */}
            <div>
              <ImagePicker
                label="Event Poster / Photo Image (Select File from Computer / Device)"
                value={eventPoster}
                onChange={setEventPoster}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#D9DEE3]">
              <button
                type="button"
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#667085]"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#163A5F] text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                {t('saveEvent')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. TAB 5: STUDENT DIRECTORY */}
      {currentTab === 'students' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#163A5F]">{t('studentDirectory')}</h2>
              <p className="text-xs text-[#667085]">{t('assignRole')}</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter roster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-[#D9DEE3] rounded-lg text-xs font-normal"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F7F8F5] text-[#667085] uppercase font-bold text-[10px]">
                  <th className="p-3 rounded-l">{t('student')}</th>
                  <th className="p-3">Student ID</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year / Sec</th>
                  <th className="p-3">{t('eventStatus')}</th>
                  <th className="p-3 text-right rounded-r">{t('actionControl')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE3]">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F7F8F5]/80">
                    <td className="p-3 font-bold text-[#1F2933]">{st.name}</td>
                    <td className="p-3 text-[#667085] font-mono">{st.studentId || 'N/A'}</td>
                    <td className="p-3 text-[#667085]">{st.department || 'N/A'}</td>
                    <td className="p-3 text-[#667085]">{st.year} ({st.section})</td>
                    <td className="p-3">
                      {st.role === 'EXECUTIVE' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4A72C]/20 text-[#163A5F] border border-[#D4A72C]">
                          ★ {t('executive')} ({st.executiveProfile?.designation || 'Member'})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F8F5] text-[#667085] border border-[#D9DEE3]">
                          {t('student')}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudent(st);
                          setTargetRole(st.role as any);
                          setTargetDesignation(st.executiveProfile?.designation || 'EXECUTIVE_MEMBER');
                        }}
                        className="px-3 py-1 bg-white hover:bg-[#F7F8F5] text-[#163A5F] font-semibold text-[11px] rounded-md border border-[#D9DEE3] transition shadow-xs"
                      >
                        {t('manageRole')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Manager Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D9DEE3] pb-3">
              <h3 className="text-sm font-bold text-[#163A5F] flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4A72C]" />
                {t('assignRole')}
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-[#667085] hover:text-[#1F2933]">✕</button>
            </div>

            <p className="text-xs text-[#667085]">
              Target Student: <strong className="text-[#1F2933]">{selectedStudent.name}</strong> ({selectedStudent.studentId})
            </p>

            <form onSubmit={handleRoleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">Select System Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-medium bg-white"
                >
                  <option value="STUDENT">STUDENT ({t('student')})</option>
                  <option value="EXECUTIVE">EXECUTIVE ({t('executive')})</option>
                </select>
              </div>

              {targetRole === 'EXECUTIVE' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1F2933] mb-1">Assign Leadership Position</label>
                  <select
                    value={targetDesignation}
                    onChange={(e) => setTargetDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D9DEE3] rounded-lg text-xs font-medium bg-white"
                  >
                    <option value="PRESIDENT">{t('president')}</option>
                    <option value="VICE_PRESIDENT">{t('vicePresident')}</option>
                    <option value="SECRETARY">{t('secretary')}</option>
                    <option value="TREASURER">{t('treasurer')}</option>
                    <option value="EXECUTIVE_MEMBER">{t('executiveMember')}</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border border-[#D9DEE3] rounded-lg text-xs font-semibold text-[#667085]"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={updatingRole}
                  className="px-4 py-2 bg-[#163A5F] text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  {updatingRole ? 'Updating...' : t('saveRoleStatus')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OD List Interactive Modal */}
      <ODListModal
        isOpen={odModalOpen}
        onClose={() => setOdModalOpen(false)}
        events={events}
        students={students}
      />
    </div>
  );
}
