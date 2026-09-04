'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
    te: string;
  };
}

export const translations: Translations = {
  portalTitle: {
    en: 'CPDC Portal',
    ta: 'CPDC போர்ட்டல்',
    te: 'CPDC పోర్టల్',
  },
  careerHub: {
    en: 'Career & Skill Hub',
    ta: 'வாழ்க்கை & திறன் மையம்',
    te: 'కెరీర్ & స్కిల్ హబ్',
  },
  dashboard: {
    en: 'Dashboard',
    ta: 'டாஷ்போர்டு',
    te: 'డాష్‌బోర్డ్',
  },
  eventManagement: {
    en: 'Event Management',
    ta: 'நிகழ்ச்சி மேலாண்மை',
    te: 'ఈవెంట్ మేనేజ్‌మెంట్',
  },
  eventWinners: {
    en: 'Event Winners',
    ta: 'நிகழ்ச்சி வெற்றியாளர்கள்',
    te: 'ఈవెంట్ విజేతలు',
  },
  previousEvents: {
    en: 'Previous Events & Photos',
    ta: 'முந்தைய நிகழ்ச்சிகள் & புகைப்படங்கள்',
    te: 'గత ఈవెంట్‌లు & ఫోటోలు',
  },
  studentDirectory: {
    en: 'Student Directory',
    ta: 'மாணவர் அடைவு',
    te: 'విద్యార్థి డైరెక్టరీ',
  },
  cpdcTeam: {
    en: 'CPDC Team & Leadership',
    ta: 'CPDC குழு & தலைமை',
    te: 'CPDC టీమ్ & నాయకత్వం',
  },
  announcements: {
    en: 'Announcements',
    ta: 'அறிவிப்புகள்',
    te: 'ప్రకటనలు',
  },
  settings: {
    en: 'Settings',
    ta: 'அமைப்புகள்',
    te: 'సెట్టింగ్‌లు',
  },
  welcomeGreeting: {
    en: 'Welcome back',
    ta: 'மீண்டும் நல்வரவு',
    te: 'స్వాగతం',
  },
  myAttendance: {
    en: 'My Attendance',
    ta: 'எனது வருகை',
    te: 'నా హాజరు',
  },
  upcomingEvents: {
    en: 'Upcoming Events & Workshops',
    ta: 'வரவிருக்கும் நிகழ்ச்சிகள் & பாசறைகள்',
    te: 'రాబోయే ఈవెంట్‌లు & వర్క్‌షాప్‌లు',
  },
  attendanceLog: {
    en: 'Attendance Log',
    ta: 'வருகை பதிவு',
    te: 'హాజరు లాగ్',
  },
  officialAnnouncements: {
    en: 'Official Announcements',
    ta: 'அதிகாரப்பூர்வ அறிவிப்புகள்',
    te: 'అధికారిక ప్రకటనలు',
  },
  appDetails: {
    en: 'App Details & Release Notes',
    ta: 'செயலி விவரங்கள் & புதுப்பிப்புகள்',
    te: 'యాప్ వివరాలు & విడుదల గమనికలు',
  },
  sharePortal: {
    en: 'Share CPDC Portal (QR Code)',
    ta: 'CPDC போர்ட்டலை பகிரவும் (QR குறியீடு)',
    te: 'CPDC పోర్టల్‌ని షేర్ చేయండి (QR కోడ్)',
  },
  languageSelection: {
    en: 'Select Interface Language',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    te: 'భాషను ఎంచుకోండి',
  },
  operationsHub: {
    en: 'Staff Coordinator Operations Hub',
    ta: 'ஊழியர் ஒருங்கிணைப்பாளர் செயல்பாட்டு மையம்',
    te: 'స్టాఫ్ కోఆర్డినేటర్ ఆపరేషన్స్ హబ్',
  },
  generateODList: {
    en: 'Generate & Send Official OD List',
    ta: 'அதிகாரப்பூர்வ OD பட்டியலை உருவாக்கவும்',
    te: 'అధికారిక OD జాబితాను రూపొందించండి',
  },
  studentRoster: {
    en: 'Student Roster',
    ta: 'மாணவர் பட்டியல்',
    te: 'విద్యార్థుల జాబితా',
  },
  activeMembers: {
    en: 'Active Members',
    ta: 'செயலில் உள்ள உறுப்பினர்கள்',
    te: 'క్రియాశీల సభ్యులు',
  },
  scheduledDrives: {
    en: 'Scheduled Drives',
    ta: 'திட்டமிடப்பட்ட இயக்கங்கள்',
    te: 'షెడ్యూల్ చేసిన డ్రైవ్‌లు',
  },
  archivedPhotos: {
    en: 'Archived Event Photos',
    ta: 'காப்பகப்படுத்தப்பட்ட புகைப்படங்கள்',
    te: 'ఆర్కైవ్ చేసిన ఈవెంట్ ఫోటోలు',
  },
  appointedTeam: {
    en: 'Appointed Leadership Team',
    ta: 'நியமிக்கப்பட்ட குழு',
    te: 'నియమించబడిన బృందం',
  },
  addEvent: {
    en: '+ Add Event / Upload Photos',
    ta: '+ புதிய நிகழ்ச்சியைச் சேர்க்கவும்',
    te: '+ ఈవెంట్‌ను జోడించండి',
  },
  eventTitle: {
    en: 'Event Title',
    ta: 'நிகழ்ச்சி தலைப்பு',
    te: 'ఈవెంట్ శీర్షిక',
  },
  venue: {
    en: 'Venue',
    ta: 'இடம்',
    te: 'వేదిక',
  },
  eventStatus: {
    en: 'Event Status',
    ta: 'நிகழ்ச்சி நிலை',
    te: 'ఈవెంట్ స్థితి',
  },
  upcomingEvent: {
    en: 'UPCOMING EVENT',
    ta: 'வரவிருக்கும் நிகழ்ச்சி',
    te: 'రాబోయే ఈవెంట్',
  },
  completedEvent: {
    en: 'COMPLETED EVENT',
    ta: 'முடிவடைந்த நிகழ்ச்சி',
    te: 'పూర్తయిన ఈవెంట్',
  },
  date: {
    en: 'Date',
    ta: 'தேதி',
    te: 'తేదీ',
  },
  time: {
    en: 'Time',
    ta: 'நேரம்',
    te: 'సమయం',
  },
  description: {
    en: 'Description',
    ta: 'விவரம்',
    te: 'వివరణ',
  },
  photoUrl: {
    en: 'Event Photo / Poster Image URL',
    ta: 'புகைப்பட URL',
    te: 'ఫోటో URL',
  },
  googleFormUrl: {
    en: 'Registration Google Form URL',
    ta: 'பதிவு படிவ URL',
    te: 'రిజిస్ట్రేషన్ గూగుల్ ఫారమ్ URL',
  },
  cancel: {
    en: 'Cancel',
    ta: 'ரத்து செய்',
    te: 'రద్దు చేయి',
  },
  saveEvent: {
    en: 'Save Event & Photo',
    ta: 'சேமிக்கவும்',
    te: 'ఈవెంట్‌ను సేవ్ చేయి',
  },
  registerForm: {
    en: 'Register Form',
    ta: 'பதிவு செய்யவும்',
    te: 'రిజిస్టర్ ఫారమ్',
  },
  registrationOpening: {
    en: 'Registration Opening Soon',
    ta: 'பதிவு விரைவில் தொடங்கும்',
    te: 'రిజిస్ట్రేషన్ త్వరలో ప్రారంభమవుతుంది',
  },
  eventsArchived: {
    en: 'Events Archived',
    ta: 'காப்பகப்படுத்தப்பட்ட நிகழ்ச்சிகள்',
    te: 'ఆర్కైవ్ చేసిన ఈవెంట్‌లు',
  },
  winnerChampions: {
    en: 'Event Winners & Champions',
    ta: 'நிகழ்ச்சி வெற்றியாளர்கள் & சாம்பியன்கள்',
    te: 'ఈవెంట్ విజేతలు & ఛాంపియన్లు',
  },
  staffCoordinators: {
    en: 'Staff Coordinators & Faculty Advisors',
    ta: 'ஊழியர் ஒருங்கிணைப்பாளர்கள்',
    te: 'స్టాఫ్ కోఆర్డినేటర్లు',
  },
  studentLeadership: {
    en: 'Student Executive Leadership',
    ta: 'மாணவர் நிர்வாக தலைமை',
    te: 'విద్యార్థి కార్యనిర్వాహక నాయకత్వం',
  },
  executiveMembers: {
    en: 'Executive Members',
    ta: 'நிர்வாக உறுப்பினர்கள்',
    te: 'కార్యనిర్వాహక సభ్యులు',
  },
  assignRole: {
    en: 'Assign Role & Executive Position',
    ta: 'பொறுப்பை ஒதுக்குங்கள்',
    te: 'పాత్రను కేటాయించండి',
  },
  student: {
    en: 'Student',
    ta: 'மாணவர்',
    te: 'విద్యార్థి',
  },
  executive: {
    en: 'Executive',
    ta: 'நிர்வாகி',
    te: 'ఎగ్జிக్యూటివ్',
  },
  president: {
    en: 'President',
    ta: 'தலைவர்',
    te: 'అధ్యక్షుడు',
  },
  vicePresident: {
    en: 'Vice President',
    ta: 'துணைத் தலைவர்',
    te: 'ఉపాధ్యక్షుడు',
  },
  secretary: {
    en: 'Secretary',
    ta: 'செயலாளர்',
    te: 'కార్యదర్శి',
  },
  treasurer: {
    en: 'Treasurer',
    ta: 'பொருளாளர்',
    te: 'కోశాధికారి',
  },
  executiveMember: {
    en: 'Executive Member',
    ta: 'நிர்வாக உறுப்பினர்',
    te: 'ఎగ్జிக్యూటివ్ మెంబర్',
  },
  actionControl: {
    en: 'Action Control',
    ta: 'நடவடிக்கை கட்டுப்பாடு',
    te: 'చర్యల నియంత్రణ',
  },
  manageRole: {
    en: 'Manage Role',
    ta: 'பொறுப்பை நிர்வகிக்கவும்',
    te: 'పాత్రను నిర్వర్తించండి',
  },
  saveRoleStatus: {
    en: 'Save Role Status',
    ta: 'நிலையைச் சேமிக்கவும்',
    te: 'హోదాను సేవ్ చేయి',
  },
  scanQrNotice: {
    en: 'Scan QR code with mobile camera to access CPDC Portal directly.',
    ta: 'CPDC போர்ட்டலை மொபைலில் திறக்க QR குறியீட்டை ஸ்கேன் செய்யவும்.',
    te: 'CPDC పోర్టల్‌ని మొబైల్‌లో తెరవడానికి QR కోడ్‌ను స్కాన్ చేయండి.',
  },
  copyLink: {
    en: 'Copy Platform URL',
    ta: 'லிங்கை நகலெடுக்கவும்',
    te: 'లింక్‌ను కాపీ చేయండి',
  },
  copied: {
    en: 'Link Copied!',
    ta: 'நகலெடுக்கப்பட்டது!',
    te: 'కాపీ చేయబడింది!',
  },
  versionInfo: {
    en: 'App Version',
    ta: 'செயலி பதிப்பு',
    te: 'యాప్ వెர்షన్',
  },
  systemStatus: {
    en: 'System Status',
    ta: 'கணினி நிலை',
    te: 'సిస్టమ్ స్థితి',
  },
  allOperational: {
    en: 'All Systems Operational',
    ta: 'அனைத்து சேவைகளும் சீராக இயங்குகின்றன',
    te: 'అన్ని సేవలు సజావుగా పనిచేస్తున్నాయి',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('cpdc_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ta' || savedLang === 'te')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cpdc_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
