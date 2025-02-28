// API route for timer data operations
import { NextResponse } from 'next/server';

export async function GET(request) {
  // This would typically fetch timer data from a database
  // For now, we'll return mock data
  const mockTimerData = [
    { id: '1', time: 12345, splits: [1000, 3000, 7000], mode: 'lap', createdAt: new Date().toISOString() },
    { id: '2', time: 45678, splits: [10000, 25000, 45000], mode: 'cumulative', createdAt: new Date().toISOString() }
  ];
  
  return NextResponse.json({ 
    status: 'success',
    data: mockTimerData
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // This would typically save timer data to a database
    // For now, we'll just echo back the received data
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Timer data saved successfully',
      data: {
        id: Math.random().toString(36).substring(2, 9),
        ...body,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: error.message 
    }, { status: 400 });
  }
}
