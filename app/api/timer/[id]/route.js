// API route for individual timer sessions
import { NextResponse } from 'next/server';

// Mock data for server-side rendering
// This would come from a database in a real app
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

export async function GET(request, { params }) {
  const id = params.id;
  
  // Find the session by ID
  const session = mockSessions.find(s => s.id === id);
  
  if (!session) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Session not found'
    }, { status: 404 });
  }
  
  return NextResponse.json({ 
    status: 'success',
    data: session
  });
}

export async function DELETE(request, { params }) {
  const id = params.id;
  
  // In a real implementation, this would delete from a database
  // For now, we'll just pretend it was deleted
  
  // Check if session exists
  const sessionExists = mockSessions.some(s => s.id === id);
  
  if (!sessionExists) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Session not found'
    }, { status: 404 });
  }
  
  return NextResponse.json({ 
    status: 'success',
    message: 'Session deleted successfully'
  });
}
