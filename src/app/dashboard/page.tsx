'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { AcademicSidebar } from '@/components/AcademicSidebar';
import { StudentDashboard } from '@/components/StudentDashboard';
import { ManagementDashboard } from '@/components/ManagementDashboard';
import { ProfileModal } from '@/components/ProfileModal';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (session?.user && !session.user.profileCompleted) {
      router.replace('/complete-profile');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5]/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#163A5F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#667085]">Loading University Portal...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const role = session.user.role;
  const isManagement = role === 'STAFF_COORDINATOR' || role === 'ADMIN';

  const getTabTitle = () => {
    switch (activeTab) {
      case 'events':
        return 'Event Management';
      case 'winners':
        return 'Event Winners & Champions';
      case 'previous_events':
        return 'Previous Events & Photo Gallery';
      case 'students':
        return 'Student Directory & Roster';
      case 'team':
        return 'CPDC Leadership & Executive Team';
      case 'announcements':
        return 'Campus Announcements';
      case 'settings':
        return 'Account & Profile Settings';
      default:
        return isManagement ? 'Staff Operations Hub' : 'Student Career Portal';
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* 1. Left Academic Navy Collapsible Sidebar */}
      <AcademicSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Area (Expands to 100% full width when sidebar is hidden) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        {/* Top Navbar Header */}
        <Navbar
          title={getTabTitle()}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Content View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isManagement ? (
            <ManagementDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <StudentDashboard activeTab={activeTab} />
          )}
        </main>
      </div>

      {/* Interactive Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
