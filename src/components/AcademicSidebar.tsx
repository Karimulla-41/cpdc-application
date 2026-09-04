'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Image as ImageIcon,
  Users,
  UserCheck,
  Bell,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AcademicSidebar({
  activeTab,
  setActiveTab,
  onOpenProfile,
  isOpen = false,
  onClose
}: SidebarProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const isStaffOrAdmin = user?.role === 'STAFF_COORDINATOR' || user?.role === 'ADMIN';

  const studentNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'winners', label: t('eventWinners'), icon: Trophy },
    { id: 'previous_events', label: t('previousEvents'), icon: ImageIcon },
    { id: 'team', label: t('cpdcTeam'), icon: UserCheck },
    { id: 'announcements', label: t('announcements'), icon: Bell },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const staffNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'events', label: t('eventManagement'), icon: Calendar },
    { id: 'winners', label: t('eventWinners'), icon: Trophy },
    { id: 'previous_events', label: t('previousEvents'), icon: ImageIcon },
    { id: 'students', label: t('studentDirectory'), icon: Users },
    { id: 'team', label: t('cpdcTeam'), icon: UserCheck },
    { id: 'announcements', label: t('announcements'), icon: Bell },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const navItems = isStaffOrAdmin ? staffNavItems : studentNavItems;

  const getRoleDisplay = () => {
    if (!user) return 'Student';
    switch (user.role) {
      case 'ADMIN':
        return 'Platform Admin';
      case 'STAFF_COORDINATOR':
        return 'Staff Coordinator';
      case 'EXECUTIVE':
        return `Executive (${user.designation || 'Member'})`;
      default:
        return 'Student Member';
    }
  };

  const handleNavClick = (tabId: string) => {
    if (tabId === 'settings') {
      onOpenProfile();
    } else {
      setActiveTab(tabId);
    }
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop overlay to close sidebar when clicking outside */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#163A5F] text-white flex flex-col justify-between border-r border-navy-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Official CPDC Emblem Area */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-white border-2 border-[#D4A72C] shrink-0 shadow-sm overflow-hidden flex items-center justify-center p-0.5">
              <img
                src="/logo.png"
                alt="CPDC Official Emblem"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight text-white">
                {t('portalTitle')}
              </h1>
              <p className="text-[10px] text-slate-300 font-normal">Dhaanish Chennai</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition shadow-xs"
              title="Close Sidebar"
            >
              <X className="w-5 h-5 text-[#D4A72C]" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                  isActive
                    ? 'bg-[#2F6F7E] text-white shadow-md font-bold border-l-4 border-[#D4A72C]'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4A72C]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile Bar */}
        {user && (
          <div className="p-4 border-t border-white/10 bg-[#102a46]/60">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-3 text-left overflow-hidden hover:opacity-90 transition group"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0 bg-[#2F6F7E] flex items-center justify-center font-bold text-xs">
                  {user.image ? (
                    <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white group-hover:text-[#D4A72C] transition truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-300 font-medium truncate">{getRoleDisplay()}</p>
                </div>
              </button>

              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                title="Logout"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
