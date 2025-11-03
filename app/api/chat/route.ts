import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, topic, subject } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Build context-aware prompt
    const systemPrompt = `You are an expert AI tutor helping students learn about ${topic} in the subject ${subject}. 
    Provide clear, concise, and educational responses. Use simple language and examples when possible.
    If the question is complex, break it down into steps.`;

    const prompt = `${systemPrompt}\n\nStudent question: ${message}\n\nPlease provide a helpful response:`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error('Failed to get response from Gemini');
    }

    const data = await response.json();
    
    // Extract the response text
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
