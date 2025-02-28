'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '../lib/timeUtils';

/**
 * Component to display a list of saved timer sessions
 */
export default function SessionList({ onSelectSession, selectedSessionId }) {
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
      <div className="h-full flex flex-col">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Sessions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Sessions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Sessions</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} saved
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {sessions.length > 0 ? (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li 
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSessionId === session.id 
                    ? 'bg-yellow-100 border-l-4 border-yellow-500' 
                    : 'hover:bg-gray-100 border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm sm:text-base">
                      {session.name || `Session ${session.id}`}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      {formatDate(session.startTime)}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-gray-700">
                    {formatTime(session.totalTime)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            No saved sessions yet
          </div>
        )}
      </div>
    </div>
  );
}
