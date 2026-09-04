'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  QrCode,
  Globe,
  Info,
  CheckCircle2,
  Edit2,
  Copy,
  Check,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { ImagePicker } from './ImagePicker';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'language' | 'qrShare' | 'appDetails'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState<'STUDENT' | 'STAFF_COORDINATOR'>('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUserRole((user.role === 'STAFF_COORDINATOR' || user.role === 'ADMIN') ? 'STAFF_COORDINATOR' : 'STUDENT');
      setProfileImage(user.image || '');
      fetchUserProfile();
    }
  }, [user]);

  async function fetchUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setStudentId(data.user.studentId || '');
          setDepartment(data.user.department || '');
          setYear(data.user.year || '');
          setSection(data.user.section || '');
          setPhone(data.user.phone || '');
          if (data.user.role) {
            setUserRole(data.user.role === 'STAFF_COORDINATOR' || data.user.role === 'ADMIN' ? 'STAFF_COORDINATOR' : 'STUDENT');
          }
          if (data.user.image) setProfileImage(data.user.image);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user profile details:', err);
    }
  }

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          studentId,
          department,
          year,
          section,
          phone,
          image: profileImage,
          role: userRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Profile & role details updated successfully!' });
        setIsEditing(false);
        await updateSession({ role: userRole });
        window.location.reload(); // Refresh to ensure session role updates UI
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error saving profile' });
    } finally {
      setSaving(false);
    }
  };

  const shareableUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : 'http://localhost:3000';
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareableUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all">
        {/* Header Profile Hero */}
        <div className="bg-gradient-to-r from-[#163A5F] to-[#1F2933] text-white p-6 sm:p-8 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4A72C] bg-white/10 flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{name || t('settings')}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#D4A72C]" /> {user?.email}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#D4A72C] text-[#163A5F]">
                {userRole === 'STAFF_COORDINATOR' ? 'Staff Coordinator' : t('student')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl transition bg-white/10 hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center border-b border-[#D9DEE3] bg-[#F7F8F5] px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white text-[#163A5F] border-t-2 border-[#163A5F] shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Role</span>
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'language'
                ? 'bg-white text-[#163A5F] border-t-2 border-[#163A5F] shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#2F6F7E]" />
            <span>Language</span>
          </button>

          <button
            onClick={() => setActiveTab('qrShare')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qrShare'
                ? 'bg-white text-[#163A5F] border-t-2 border-[#163A5F] shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Share QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('appDetails')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'appDetails'
                ? 'bg-white text-[#163A5F] border-t-2 border-[#163A5F] shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>App Updates</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {statusMsg && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Account Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Account Access Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserRole('STUDENT')}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                          userRole === 'STUDENT'
                            ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <GraduationCap className={`w-4 h-4 ${userRole === 'STUDENT' ? 'text-[#163A5F]' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-[#163A5F]">Student Portal</p>
                          <p className="text-[10px] text-slate-500">Student Access</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserRole('STAFF_COORDINATOR')}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                          userRole === 'STAFF_COORDINATOR'
                            ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <ShieldCheck className={`w-4 h-4 ${userRole === 'STAFF_COORDINATOR' ? 'text-[#D4A72C]' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-[#163A5F]">Staff Coordinator</p>
                          <p className="text-[10px] text-slate-500">Management Hub</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student ID / Roll No.</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. 23CS105"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="CSE"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Year</label>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="3rd Year"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Section</label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="A"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#163A5F] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Device File Explorer Avatar Image Picker */}
                  <div>
                    <ImagePicker
                      label="Profile Picture (Select File from Device)"
                      value={profileImage}
                      onChange={setProfileImage}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-[#163A5F] text-white font-bold text-xs rounded-xl shadow-md transition hover:bg-[#102a46]"
                    >
                      {saving ? 'Saving...' : 'Save Profile & Role Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portal Role</p>
                      <p className="text-xs font-extrabold text-[#163A5F]">
                        {userRole === 'STAFF_COORDINATOR' ? '🛡️ Staff Coordinator (Management)' : '🎓 Student Member'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student / Staff ID</p>
                      <p className="text-xs font-extrabold text-slate-800">{studentId || 'Not set'}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                      <p className="text-xs font-extrabold text-slate-800">{phone || 'Not set'}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                      <p className="text-xs font-extrabold text-slate-800">{department || 'Not set'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 border border-slate-200 text-[#163A5F] hover:bg-slate-50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile, Role & Avatar Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LANGUAGE SETTINGS TAB */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#163A5F]">{t('selectLanguage')}</h3>
                <p className="text-xs text-slate-500">Choose your preferred language for complete dashboard UI translation.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    language === 'en'
                      ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-[#163A5F]">English</span>
                    <p className="text-[10px] text-slate-500">Default Language</p>
                  </div>
                  {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#163A5F] mt-3" />}
                </button>

                <button
                  onClick={() => setLanguage('ta')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    language === 'ta'
                      ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-[#163A5F]">தமிழ் (Tamil)</span>
                    <p className="text-[10px] text-slate-500">தமிழ் பதிப்பு</p>
                  </div>
                  {language === 'ta' && <CheckCircle2 className="w-4 h-4 text-[#163A5F] mt-3" />}
                </button>

                <button
                  onClick={() => setLanguage('te')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    language === 'te'
                      ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-[#163A5F]">తెలుగు (Telugu)</span>
                    <p className="text-[10px] text-slate-500">తెలుగు రూపాంతరం</p>
                  </div>
                  {language === 'te' && <CheckCircle2 className="w-4 h-4 text-[#163A5F] mt-3" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SHARE QR CODE TAB */}
          {activeTab === 'qrShare' && (
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#163A5F]">{t('qrToShare')}</h3>
                <p className="text-xs text-slate-500">Scan QR code to open CPDC Student & Staff Portal on mobile devices.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 inline-block mx-auto shadow-inner">
                {/* Standard HTML img to prevent domain restrictions */}
                <img
                  src={qrCodeApiUrl}
                  alt="CPDC Portal Share QR Code"
                  width={200}
                  height={200}
                  className="mx-auto rounded-xl shadow-xs"
                />
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono w-64"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#163A5F] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#102a46] transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: APP DETAILS & UPDATE LOG */}
          {activeTab === 'appDetails' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#163A5F]">{t('appDetails')} & {t('updateDetails')}</h3>
                  <p className="text-xs text-slate-500">Official CPDC Academic & Career Development Platform</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  v2.5.0 (Production Clean Release)
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-extrabold text-[#163A5F]">⚡ Key Updates in Version 2.5.0</span>
                  <ul className="list-disc pl-4 space-y-1 pt-1 text-slate-500">
                    <li>Removed all test dummy data; database starts 100% clean.</li>
                    <li>Added explicit Role Selector (Student vs Staff Coordinator) in profile setup & settings.</li>
                    <li>Permanent SQLite profile saving to prevent any data loss.</li>
                    <li>Added device file explorer for photos and native image rendering.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Platform Framework</span>
                  <span className="font-mono text-slate-500">Next.js 14 &bull; Tailwind CSS &bull; Prisma SQLite</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
