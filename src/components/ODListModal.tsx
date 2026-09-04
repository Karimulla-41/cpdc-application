'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, X, Users } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
}

interface StudentItem {
  id: string;
  name: string;
  studentId: string | null;
  department: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  students: StudentItem[];
}

export function ODListModal({ isOpen, onClose, events, students }: Props) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setSubject(`OD List – ${ev.title} – ${ev.date}`);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage(null);

    if (!selectedEventId) {
      setResultMessage({ type: 'error', text: 'Please select an event' });
      return;
    }
    if (selectedStudentIds.length === 0) {
      setResultMessage({ type: 'error', text: 'Please select at least one student' });
      return;
    }
    if (!recipientEmail) {
      setResultMessage({ type: 'error', text: 'Please enter a recipient email address' });
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/od-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          recipientEmail,
          subject: subject || `OD List – ${currentEvent?.title || 'Event'} – ${currentEvent?.date || ''}`,
          studentIds: selectedStudentIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch OD list');
      }

      setResultMessage({
        type: 'success',
        text: data.previewMode
          ? 'OD List email dispatched in preview mode (SMTP credentials logged to console).'
          : 'Official OD List successfully dispatched to HOD!',
      });

      // Clear form after 2 seconds
      setTimeout(() => {
        onClose();
        setResultMessage(null);
      }, 2500);
    } catch (err: any) {
      setResultMessage({ type: 'error', text: err?.message || 'Error sending email' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-cpdc-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cpdc-800 flex items-center justify-center text-gold-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Generate & Dispatch OD List</h2>
              <p className="text-xs text-slate-300">Official On-Duty Recommendation Dispatcher</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-5">
          {resultMessage && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                resultMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {resultMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{resultMessage.text}</span>
            </div>
          )}

          {/* Event Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Event *
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cpdc-600 font-medium"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.date} — {ev.venue})
                </option>
              ))}
            </select>
          </div>

          {/* Student Multi-Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cpdc-700" />
                Select Students for OD ({selectedStudentIds.length} Selected)
              </label>
              <button
                type="button"
                onClick={selectAllStudents}
                className="text-xs font-semibold text-cpdc-700 hover:underline"
              >
                {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
              {students.map((st) => {
                const isSelected = selectedStudentIds.includes(st.id);
                return (
                  <label
                    key={st.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs font-medium ${
                      isSelected ? 'bg-cpdc-100 text-cpdc-950 font-bold' : 'hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudent(st.id)}
                        className="rounded text-cpdc-700 focus:ring-cpdc-600"
                      />
                      <span>{st.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                      <span>{st.studentId || 'N/A'}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{st.department || 'GEN'}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Recipient Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Recipient HOD / Faculty Email *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. hod.cse@university.edu"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cpdc-600 font-medium"
            />
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="OD List – Resume Building Workshop – 28 August 2026"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cpdc-600 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cpdc-700 hover:bg-cpdc-800 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send OD List Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
