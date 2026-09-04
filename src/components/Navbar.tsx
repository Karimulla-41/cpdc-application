'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  CheckCheck,
  Megaphone,
  X
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenProfile?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSelectTab?: (tab: string) => void;
}

export function Navbar({
  title = 'Dashboard',
  onToggleSidebar,
  isSidebarOpen = false,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
  onSelectTab,
}: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { t } = useLanguage();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.announcements || []);
        setAnnouncements(list);
        setUnreadCount(list.length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = () => {
    setUnreadCount(0);
  };

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
            className="w-8 h-8 rounded-full bg-[#163A5F] hover:bg-[#102a46] text-white flex items-center justify-center transition shadow-xs cursor-pointer"
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
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* Interactive Bell Icon */}
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="Campus Notifications"
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-[#D9DEE3] transition bg-white/80 cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4 text-[#163A5F]" />
            
            {/* ONLY render red dot badge if unread notifications exist (> 0) */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#B54747] text-white text-[9px] font-extrabold shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Modal / Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-[#163A5F] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#D4A72C]" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D4A72C] text-[#163A5F] text-[10px] font-extrabold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAsRead}
                      className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-[#D4A72C]" />
                      <span>Clear</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Megaphone className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">No New Notifications</p>
                    <p className="text-[11px] text-slate-400">Campus announcements will appear here when posted.</p>
                  </div>
                ) : (
                  announcements.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3 hover:bg-slate-50 rounded-xl transition space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#163A5F] line-clamp-1">{item.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{item.content}</p>
                    </div>
                  ))
                )}
              </div>

              {announcements.length > 0 && onSelectTab && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      onSelectTab('announcements');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-bold text-[#163A5F] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Announcements</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-white/90 hover:bg-white border border-[#D9DEE3] rounded-xl transition shadow-xs cursor-pointer"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#D9DEE3] bg-[#163A5F] text-[#D4A72C] flex items-center justify-center font-bold text-xs shrink-0">
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
