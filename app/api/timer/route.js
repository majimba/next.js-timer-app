// API route for timer data operations
import { NextResponse } from 'next/server';

// Mock data for server-side rendering
// In a real app, this would come from a database
const mockSessions = [
  { 
    id: 'session1',
    startTime: '2025-02-28T16:30:00.000Z',
    endTime: '2025-02-28T16:35:30.000Z',
    totalTime: 330000,
    mode: 'lap',
    splits: [
      { time: 60000, totalTime: 60000 },
      { time: 120000, totalTime: 180000 },
      { time: 150000, totalTime: 330000 }
    ],
    savedAt: '2025-02-28T16:35:31.000Z'
  },
  { 
    id: 'session2',
    startTime: '2025-02-28T16:00:00.000Z',
    endTime: '2025-02-28T16:10:45.000Z',
    totalTime: 645000,
    mode: 'cumulative',
    splits: [
      { time: 120000, totalTime: 120000 },
      { time: 240000, totalTime: 360000 },
      { time: 285000, totalTime: 645000 }
    ],
    savedAt: '2025-02-28T16:10:46.000Z'
  }
];

export async function GET(request) {
  // In a real implementation, this would fetch from a database
  return NextResponse.json({ 
    status: 'success',
    data: mockSessions
  });
}

export async function POST(request) {
  try {
    const session = await request.json();
    
    // Validate required fields
    if (!session.totalTime) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Total time is required'
      }, { status: 400 });
    }
    
    // Generate a new session object
    const newSession = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      startTime: session.startTime || new Date().toISOString(),
      endTime: session.endTime || new Date().toISOString(),
      totalTime: session.totalTime,
      mode: session.mode || 'lap',
      splits: session.splits || [],
      savedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would save to a database
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Session saved successfully',
      data: newSession
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, { status: 400 });
  }
}
