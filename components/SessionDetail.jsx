'use client';

import { formatTime } from '../lib/timeUtils';

/**
 * Component to display details of a selected timer session
 */
export default function SessionDetail({ session }) {
  if (!session) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-gray-500 text-center">
          Select a session to view details
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate session duration
  const sessionDuration = new Date(session.endTime) - new Date(session.startTime);
  const durationMinutes = Math.floor(sessionDuration / 60000);
  const durationSeconds = Math.floor((sessionDuration % 60000) / 1000);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4">Session Details</h3>
      
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
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={() => {
            // This would call an API to delete the session
            alert('Delete functionality would be implemented here');
          }}
        >
          Delete Session
        </button>
      </div>
    </div>
  );
}
