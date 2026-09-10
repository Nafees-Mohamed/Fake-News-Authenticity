// LocalStorage utility for authentication and user management

const USERS_KEY = 'fakenews_app_users';
const CURRENT_USER_KEY = 'fakenews_app_current_user';

/**
 * Get all registered users from localStorage
 */
export const getUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching users from localStorage:', error);
    return [];
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export const registerUser = ({ name, email, password }) => {
  const users = getUsers();
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: 'An account with this email already exists.',
    };
  }

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password, // In production this would be salted & hashed
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return {
      success: true,
      message: 'Account created successfully! Please sign in.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  } catch (error) {
    console.error('Error saving user:', error);
    return {
      success: false,
      message: 'Failed to save registration data to browser storage.',
    };
  }
};

/**
 * Verify credentials and log in
 * @param {string} email 
 * @param {string} password 
 */
export const loginUser = (email, password) => {
  const trimmedEmail = email.trim().toLowerCase();
  const user = getUserByEmail(trimmedEmail);

  if (!user) {
    return {
      success: false,
      message: 'No account found with this email address.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Incorrect password. Please try again.',
    };
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    loggedInAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sessionUser,
    };
  } catch (error) {
    console.error('Error storing session:', error);
    return {
      success: false,
      message: 'Could not establish login session.',
    };
  }
};

/**
 * Get current logged in user session
 */
export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching active session:', error);
    return null;
  }
};

/**
 * Clear active session (Logout)
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing session:', error);
    return { success: false };
  }
};
