'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenProfile?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function Navbar({
  title = 'Dashboard',
  onToggleSidebar,
  isSidebarOpen = false,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const getRoleLabel = () => {
    if (!user) return t('student');
    switch (user.role) {
      case 'ADMIN':
        return 'Admin';
      case 'STAFF_COORDINATOR':
        return 'Faculty Advisor';
      case 'EXECUTIVE':
        return t('executiveMember');
      default:
        return t('student');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#D9DEE3]/80 shadow-xs px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Clean Arrow Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-full bg-[#163A5F] hover:bg-[#102a46] text-white flex items-center justify-center transition shadow-xs"
            title={isSidebarOpen ? "Hide Side Options" : "Show Side Options"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-[#D4A72C]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#D4A72C]" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2 text-xs text-[#667085]">
          <span className="font-semibold text-slate-500 hidden sm:inline">{t('portalTitle')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="font-bold text-[#1F2933] text-sm">{title}</span>
        </div>
      </div>

      {/* Middle: Search Bar */}
      {setSearchQuery !== undefined && (
        <div className="hidden lg:flex items-center relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3" />
          <input
            type="text"
            placeholder="Search events, students..."
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white/90 border border-[#D9DEE3] rounded-xl text-xs font-normal text-[#1F2933] focus:outline-none focus:border-[#163A5F] transition"
          />
        </div>
      )}

      {/* Right: Notifications & User Profile */}
      {user && (
        <div className="flex items-center gap-3">
          <button
            title="Notifications"
            className="relative p-2 rounded-xl text-slate-600 hover:bg-white border border-[#D9DEE3] transition bg-white/80"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B54747]" />
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-white/90 hover:bg-white border border-[#D9DEE3] rounded-xl transition shadow-xs"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#D9DEE3] bg-[#163A5F] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#1F2933] leading-none">{user.name}</p>
              <p className="text-[10px] text-[#667085] font-medium leading-none mt-0.5">{getRoleLabel()}</p>
            </div>
          </button>
        </div>
      )}
    </header>
  );
}
