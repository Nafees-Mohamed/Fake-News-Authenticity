const API_BASE = 'http://localhost:5000/api';
const TOKEN_KEY = 'fakenews_auth_token';
const USER_KEY = 'fakenews_user_data';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Register new user
 */
export const registerUser = async ({ name, email, password, role }) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Registration failed.' };
    return { success: true, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: 'Unable to connect to backend server on port 5000.' };
  }
};

/**
 * Login user & store JWT token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Login failed.' };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { success: true, message: data.message, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, message: 'Unable to connect to backend server on port 5000.' };
  }
};

/**
 * Get active user session
 */
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      logoutUser();
      return null;
    }
    const data = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  }
};

/**
 * Logout
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { success: true };
};

/**
 * Verify News Authenticity API
 */
export const verifyNewsApi = async (newsContent) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/news/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newsContent }),
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Verification failed.' };
    return { success: true, ...data };
  } catch (error) {
    return { success: false, message: 'Failed to communicate with AI verification backend.' };
  }
};

/**
 * Get prediction history
 */
export const getHistoryApi = async (search = '') => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/news/history?search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, history: [] };
    return { success: true, history: data.history };
  } catch (error) {
    return { success: false, history: [] };
  }
};

/**
 * Delete prediction record from history
 */
export const deleteHistoryApi = async (id) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/news/history/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    return { success: false, message: 'Failed to delete record.' };
  }
};

/**
 * Admin metrics
 */
export const getAdminMetricsApi = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/admin/metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message };
    return { success: true, metrics: data };
  } catch (error) {
    return { success: false, message: 'Failed to fetch admin metrics.' };
  }
};

/**
 * Admin users list
 */
export const getAdminUsersApi = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, users: [] };
    return { success: true, users: data.users };
  } catch (error) {
    return { success: false, users: [] };
  }
};

/**
 * Toggle user status
 */
export const toggleUserStatusApi = async (id, status) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    return { success: false, message: 'Failed to update user status.' };
  }
};

/**
 * Export research dataset
 */
export const exportDatasetApi = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE}/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, message: 'Failed to export dataset.' };
  }
};
