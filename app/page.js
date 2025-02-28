"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [splits, setSplits] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
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
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setSplits([]);
  };

  const addSplit = () => {
    if (isRunning) {
      setSplits(prevSplits => [...prevSplits, time]);
    }
  };

  // Format time to display as MM:SS:MS
  const formatTime = () => {
    return formatTimeValue(time);
  };
  
  // Helper function to format any time value
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
              <button className="ml-3 p-1 rounded-full text-gray-400 hover:text-yellow-500 focus:outline-none relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Timer section */}
      <div className="flex items-center justify-center flex-grow relative">
        {/* Decorative elements for modern UI feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mx-4 backdrop-blur-sm bg-white/90 z-10 border border-yellow-100">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-yellow-500 font-mono tracking-wider bg-yellow-50 py-4 px-6 rounded-lg w-full">{formatTime()}</h1>
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
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Splits</h2>
                <div className="max-h-60 overflow-y-auto overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-yellow-50">
                        <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">#</th>
                        <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">Split Time</th>
                        <th className="py-3 px-4 font-semibold text-yellow-800 border-b border-yellow-200 text-sm sm:text-base">Overall Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {splits.map((splitTime, index) => {
                        const prevSplitTime = index > 0 ? splits[index - 1] : 0;
                        const lapTime = splitTime - prevSplitTime;
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-yellow-50"}>
                            <td className="py-3 px-4 border-b border-yellow-100 text-yellow-800 font-medium text-sm sm:text-base">{index + 1}</td>
                            <td className="py-3 px-4 border-b border-yellow-100 font-mono text-yellow-800 font-medium text-sm sm:text-base">{formatTimeValue(lapTime)}</td>
                            <td className="py-3 px-4 border-b border-yellow-100 font-mono text-yellow-800 font-medium text-sm sm:text-base">{formatTimeValue(splitTime)}</td>
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
      
      {/* Bottom Navbar */}
      <footer className="bg-white/90 backdrop-blur-sm shadow-md mt-auto border-t border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <aside className="flex items-center">
              <p className="text-yellow-500">Copyright {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <nav className="flex gap-4">
              <a className="text-yellow-500 hover:text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current text-yellow-500">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a className="text-yellow-500 hover:text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current text-yellow-500">
                  <path
                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a className="text-yellow-500 hover:text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current text-yellow-500">
                  <path
                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
