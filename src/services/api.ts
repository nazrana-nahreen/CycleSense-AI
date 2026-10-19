import { CycleEntry, DailySymptomEntry, UserProfile, HealthArticle } from '../types';

// API Configuration
export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) 
    ? import.meta.env.VITE_API_BASE_URL 
    : 'http://localhost:8000';

const TOKEN_KEY = 'cyclesense_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic Fetch Wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          errorDetail = errorJson.detail.map((e: any) => e.msg || e.message).join(', ');
        }
      }
    } catch {
      // Fallback to status text
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// 1. Authentication Service
export const authApi = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    preferredLanguage?: 'en' | 'bn';
    consent: boolean;
  }) {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
      preferred_language: data.preferredLanguage || 'en',
      consent: data.consent,
    };
    const res = await request<{ access_token: string; token_type: string; user: any }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    if (res.access_token) {
      setStoredToken(res.access_token);
    }
    return res;
  },

  async login(email: string, password: string) {
    const res = await request<{ access_token: string; token_type: string; user: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (res.access_token) {
      setStoredToken(res.access_token);
    }
    return res;
  },

  async getMe() {
    return request<any>('/api/auth/me');
  },

  logout() {
    removeStoredToken();
  },
};

// 2. User & Privacy Service
export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const data = await request<any>('/api/users/profile');
    let perms = {
      sharePeriodDates: true,
      shareCyclePhase: true,
      shareMoodAndSymptoms: false,
      shareDailyTips: true,
    };
    if (data.partner_permissions_json) {
      try {
        perms = { ...perms, ...JSON.parse(data.partner_permissions_json) };
      } catch {}
    }

    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      preferredLanguage: data.preferred_language,
      targetCycleLength: data.cycle_length_days,
      targetPeriodDuration: data.period_duration_days,
      timeZone: 'Asia/Dhaka',
      notificationsEnabled: data.reminder_enabled,
      privacyMode: data.privacy_mode,
      consentGiven: true,
      avatarUrl: data.avatar_url || undefined,
      partnerSharing: {
        isEnabled: Boolean(data.partner_sharing_enabled),
        partnerName: data.partner_name || '',
        partnerEmail: data.partner_email || '',
        shareCode: data.partner_code || 'CYCLE-8492',
        status: data.partner_status || 'inactive',
        permissions: perms,
      },
    };
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.preferredLanguage !== undefined) payload.preferred_language = updates.preferredLanguage;
    if (updates.targetCycleLength !== undefined) payload.cycle_length_days = updates.targetCycleLength;
    if (updates.targetPeriodDuration !== undefined) payload.period_duration_days = updates.targetPeriodDuration;
    if (updates.privacyMode !== undefined) payload.privacy_mode = updates.privacyMode;
    if (updates.notificationsEnabled !== undefined) payload.reminder_enabled = updates.notificationsEnabled;
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

    const res = await request<any>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res;
  },

  async uploadAvatar(avatarUrl: string) {
    return request<any>('/api/users/avatar', {
      method: 'POST',
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
  },

  async invitePartner(partnerName?: string, partnerEmail?: string, permissions?: any) {
    return request<any>('/api/users/partner/invite', {
      method: 'POST',
      body: JSON.stringify({
        partner_name: partnerName,
        partner_email: partnerEmail || undefined,
        permissions: permissions || undefined,
      }),
    });
  },

  async revokePartner() {
    return request<any>('/api/users/partner/revoke', {
      method: 'POST',
    });
  },

  async getSharedPartnerView(partnerCode: string) {
    return request<any>(`/api/users/partner/shared/${partnerCode}`);
  },

  async exportData() {
    return request<any>('/api/users/export');
  },

  async deleteAccount() {
    const res = await request<{ message: string }>('/api/users/account', {
      method: 'DELETE',
    });
    removeStoredToken();
    return res;
  },
};

// 3. Period & Cycle Service
export const cycleApi = {
  async list(): Promise<CycleEntry[]> {
    const records = await request<any[]>('/api/cycles');
    return records.map((c) => ({
      id: String(c.id),
      startDate: c.start_date,
      endDate: c.end_date,
      cycleLength: c.cycle_length || undefined,
      periodDuration: c.period_length,
      flowIntensity: c.bleeding_intensity,
      notes: c.notes || undefined,
    }));
  },

  async create(cycle: Omit<CycleEntry, 'id'>): Promise<CycleEntry> {
    const payload = {
      start_date: cycle.startDate,
      end_date: cycle.endDate,
      bleeding_intensity: cycle.flowIntensity || 'medium',
      notes: cycle.notes || null,
    };
    const c = await request<any>('/api/cycles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      id: String(c.id),
      startDate: c.start_date,
      endDate: c.end_date,
      cycleLength: c.cycle_length || undefined,
      periodDuration: c.period_length,
      flowIntensity: c.bleeding_intensity,
      notes: c.notes || undefined,
    };
  },

  async update(id: string, cycle: Partial<CycleEntry>): Promise<CycleEntry> {
    const payload: any = {};
    if (cycle.startDate) payload.start_date = cycle.startDate;
    if (cycle.endDate) payload.end_date = cycle.endDate;
    if (cycle.flowIntensity) payload.bleeding_intensity = cycle.flowIntensity;
    if (cycle.notes !== undefined) payload.notes = cycle.notes;

    const c = await request<any>(`/api/cycles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return {
      id: String(c.id),
      startDate: c.start_date,
      endDate: c.end_date,
      cycleLength: c.cycle_length || undefined,
      periodDuration: c.period_length,
      flowIntensity: c.bleeding_intensity,
      notes: c.notes || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await request<any>(`/api/cycles/${id}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return request<{
      average_cycle_length: number;
      average_period_duration: number;
      cycle_variation: number;
      regularity_status: string;
      total_cycles_recorded: number;
    }>('/api/cycles/stats');
  },

  async getPrediction() {
    return request<{
      predicted_start_date: string | null;
      predicted_end_date: string | null;
      uncertainty_days: number;
      cycle_day: number | null;
      current_phase: string;
    }>('/api/cycles/prediction');
  },
};

// 4. Daily Symptom Service
export const symptomApi = {
  async list(date?: string): Promise<DailySymptomEntry[]> {
    const endpoint = date ? `/api/symptoms?date=${date}` : '/api/symptoms';
    const records = await request<any[]>(endpoint);
    return records.map((s) => ({
      id: String(s.id),
      date: s.date,
      crampsPain: s.cramps_severity,
      flow: s.bleeding_flow,
      mood: s.mood,
      acne: s.acne ? 'moderate' : 'none',
      fatigue: s.fatigue ? 'moderate' : 'none',
      headache: s.headache ? 'mild' : 'none',
      bloating: s.bloating ? 'moderate' : 'none',
      sleepQuality: s.sleep_quality,
      nausea: 'none',
      hairChange: 'none',
      notes: s.notes || undefined,
    }));
  },

  async createOrUpdate(symptom: Omit<DailySymptomEntry, 'id'> & { id?: string }): Promise<DailySymptomEntry> {
    const payload = {
      date: symptom.date,
      cramps_severity: Number(symptom.crampsPain || 0),
      bleeding_flow: symptom.flow || 'none',
      mood: symptom.mood || 'calm',
      acne: Boolean(symptom.acne && symptom.acne !== 'none'),
      bloating: Boolean(symptom.bloating && symptom.bloating !== 'none'),
      fatigue: Boolean(symptom.fatigue && symptom.fatigue !== 'none'),
      headache: Boolean(symptom.headache && symptom.headache !== 'none'),
      sleep_quality: symptom.sleepQuality === 'great' ? 'good' : symptom.sleepQuality || 'good',
      notes: symptom.notes || null,
    };

    const s = await request<any>('/api/symptoms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      id: String(s.id),
      date: s.date,
      crampsPain: s.cramps_severity,
      flow: s.bleeding_flow,
      mood: s.mood,
      acne: s.acne ? 'moderate' : 'none',
      fatigue: s.fatigue ? 'moderate' : 'none',
      headache: s.headache ? 'mild' : 'none',
      bloating: s.bloating ? 'moderate' : 'none',
      sleepQuality: s.sleep_quality,
      nausea: 'none',
      hairChange: 'none',
      notes: s.notes || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    await request<any>(`/api/symptoms/${id}`, {
      method: 'DELETE',
    });
  },
};

// 5. Educational Articles Service
export const educationApi = {
  async listArticles(category?: string, q?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/api/education/articles${queryString}`);
  },

  async getArticle(id: string): Promise<any> {
    return request<any>(`/api/education/articles/${id}`);
  },
};

// 6. Health Report Service
export const reportApi = {
  async getSummary() {
    return request<any>('/api/reports/summary');
  },
};
