'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '../lib/timeUtils';

/**
 * Component to display a list of saved timer sessions
 */
export default function SessionList({ onSelectSession }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sessions when component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        // First try to get from localStorage for client-side rendering
        if (typeof window !== 'undefined') {
          const storedSessions = localStorage.getItem('timer_sessions');
          if (storedSessions) {
            setSessions(JSON.parse(storedSessions));
            setLoading(false);
            return;
          }
        }
        
        // If no localStorage data, fetch from API
        const response = await fetch('/api/timer');
        const result = await response.json();
        
        if (result.status === 'success') {
          setSessions(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch sessions');
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="p-3 border-r border-gray-200 h-full">
        <h2 className="text-lg font-bold mb-3">Sessions</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-1.5"></div>
          <div className="h-8 bg-gray-200 rounded mb-1.5"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 border-r border-gray-200 h-full">
        <h2 className="text-lg font-bold mb-3">Sessions</h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-3 border-r border-gray-200 h-full overflow-auto">
      <h2 className="text-lg font-bold mb-3">Sessions</h2>
      
      {sessions.length === 0 ? (
        <div className="text-gray-500 text-sm">No saved sessions yet</div>
      ) : (
        <ul className="space-y-1.5">
          {sessions.map((session, index) => (
            <li 
              key={session.id}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => onSelectSession(session)}
            >
              <div className="font-medium text-sm">{session.name || `Session ${index + 1}`}</div>
              <div className="text-xs text-gray-500">
                Total: {formatTime(session.totalTime)}
              </div>
              <div className="text-xs text-gray-400">
                {session.splits?.length || 0} splits • {session.mode}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
