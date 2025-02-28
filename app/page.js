'use client';

import { useState, useEffect, useRef } from 'react';
import TimerLayout from '../components/TimerLayout';
import { formatTime } from '../lib/timeUtils';
import { saveSession as saveSessionToStorage } from '../lib/sessionStorage';

export default function Home() {
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [splits, setSplits] = useState([]);
  const [timerMode, setTimerMode] = useState('lap'); // 'lap' or 'cumulative'
  
  // Refs for interval
  const intervalRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  // Start the timer
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const now = new Date();
    
    if (!startTime) {
      setStartTime(now);
    }
    
    lastTimeRef.current = Date.now() - elapsedTime;
    
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(currentTime - lastTimeRef.current);
    }, 10); // Update every 10ms for smoother display
  };
  
  // Stop the timer
  const stopTimer = () => {
    if (!isRunning) return;
    
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };
  
  // Reset the timer
  const resetTimer = () => {
    stopTimer();
    setElapsedTime(0);
    setStartTime(null);
    setSplits([]);
  };
  
  // Record a split
  const recordSplit = () => {
    if (!isRunning) return;
    
    const newSplit = {
      time: timerMode === 'lap' && splits.length > 0 
        ? elapsedTime - splits[splits.length - 1].totalTime 
        : elapsedTime,
      totalTime: elapsedTime,
      timestamp: new Date().toISOString()
    };
    
    setSplits([...splits, newSplit]);
  };
  
  // Toggle timer mode
  const toggleMode = () => {
    if (isRunning || splits.length > 0) {
      alert('Cannot change mode while timer is running or has splits');
      return;
    }
    
    setTimerMode(timerMode === 'lap' ? 'cumulative' : 'lap');
  };
  
  // Save the current session
  const saveCurrentSession = () => {
    if (splits.length === 0) {
      alert('No splits to save!');
      return;
    }

    // Create session data
    const sessionData = {
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      totalTime: elapsedTime,
      mode: timerMode,
      splits: splits.map(split => ({
        time: split.time,
        totalTime: split.totalTime
      }))
    };

    // Save to sessionStorage using our utility
    const savedSession = saveSessionToStorage(sessionData);
    
    // Also save to API if available
    try {
      fetch('/api/timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Error saving to API:', error);
      // Continue since we already saved to sessionStorage
    }

    alert('Session saved successfully!');
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <TimerLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Timer Display */}
          <div className="p-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Timer</h2>
            <div className="text-6xl font-mono font-bold text-white tracking-wider">
              {formatTime(elapsedTime)}
            </div>
            <div className="mt-2 text-yellow-100">
              Mode: <span className="capitalize">{timerMode}</span>
            </div>
          </div>
          
          {/* Timer Controls */}
          <div className="p-6 flex justify-center space-x-4">
            <button
              onClick={isRunning ? stopTimer : startTimer}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>
            
            <button
              onClick={recordSplit}
              disabled={!isRunning}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                isRunning 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Split
            </button>
            
            <button
              onClick={resetTimer}
              disabled={isRunning && elapsedTime === 0}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                elapsedTime > 0 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Reset
            </button>
            
            <button
              onClick={toggleMode}
              disabled={isRunning || splits.length > 0}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                isRunning || splits.length > 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
              title="Toggle between lap and cumulative modes"
            >
              Mode
            </button>
            
            <button
              onClick={saveCurrentSession}
              disabled={splits.length === 0}
              className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-colors ${
                splits.length > 0
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
          
          {/* Splits Display */}
          {splits.length > 0 && (
            <div className="p-6 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-4">Splits</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">#</th>
                      <th className="p-2">
                        {timerMode === 'lap' ? 'Lap Time' : 'Total Time'}
                      </th>
                      <th className="p-2">
                        {timerMode === 'lap' ? 'Total Time' : 'Difference'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.map((split, index) => (
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
          )}
        </div>
      </div>
    </TimerLayout>
  );
}
