import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { videoTitle, topic, subject } = await req.json();

    if (!videoTitle || !topic) {
      return NextResponse.json(
        { error: 'Video title and topic are required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please contact administrator.' },
        { status: 503 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate a quiz with 5 multiple-choice questions based on the following educational video:
    
Video Title: ${videoTitle}
Topic: ${topic}
Subject: ${subject || 'General'}

Requirements:
1. Create exactly 5 questions that test understanding of the key concepts covered in this video
2. Each question should have 4 options (A, B, C, D)
3. Mark the correct answer
4. Questions should range from basic understanding to application level
5. Make questions engaging and educational

Format your response as a JSON array of objects with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text.trim();
    
    // Remove markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    
    text = text.trim();

    // Parse the JSON
    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', text);
      throw new Error('AI generated invalid response format');
    }

    // Validate the quiz structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Invalid quiz format: expected array of questions');
    }

    // Validate each question
    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || !q.explanation) {
        throw new Error(`Invalid question format at index ${i}`);
      }
    }

    return NextResponse.json({ quiz });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    
    // Provide specific error messages
    let errorMessage = 'Failed to generate quiz';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'AI API key invalid or expired';
      statusCode = 503;
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'AI service quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout. Please try again.';
      statusCode = 504;
    } else if (error.message?.includes('parse') || error.message?.includes('format')) {
      errorMessage = 'AI generated invalid response. Please try again.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: statusCode }
    );
  }
}
