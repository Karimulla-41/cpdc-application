import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'attendance' | 'profile'>('events');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
      setScreen('dashboard');
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.log('Mobile App Backend Sync:', e);
    }
  };

  if (screen === 'splash' || loading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>🎓</Text>
        </View>
        <Text style={styles.splashTitle}>CPDC</Text>
        <Text style={styles.splashSubtitle}>Career & Professional Development Club</Text>
        <ActivityIndicator size="small" color="#f59e0b" style={{ marginTop: 24 }} />
        <Text style={styles.splashFooter}>Syncing with Production PostgreSQL Backend...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>CPDC Mobile</Text>
          <Text style={styles.brandSub}>Career & Professional Development</Text>
        </View>
        <TouchableOpacity
          style={styles.userChip}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.userChipText}>👤 Shaik Karimulla</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'events' && styles.tabButtonActive]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'attendance' && styles.tabButtonActive]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={[styles.tabText, activeTab === 'attendance' && styles.tabTextActive]}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Tab Content: Events */}
        {activeTab === 'events' && (
          <View style={styles.section}>
            <View style={styles.bannerCard}>
              <Text style={styles.bannerTag}>PostgreSQL Source of Truth</Text>
              <Text style={styles.bannerTitle}>Welcome to CPDC Mobile 👋</Text>
              <Text style={styles.bannerDesc}>
                Real-time synchronization across Web & Mobile platforms.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Upcoming & Active Events</Text>
            {events.length === 0 ? (
              <Text style={styles.emptyText}>Loading events from backend...</Text>
            ) : (
              events.map((ev) => (
                <View key={ev.id} style={styles.eventCard}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.statusBadge}>{ev.status}</Text>
                    <Text style={styles.dateText}>{ev.date}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <Text style={styles.eventDesc}>{ev.description}</Text>
                  <Text style={styles.venueText}>📍 {ev.venue} • {ev.startTime}</Text>
                  <TouchableOpacity style={styles.registerBtn}>
                    <Text style={styles.registerBtnText}>Register Now (Google Form)</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Tab Content: Attendance */}
        {activeTab === 'attendance' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Attendance Metrics</Text>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>80%</Text>
              <Text style={styles.metricLabel}>8 / 10 Completed Events Attended</Text>
            </View>

            <View style={styles.attRow}>
              <Text style={styles.attEvent}>Resume Building Workshop</Text>
              <Text style={styles.attPresent}>✓ Present</Text>
            </View>
            <View style={styles.attRow}>
              <Text style={styles.attEvent}>Aptitude & Technical Bootcamp</Text>
              <Text style={styles.attPresent}>✓ Present</Text>
            </View>
            <View style={styles.attRow}>
              <Text style={styles.attEvent}>Corporate Communication</Text>
              <Text style={styles.attAbsent}>Absent</Text>
            </View>
          </View>
        )}

        {/* Tab Content: Profile Screen */}
        {activeTab === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Student Profile</Text>
            
            <View style={styles.profileCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>SK</Text>
              </View>
              <Text style={styles.profileName}>SHAIK KARIMULLA</Text>
              <Text style={styles.profileRole}>CPDC Student</Text>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileLabel}>Google Email</Text>
                <Text style={styles.profileValue}>karimulla1010sk@gmail.com</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileLabel}>Student ID</Text>
                <Text style={styles.profileValue}>410623104103</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileLabel}>Department & Year</Text>
                <Text style={styles.profileValue}>CSE (4th Year)</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileLabel}>Phone</Text>
                <Text style={styles.profileValue}>+91 9876543210</Text>
              </View>

              <View style={styles.profileDetailRow}>
                <Text style={styles.profileLabel}>Attendance Metric</Text>
                <Text style={styles.profileValueHighlight}>80% (8 / 10 Events)</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0d1a33',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1e4279',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  splashTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
  },
  splashSubtitle: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  splashFooter: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d1a33',
  },
  brandSub: {
    fontSize: 10,
    color: '#64748b',
  },
  userChip: {
    backgroundColor: '#dbe5f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  userChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e4279',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#1e4279',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bannerCard: {
    backgroundColor: '#14294b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerTag: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  bannerDesc: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: '#dbe5f2',
    color: '#1e4279',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  eventDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  venueText: {
    fontSize: 11,
    color: '#1e4279',
    fontWeight: '600',
    marginTop: 8,
  },
  registerBtn: {
    backgroundColor: '#285596',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e4279',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  attRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  attEvent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  attPresent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  attAbsent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991b1b',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e4279',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  profileRole: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  profileDetailRow: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  profileValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
  },
  profileValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
    marginTop: 2,
  },
});
