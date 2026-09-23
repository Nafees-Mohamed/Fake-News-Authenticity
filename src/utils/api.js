const API_BASE = 'http://localhost:5000/api/auth';
const TOKEN_KEY = 'fakenews_auth_token';
const USER_KEY = 'fakenews_user_data';

/**
 * Get stored JWT auth token
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Register a new user via Express API
 */
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed.',
      };
    }

    return {
      success: true,
      message: data.message || 'Account created successfully!',
      user: data.user,
    };
  } catch (error) {
    console.error('API Register Error:', error);
    return {
      success: false,
      message: 'Unable to connect to backend server. Make sure Express server is running on port 5000.',
    };
  }
};

/**
 * Login user via Express API & store JWT token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed.',
      };
    }

    // Save JWT token & user profile locally
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return {
      success: true,
      message: data.message || 'Login successful!',
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('API Login Error:', error);
    return {
      success: false,
      message: 'Unable to connect to backend server. Make sure Express server is running on port 5000.',
    };
  }
};

/**
 * Verify active JWT session with backend
 */
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Invalid/expired token
      logoutUser();
      return null;
    }

    const data = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('API Check Session Error:', error);
    // Fallback to cached user if offline or starting up
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  }
};

/**
 * Logout user & remove authentication token
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { success: true };
};
