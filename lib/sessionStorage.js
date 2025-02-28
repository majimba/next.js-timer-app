/**
 * Session Storage Utility
 * 
 * This utility provides functions for managing timer sessions.
 * Currently uses localStorage for persistence, but could be replaced
 * with a database connection in the future.
 */

// Key for storing sessions in localStorage
const SESSIONS_STORAGE_KEY = 'timer_sessions';

/**
 * Get all saved timer sessions
 * @returns {Array} Array of session objects
 */
export function getAllSessions() {
  if (typeof window === 'undefined') {
    return []; // Return empty array when running on server
  }
  
  try {
    const sessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 * @param {string} id - Session ID
 * @returns {Object|null} Session object or null if not found
 */
export function getSessionById(id) {
  const sessions = getAllSessions();
  return sessions.find(session => session.id === id) || null;
}

/**
 * Save a new timer session
 * @param {Object} session - Session object to save
 * @returns {Object} Saved session with generated ID
 */
export function saveSession(session) {
  try {
    const sessions = getAllSessions();
    
    // Generate a unique ID if not provided
    const newSession = {
      ...session,
      id: session.id || generateId(),
      savedAt: new Date().toISOString()
    };
    
    // Add to beginning of array (newest first)
    const updatedSessions = [newSession, ...sessions];
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    }
    
    return newSession;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

/**
 * Delete a session by ID
 * @param {string} id - Session ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteSession(id) {
  try {
    const sessions = getAllSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    if (filteredSessions.length === sessions.length) {
      return false; // Session not found
    }
    
    // Save updated sessions to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filteredSessions));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

/**
 * Generate a unique ID for a session
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
