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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!session) {
    return (
      <div className="p-3 sm:p-6 bg-white rounded-lg shadow-sm">
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
      setShowDeleteConfirm(true);
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

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await handleDelete();
    setIsDeleting(false);
  };

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
            <input
              type="text"
              className="flex-1 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              autoFocus
            />
            <div className="flex space-x-2">
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
          </div>
        ) : (
          <>
            <h3 className="text-lg sm:text-xl font-bold">{session.name || 'Unnamed Session'}</h3>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="text-xs sm:text-sm text-gray-500">Start Time</div>
          <div className="text-sm sm:text-base">{formatDate(session.startTime)}</div>
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-500">End Time</div>
          <div className="text-sm sm:text-base">{formatDate(session.endTime)}</div>
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-500">Duration</div>
          <div className="text-sm sm:text-base">{durationMinutes}m {durationSeconds}s</div>
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-500">Mode</div>
          <div className="capitalize text-sm sm:text-base">{session.mode}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Total Time</div>
        <div className="text-xl sm:text-2xl font-mono">{formatTime(session.totalTime)}</div>
      </div>
      
      {session.splits && session.splits.length > 0 ? (
        <div>
          <div className="text-base sm:text-lg font-semibold mb-2">Splits</div>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1 sm:p-2 pl-3 sm:pl-2">#</th>
                  <th className="p-1 sm:p-2">
                    {session.mode === 'lap' ? 'Lap Time' : 'Total Time'}
                  </th>
                  <th className="p-1 sm:p-2 pr-3 sm:pr-2">
                    {session.mode === 'lap' ? 'Total Time' : 'Difference'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {session.splits.map((split, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-1 sm:p-2 pl-3 sm:pl-2">{index + 1}</td>
                    <td className="p-1 sm:p-2 font-mono">
                      {formatTime(split.time)}
                    </td>
                    <td className="p-1 sm:p-2 pr-3 sm:pr-2 font-mono">
                      {formatTime(split.totalTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No splits recorded for this session.</div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          className={`px-4 py-2 ${isDeleting ? 'bg-red-600' : 'bg-red-500'} text-white rounded hover:bg-red-600 transition-colors`}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Session
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this session? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`px-3 py-2 ${isDeleting ? 'bg-red-600' : 'bg-red-500'} text-white rounded-md hover:bg-red-600 transition-colors`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
