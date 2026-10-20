import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  CycleEntry, 
  DailySymptomEntry, 
  NotificationItem, 
  Language, 
  ChatMessage, 
  CyclePrediction,
  MentalHealthEntry
} from '../types';
import { 
  initialUserProfile, 
  initialCycles, 
  initialSymptoms, 
  initialNotifications 
} from '../data/mockUserData';
import { initialMockMentalHealthEntries } from '../data/mockMentalHealthData';
import { 
  calculateCycleStats, 
  calculateCyclePrediction 
} from '../utils/cycleCalculations';
import { 
  mockAssistantKnowledge, 
  defaultAssistantFallbackEn, 
  defaultAssistantFallbackBn 
} from '../data/mockChatResponses';
import { translations } from '../data/translations';
import { 
  cycleApi, 
  symptomApi, 
  userApi, 
  getStoredToken 
} from '../services/api';

interface AppContextType {
  user: UserProfile;
  cycles: CycleEntry[];
  symptoms: DailySymptomEntry[];
  mentalHealthEntries: MentalHealthEntry[];
  notifications: NotificationItem[];
  language: Language;
  currentPage: string;
  isLoggedIn: boolean;
  selectedDate: string;
  selectedArticleId: string | null;
  chatMessages: ChatMessage[];
  isChatDrawerOpen: boolean;
  isAddPeriodModalOpen: boolean;
  setIsAddPeriodModalOpen: (open: boolean) => void;
  isAssistantTyping: boolean;
  prediction: CyclePrediction;
  cycleStats: ReturnType<typeof calculateCycleStats>;
  t: typeof translations['en'];
  
  // Handlers & Auth
  setLanguage: (lang: Language) => void;
  setCurrentPage: (page: string) => void;
  setIsLoggedIn: (logged: boolean) => void;
  redirectAfterAuth: string | null;
  setRedirectAfterAuth: (page: string | null) => void;
  authRequiredNotice: string | null;
  setAuthRequiredNotice: (notice: string | null) => void;
  logout: () => void;
  setSelectedDate: (date: string) => void;
  setSelectedArticleId: (id: string | null) => void;
  setIsChatDrawerOpen: (open: boolean) => void;
  editingCycleId: string | null;
  setEditingCycleId: (id: string | null) => void;
  
  // Data mutations
  addCycle: (cycle: Omit<CycleEntry, 'id'>) => void;
  updateCycle: (cycle: CycleEntry) => void;
  deleteCycle: (id: string) => void;
  addOrUpdateSymptom: (symptom: Omit<DailySymptomEntry, 'id'> & { id?: string }) => void;
  deleteSymptom: (id: string) => void;
  addMentalHealthEntry: (entry: Omit<MentalHealthEntry, 'id'>) => void;
  deleteMentalHealthEntry: (id: string) => void;
  toggleMentalHealthCycleLink: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendChatMessage: (text: string) => void;
  clearChatMessages: () => void;
  resetToDemoData: () => void;
  clearAllHealthData: () => void;
  togglePrivacyMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or default
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cyclesense_user');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [cycles, setCycles] = useState<CycleEntry[]>(() => {
    const saved = localStorage.getItem('cyclesense_cycles');
    return saved ? JSON.parse(saved) : initialCycles;
  });

  const [symptoms, setSymptoms] = useState<DailySymptomEntry[]>(() => {
    const saved = localStorage.getItem('cyclesense_symptoms');
    return saved ? JSON.parse(saved) : initialSymptoms;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cyclesense_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [mentalHealthEntries, setMentalHealthEntries] = useState<MentalHealthEntry[]>(() => {
    const saved = localStorage.getItem('cyclesense_mental_health');
    return saved ? JSON.parse(saved) : initialMockMentalHealthEntries;
  });

  const [language, setLanguageState] = useState<Language>(user.preferredLanguage || 'en');
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const validPages = [
      'landing', 'auth_signin', 'auth_signup', 'dashboard',
      'calendar', 'symptoms', 'insights', 'education',
      'mentalHealth', 'aiAssistant', 'reports', 'profile', 'settings', 'partner_view'
    ];
    if (validPages.includes(rawHash)) {
      return rawHash;
    }
    return 'landing';
  });
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    // Clean up any stale legacy demo flag
    if (localStorage.getItem('cyclesense_logged_in') && !localStorage.getItem('cyclesense_authenticated_session') && !localStorage.getItem('cyclesense_auth_token')) {
      localStorage.removeItem('cyclesense_logged_in');
    }
    const explicitSession = localStorage.getItem('cyclesense_authenticated_session');
    const token = localStorage.getItem('cyclesense_auth_token');
    return explicitSession === 'true' || !!token;
  });
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  const [authRequiredNotice, setAuthRequiredNotice] = useState<string | null>(null);

  const setIsLoggedIn = (logged: boolean) => {
    setIsLoggedInState(logged);
    if (logged) {
      localStorage.setItem('cyclesense_authenticated_session', 'true');
      localStorage.setItem('cyclesense_logged_in', 'true');
    } else {
      localStorage.removeItem('cyclesense_authenticated_session');
      localStorage.removeItem('cyclesense_logged_in');
      localStorage.removeItem('cyclesense_auth_token');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-19');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState<boolean>(false);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState<boolean>(false);

  // Chat history with initial greeting
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cyclesense_chat');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: translations['en'].aiChat.welcomeText,
        timestamp: 'Just now',
        language: 'en',
      }
    ];
  });

  // Keep state synced with localStorage
  useEffect(() => {
    localStorage.setItem('cyclesense_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cyclesense_cycles', JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem('cyclesense_symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem('cyclesense_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cyclesense_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('cyclesense_mental_health', JSON.stringify(mentalHealthEntries));
  }, [mentalHealthEntries]);

  // Listen for browser Back / Forward navigation
  useEffect(() => {
    const validPages = [
      'landing', 'auth_signin', 'auth_signup', 'dashboard',
      'calendar', 'symptoms', 'insights', 'education',
      'mentalHealth', 'aiAssistant', 'reports', 'profile', 'settings', 'partner_view'
    ];
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (validPages.includes(hash)) {
        setCurrentPage((prev) => (prev !== hash ? hash : prev));
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync hash with currentPage changes
  useEffect(() => {
    const validPages = [
      'landing', 'auth_signin', 'auth_signup', 'dashboard',
      'calendar', 'symptoms', 'insights', 'education',
      'mentalHealth', 'aiAssistant', 'reports', 'profile', 'settings', 'partner_view'
    ];
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    if (validPages.includes(currentPage) && currentHash !== currentPage) {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  // Attempt live sync with FastAPI backend on startup if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    let isMounted = true;
    (async () => {
      try {
        const [profile, serverCycles, serverSymptoms] = await Promise.all([
          userApi.getProfile().catch(() => null),
          cycleApi.list().catch(() => null),
          symptomApi.list().catch(() => null),
        ]);

        if (!isMounted) return;
        if (profile) {
          setUser(profile);
          setLanguageState(profile.preferredLanguage);
        }
        if (serverCycles && serverCycles.length > 0) {
          setCycles(serverCycles);
        }
        if (serverSymptoms && serverSymptoms.length > 0) {
          setSymptoms(serverSymptoms);
        }
      } catch {
        // Fallback safely to cached local state
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setUser(prev => ({ ...prev, preferredLanguage: lang }));
    userApi.updateProfile({ preferredLanguage: lang }).catch(() => {});
  };

  const togglePrivacyMode = () => {
    const nextMode = !user.privacyMode;
    setUser(prev => ({ ...prev, privacyMode: nextMode }));
    userApi.updateProfile({ privacyMode: nextMode }).catch(() => {});
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    userApi.updateProfile(updates).catch(() => {});
  };

  // Cycle computations
  const cycleStats = calculateCycleStats(cycles);

  // Derive last period start
  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  const lastPeriodStart = sortedCycles.length > 0 ? sortedCycles[0].startDate : '2026-10-01';

  // Extract recent cycle lengths for ML inference
  const recentLengths: number[] = [];
  for (let i = 0; i < sortedCycles.length - 1; i++) {
    const diff = Math.round((new Date(sortedCycles[i].startDate).getTime() - new Date(sortedCycles[i + 1].startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 18 && diff <= 55) {
      recentLengths.unshift(diff);
    }
  }

  const prediction = calculateCyclePrediction(
    lastPeriodStart,
    user.targetCycleLength || cycleStats.averageCycleLength || 29,
    user.targetPeriodDuration || cycleStats.averagePeriodDuration || 5,
    cycleStats.cycleVariation || 2,
    30,
    23.5,
    recentLengths
  );

  // Cycle Mutations with API sync
  const addCycle = async (newCycleData: Omit<CycleEntry, 'id'>) => {
    const tempId = `cycle_${Date.now()}`;
    const localEntry: CycleEntry = { ...newCycleData, id: tempId };
    setCycles(prev => [localEntry, ...prev]);

    try {
      const serverEntry = await cycleApi.create(newCycleData);
      setCycles(prev => prev.map(c => (c.id === tempId ? serverEntry : c)));
    } catch {
      // Retain optimistic local entry
    }
  };

  const updateCycle = async (updatedCycle: CycleEntry) => {
    setCycles(prev => prev.map(c => (c.id === updatedCycle.id ? updatedCycle : c)));
    try {
      await cycleApi.update(updatedCycle.id, updatedCycle);
    } catch {
      // Retain local
    }
  };

  const deleteCycle = async (id: string) => {
    setCycles(prev => prev.filter(c => c.id !== id));
    try {
      await cycleApi.delete(id);
    } catch {
      // Retain local
    }
  };

  // Symptom Mutations with API sync
  const addOrUpdateSymptom = async (entry: Omit<DailySymptomEntry, 'id'> & { id?: string }) => {
    setSymptoms(prev => {
      const existingIndex = prev.findIndex(s => s.date === entry.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...entry,
          id: entry.id || prev[existingIndex].id,
        };
        return updated;
      } else {
        const newEntry: DailySymptomEntry = {
          ...entry,
          id: entry.id || `symp_${Date.now()}`,
        };
        return [newEntry, ...prev];
      }
    });

    try {
      const serverSymptom = await symptomApi.createOrUpdate(entry);
      setSymptoms(prev => prev.map(s => (s.date === entry.date ? serverSymptom : s)));
    } catch {
      // Retain local
    }
  };

  const deleteSymptom = async (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    try {
      await symptomApi.delete(id);
    } catch {
      // Retain local
    }
  };

  // Mental Health Mutations
  const addMentalHealthEntry = (entryData: Omit<MentalHealthEntry, 'id'>) => {
    const newEntry: MentalHealthEntry = {
      ...entryData,
      id: `mh_${Date.now()}`,
    };
    setMentalHealthEntries(prev => [newEntry, ...prev.filter(e => e.date !== entryData.date)]);
  };

  const deleteMentalHealthEntry = (id: string) => {
    setMentalHealthEntries(prev => prev.filter(e => e.id !== id));
  };

  const toggleMentalHealthCycleLink = () => {
    const nextVal = user.linkMentalHealthWithCycle !== undefined ? !user.linkMentalHealthWithCycle : false;
    updateUserProfile({ linkMentalHealthWithCycle: nextVal });
  };

  // Notification Mutations
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // AI Chat handler
  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
      language,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAssistantTyping(true);

    // Find best match in knowledge base
    const lower = text.toLowerCase();
    let matchedRule = mockAssistantKnowledge.find(rule =>
      rule.keywords.some(k => lower.includes(k.toLowerCase()))
    );

    let replyText = language === 'bn' 
      ? defaultAssistantFallbackBn 
      : defaultAssistantFallbackEn;
    let citations: string[] | undefined = undefined;
    let isUrgent = false;

    if (matchedRule) {
      replyText = language === 'bn' ? matchedRule.responseBn : matchedRule.responseEn;
      citations = matchedRule.citations;
      isUrgent = !!matchedRule.isUrgent;
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
        language,
        citations,
        urgentCareWarning: isUrgent,
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      setIsAssistantTyping(false);
    }, 600);
  };

  const clearChatMessages = () => {
    setChatMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: translations[language].aiChat.welcomeText,
        timestamp: 'Just now',
        language,
      }
    ]);
  };

  const resetToDemoData = () => {
    setUser(initialUserProfile);
    setCycles(initialCycles);
    setSymptoms(initialSymptoms);
    setNotifications(initialNotifications);
    localStorage.clear();
  };

  const clearAllHealthData = () => {
    setCycles([]);
    setSymptoms([]);
    setNotifications([]);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        user,
        cycles,
        symptoms,
        mentalHealthEntries,
        notifications,
        language,
        currentPage,
        isLoggedIn,
        selectedDate,
        selectedArticleId,
        chatMessages,
        isChatDrawerOpen,
        isAddPeriodModalOpen,
        editingCycleId,
        setEditingCycleId,
        isAssistantTyping,
        prediction,
        cycleStats,
        t,
        setLanguage,
        setCurrentPage,
        setIsLoggedIn,
        redirectAfterAuth,
        setRedirectAfterAuth,
        authRequiredNotice,
        setAuthRequiredNotice,
        logout,
        setSelectedDate,
        setSelectedArticleId,
        setIsChatDrawerOpen,
        setIsAddPeriodModalOpen,
        addCycle,
        updateCycle,
        deleteCycle,
        addOrUpdateSymptom,
        deleteSymptom,
        addMentalHealthEntry,
        deleteMentalHealthEntry,
        toggleMentalHealthCycleLink,
        updateUserProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendChatMessage,
        clearChatMessages,
        resetToDemoData,
        clearAllHealthData,
        togglePrivacyMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
