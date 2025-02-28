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
export function getSessions() {
  if (typeof window === 'undefined') {
    return []; // Return empty array when running on server
  }
  
  try {
    const sessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 * @param {string} id - Session ID
 * @returns {Object|null} Session object or null if not found
 */
export function getSession(id) {
  const sessions = getSessions();
  return sessions.find(session => session.id === id) || null;
}

/**
 * Save a new timer session
 * @param {Object} sessionData - Session data to save
 * @returns {Object} Saved session with generated ID
 */
export function saveSession(sessionData) {
  try {
    // Get existing sessions
    const sessions = getSessions();
    
    // Create a new session with a unique ID
    const id = 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    // Get the next session number for naming
    const sessionCount = sessions.length + 1;
    const sessionName = `session ${sessionCount}`;
    
    const newSession = {
      id,
      name: sessionName,
      ...sessionData,
      savedAt: new Date().toISOString()
    };
    
    // Add to the beginning of the array (newest first)
    const updatedSessions = [newSession, ...sessions];
    
    // Save to localStorage
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    
    return newSession;
  } catch (error) {
    console.error('Error saving session:', error);
    return null;
  }
}

/**
 * Update an existing session
 * @param {string} id - Session ID to update
 * @param {Object} updates - Updates to apply to the session
 * @returns {Object|null} Updated session or null if not found
 */
export function updateSession(id, updates) {
  try {
    const sessions = getSessions();
    const sessionIndex = sessions.findIndex(session => session.id === id);
    
    if (sessionIndex === -1) {
      return null;
    }
    
    // Update the session with new data
    const updatedSession = {
      ...sessions[sessionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    sessions[sessionIndex] = updatedSession;
    
    // Save to localStorage
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    
    return updatedSession;
  } catch (error) {
    console.error('Error updating session:', error);
    return null;
  }
}

/**
 * Delete a session by ID
 * @param {string} id - Session ID to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteSession(id) {
  try {
    const sessions = getSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    // Save to localStorage
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filteredSessions));
    
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}
