'use client';

import { useState, useEffect } from 'react';
import SessionList from './SessionList';
import SessionDetail from './SessionDetail';
import { getSessions } from '../lib/sessionStorage';

/**
 * Component that provides the layout for the timer application
 * with session management sidebar and details panel
 */
export default function TimerLayout({ children }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sessions, setSessions] = useState([]);

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = () => {
      const allSessions = getSessions();
      setSessions(allSessions);
    };

    loadSessions();

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'timer_sessions') {
        loadSessions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handler for selecting a session
  const handleSelectSession = (session) => {
    setSelectedSession(session);
  };

  // Handler for updating a session
  const handleSessionUpdate = (updatedSession) => {
    setSessions(prevSessions => {
      const newSessions = prevSessions.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      );
      return newSessions;
    });
    
    setSelectedSession(updatedSession);
  };

  // Handler for deleting a session
  const handleSessionDelete = (sessionId) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    setSelectedSession(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Top Navbar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
                className="fill-current text-yellow-500">
                <path
                  d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
              </svg>
              <div className="flex-shrink-0 flex items-center ml-3">
                <span className="text-3xl font-black text-yellow-500 px-3 py-1 rounded hover:bg-yellow-100 transition-colors duration-200" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>Timer App</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <button className="ml-3 p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar and timer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Session sidebar - hidden on mobile by default */}
        <div className={`w-64 bg-white shadow-md ${showSidebar ? 'block' : 'hidden'} md:block flex-shrink-0`}>
          <SessionList 
            onSelectSession={handleSelectSession} 
            sessions={sessions}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden p-4">
            <button 
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? 'Hide Sessions' : 'Show Sessions'}
            </button>
          </div>
          
          {/* Timer section */}
          <div className="flex-1 flex flex-col">
            {children}
            
            {/* Session detail section - show when a session is selected */}
            {selectedSession && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <SessionDetail 
                  session={selectedSession} 
                  onSessionUpdate={handleSessionUpdate}
                  onSessionDelete={handleSessionDelete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navbar */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="text-sm text-gray-500">
              Timer App &copy; 2025
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500">Help</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500">Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
