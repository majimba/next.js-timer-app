'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '../lib/timeUtils';
import { updateSession, deleteSession } from '../lib/sessionStorage';

/**
 * Component to display details of a selected timer session
 */
export default function SessionDetail({ session, onSessionUpdate, onSessionDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!session) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-gray-500 text-center">
          Select a session to view details
        </div>
      </div>
    );
  }

  // Initialize session name when session changes
  useEffect(() => {
    if (session) {
      setSessionName(session.name || '');
    }
  }, [session]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate session duration
  const sessionDuration = new Date(session.endTime) - new Date(session.startTime);
  const durationMinutes = Math.floor(sessionDuration / 60000);
  const durationSeconds = Math.floor((sessionDuration % 60000) / 1000);

  // Handle session rename
  const handleRename = async () => {
    if (!sessionName.trim()) {
      return;
    }

    try {
      // Update session in localStorage
      const updatedSession = updateSession(session.id, { name: sessionName });
      
      // Also update via API if available
      try {
        const response = await fetch(`/api/timer/${session.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: sessionName }),
        });
      } catch (apiError) {
        console.error('API update failed, but localStorage was updated:', apiError);
      }
      
      // Notify parent component
      if (onSessionUpdate) {
        onSessionUpdate(updatedSession);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error renaming session:', error);
      alert('Failed to rename session. Please try again.');
    }
  };

  // Handle session delete
  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    try {
      // Delete from localStorage
      deleteSession(session.id);
      
      // Also delete via API if available
      try {
        const response = await fetch(`/api/timer/${session.id}`, {
          method: 'DELETE',
        });
      } catch (apiError) {
        console.error('API delete failed, but localStorage was updated:', apiError);
      }
      
      // Notify parent component
      if (onSessionDelete) {
        onSessionDelete(session.id);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              autoFocus
            />
            <button
              className="px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              onClick={handleRename}
            >
              Save
            </button>
            <button
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => {
                setSessionName(session.name || '');
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold">{session.name || 'Unnamed Session'}</h3>
            <button
              className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
              onClick={() => {
                setSessionName(session.name || '');
                setIsEditing(true);
              }}
              title="Rename session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-500">Start Time</div>
          <div>{formatDate(session.startTime)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">End Time</div>
          <div>{formatDate(session.endTime)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Duration</div>
          <div>{durationMinutes}m {durationSeconds}s</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Mode</div>
          <div className="capitalize">{session.mode}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-lg font-semibold mb-2">Total Time</div>
        <div className="text-2xl font-mono">{formatTime(session.totalTime)}</div>
      </div>
      
      {session.splits && session.splits.length > 0 ? (
        <div>
          <div className="text-lg font-semibold mb-2">Splits</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">#</th>
                  <th className="p-2">
                    {session.mode === 'lap' ? 'Lap Time' : 'Total Time'}
                  </th>
                  <th className="p-2">
                    {session.mode === 'lap' ? 'Total Time' : 'Difference'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {session.splits.map((split, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-mono">
                      {formatTime(split.time)}
                    </td>
                    <td className="p-2 font-mono">
                      {formatTime(split.totalTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No splits recorded for this session</div>
      )}
      
      <div className="mt-6 text-right">
        <button 
          className={`px-4 py-2 ${isDeleting ? 'bg-red-600' : 'bg-red-500'} text-white rounded hover:bg-red-600 transition-colors`}
          onClick={handleDelete}
        >
          {isDeleting ? 'Confirm Delete' : 'Delete Session'}
        </button>
      </div>
    </div>
  );
}
