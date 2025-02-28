'use client';

import { useState, useEffect, useRef } from 'react';
import { saveSession } from '../lib/sessionStorage';
import { formatTime, formatTimeShort } from '../lib/timeUtils';

/**
 * Timer component with session management functionality
 */
export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [splits, setSplits] = useState([]);
  const [splitMode, setSplitMode] = useState('lap'); // 'lap' or 'cumulative'
  const intervalRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      // Record session start time when timer starts
      if (!sessionStartTimeRef.current) {
        sessionStartTimeRef.current = new Date();
      }
      
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); // Update every 10ms for millisecond precision
      }, 10); // Run interval every 10ms instead of 1000ms
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    // Start a new session
    sessionStartTimeRef.current = new Date();
    setIsRunning(true);
  };

  const stopTimer = () => {
    // Record a final split when stopping the timer if there's at least one split already
    // or if the timer has been running for some time
    if ((splits.length > 0 || time > 0) && isRunning) {
      setSplits(prevSplits => [...prevSplits, time]);
    }
    
    setIsRunning(false);
    
    // Save the session when stopping the timer
    if (time > 0 && sessionStartTimeRef.current) {
      const sessionEndTime = new Date();
      
      // Process the splits into the format we need for storage
      const processedSplits = [];
      
      for (let i = 0; i < splits.length; i++) {
        const splitTime = splits[i];
        const lapTime = i === 0 ? splitTime : splitTime - splits[i-1];
        
        processedSplits.push({
          time: splitMode === 'lap' ? lapTime : splitTime,
          totalTime: splitTime
        });
      }
      
      // Add the final split if it's not already included
      if (splits.length === 0 || splits[splits.length - 1] !== time) {
        const lapTime = splits.length === 0 ? time : time - splits[splits.length - 1];
        
        processedSplits.push({
          time: splitMode === 'lap' ? lapTime : time,
          totalTime: time
        });
      }
      
      // Create the session object
      const newSession = {
        startTime: sessionStartTimeRef.current.toISOString(),
        endTime: sessionEndTime.toISOString(),
        totalTime: time,
        mode: splitMode,
        splits: processedSplits
      };
      
      // Save to localStorage using the utility function
      saveSession(newSession);
      
      // Reset session start time
      sessionStartTimeRef.current = null;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setSplits([]);
    
    // Reset session start time
    sessionStartTimeRef.current = null;
    
    // Clear any existing interval to prevent memory leaks
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const addSplit = () => {
    if (isRunning) {
      setSplits(prevSplits => [...prevSplits, time]);
    }
  };

  // Format time for display
  const formatTimeValue = (timeValue) => {
    const minutes = Math.floor(timeValue / 60000);
    const seconds = Math.floor((timeValue % 60000) / 1000);
    const milliseconds = Math.floor((timeValue % 1000) / 10);

    return [
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
      milliseconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="flex items-center justify-center flex-grow relative">
      {/* Decorative elements for modern UI feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-4000"></div>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mx-4 backdrop-blur-sm bg-white/90 z-10 border border-yellow-100">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-yellow-500 font-mono tracking-wider bg-yellow-50 py-4 px-6 rounded-lg w-full">{formatTimeValue(time)}</h1>
          
          {/* Split counter */}
          {splits.length > 0 && (
            <div className="mb-4 bg-yellow-50 py-2 px-4 rounded-lg">
              <span className="text-yellow-700 font-medium">
                Splits: <span className="text-yellow-800 font-bold ml-1">{splits.length}</span>
              </span>
            </div>
          )}
          
          {/* Mode toggle */}
          <div className="mb-6 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">Mode:</span>
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setSplitMode('lap')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  splitMode === 'lap' 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lap
              </button>
              <button
                onClick={() => setSplitMode('cumulative')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  splitMode === 'cumulative' 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cumulative
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6 w-full">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors text-sm sm:text-base font-medium"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors text-sm sm:text-base font-medium"
              >
                Stop
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-4 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-500 hover:text-white transition-colors text-sm sm:text-base font-medium"
            >
              Reset
            </button>
            {isRunning && (
              <button
                onClick={addSplit}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors text-sm sm:text-base font-medium"
              >
                Split
              </button>
            )}
          </div>
          
          {splits.length > 0 && (
            <div className="mt-8 w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Split Times
              </h2>
              <div className="max-h-60 overflow-y-auto overflow-x-auto rounded-lg shadow">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">#</th>
                      <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">
                        {splitMode === 'lap' ? 'Lap Time' : 'Total Time'}
                      </th>
                      <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">
                        {splitMode === 'lap' ? 'Total Time' : 'Difference'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.map((splitTime, index) => {
                      const prevSplitTime = index > 0 ? splits[index - 1] : 0;
                      const lapTime = splitTime - prevSplitTime;
                      
                      // For cumulative mode, calculate time difference between runners
                      const timeDiff = index > 0 ? lapTime : splitTime;
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-yellow-50"}>
                          <td className="py-3 px-4 border-b border-yellow-100 text-yellow-800 font-medium text-sm sm:text-base">{index + 1}</td>
                          <td className="py-3 px-4 border-b border-yellow-100 font-mono text-yellow-800 font-medium text-sm sm:text-base">
                            {splitMode === 'lap' 
                              ? formatTimeValue(lapTime) 
                              : formatTimeValue(splitTime)}
                          </td>
                          <td className="py-3 px-4 border-b border-yellow-100 font-mono text-yellow-800 font-medium text-sm sm:text-base">
                            {splitMode === 'lap' 
                              ? formatTimeValue(splitTime) 
                              : formatTimeValue(timeDiff)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
