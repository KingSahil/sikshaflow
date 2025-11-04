"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Clock, Eye, ThumbsUp, X, Loader2, Send, Bot, CheckCircle2, Circle, Brain, Trophy, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Declare YouTube types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

function VideosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [videoWatched, setVideoWatched] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const playerRef = useRef<any>(null);
  const [subtopics, setSubtopics] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  // Load YouTube iframe API
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    const topic = searchParams.get("topic") || "";
    const subject = searchParams.get("subject") || "";
    const subtopicsParam = searchParams.get("subtopics") || "";
    
    console.log('Videos page loaded - Topic:', topic, 'Subject:', subject);
    setTopicTitle(topic);
    setSubjectName(subject);

    // Parse subtopics from URL if available
    if (subtopicsParam) {
      try {
        const parsedSubtopics = JSON.parse(decodeURIComponent(subtopicsParam));
        setSubtopics(parsedSubtopics);
      } catch (err) {
        console.error('Error parsing subtopics:', err);
      }
    }

    if (topic) {
      fetchVideos(topic);
    }
  }, [searchParams]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Listen for storage changes to update subtopics completion in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('video-completed-') && e.newValue === 'true') {
        const completedTitle = e.key.replace('video-completed-', '');
        setSubtopics(prev => prev.map(st => 
          st.title === completedTitle ? { ...st, completed: true } : st
        ));
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'videoCompleted') {
        const completedTitle = event.data.subtopicTitle;
        setSubtopics(prev => prev.map(st => 
          st.title === completedTitle ? { ...st, completed: true } : st
        ));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const fetchVideos = async (query: string) => {
    setLoading(true);
    setError(null);
    console.log('Fetching videos for query:', query);

    try {
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(query + " tutorial")}&maxResults=12`);
      console.log('YouTube API response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      console.log('Fetched videos:', data.items?.length || 0, 'videos');
      setVideos(data.items || []);
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleVideoComplete = () => {
    console.log('Video marked as complete for topic:', topicTitle);
    setVideoWatched(true);
    setShowCompletionMessage(true);
    
    // Store completion in localStorage
    const completedKey = `video-completed-${topicTitle}`;
    localStorage.setItem(completedKey, 'true');
    
    // Update subtopics state immediately
    setSubtopics(prev => prev.map(st => 
      st.title === topicTitle ? { ...st, completed: true } : st
    ));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('videoCompleted', { 
      detail: { subtopicTitle: topicTitle } 
    }));
    
    // Try to notify the opener window (parent tab) if it exists
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({ 
          type: 'videoCompleted', 
          subtopicTitle: topicTitle 
        }, window.location.origin);
      } catch (err) {
        console.log('Could not notify opener window:', err);
      }
    }
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setShowCompletionMessage(false);
    }, 3000);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setVideoEnded(false);
    setShowCompleteButton(false);
    setVideoWatched(false); // Reset watched state when closing
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  const handleVideoSelect = (videoId: string, videoTitle: string = "") => {
    setSelectedVideo(videoId);
    setCurrentVideoTitle(videoTitle);
    setVideoEnded(false);
    setShowCompleteButton(false);
    setShowQuiz(false);
    setQuizQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);
    
    // Check if current topic is already completed
    const completedKey = `video-completed-${topicTitle}`;
    const isAlreadyCompleted = localStorage.getItem(completedKey) === 'true';
    setVideoWatched(isAlreadyCompleted);
    
    // Initialize YouTube player after a short delay
    setTimeout(() => {
      if (window.YT && window.YT.Player) {
        initializePlayer(videoId);
      } else {
        // Wait for API to load
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer(videoId);
        };
      }
    }, 500);
  };

  const initializePlayer = (videoId: string) => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        enablejsapi: 1,
      },
      events: {
        onStateChange: (event: any) => {
          // YT.PlayerState.ENDED = 0
          if (event.data === 0) {
            console.log('Video ended!');
            setVideoEnded(true);
            setShowCompleteButton(true);
          }
        },
      },
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSendingMessage) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSendingMessage(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          topic: topicTitle,
          subject: subjectName 
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Add assistant message to chat
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSubtopicClick = (subtopic: { id: string; title: string; completed: boolean }) => {
    console.log('Subtopic clicked from sidebar:', subtopic.title);
    
    // Set active subtopic for visual feedback
    setActiveSubtopicId(subtopic.id);
    
    // Close the current video modal
    handleCloseVideo();
    
    // Update topic title to the selected subtopic
    setTopicTitle(subtopic.title);
    
    // Fetch new videos for this subtopic
    fetchVideos(subtopic.title);
    
    // Reset active subtopic after a short delay
    setTimeout(() => {
      setActiveSubtopicId(null);
    }, 1000);
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setShowQuiz(true);
    setQuizQuestions([]);
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: currentVideoTitle,
          topic: topicTitle,
          subject: subjectName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error('Invalid quiz data received');
      }
      
      setQuizQuestions(data.quiz);
    } catch (error) {
      console.error('Quiz generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Show user-friendly error message
      if (errorMessage.includes('API key') || errorMessage.includes('quota')) {
        alert('⚠️ AI service temporarily unavailable. Please try again in a few moments.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        alert('⚠️ Network error. Please check your connection and try again.');
      } else {
        alert(`⚠️ Failed to generate quiz: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
      }
      
      setShowQuiz(false);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setShowResults(true);
    
    // Store quiz completion with score
    const quizKey = `quiz-completed-${topicTitle}`;
    const quizScoreKey = `quiz-score-${topicTitle}`;
    localStorage.setItem(quizKey, 'true');
    localStorage.setItem(quizScoreKey, score.toString());
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[95vw] h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Sidebar - AI Chatbot */}
              <div className="w-80 bg-gray-900 flex flex-col border-r border-gray-700">
                {/* Chat Header */}
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Tutor</h3>
                      <p className="text-xs text-green-100">Powered by Gemini 2.5 Pro</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p>Ask me anything about {topicTitle}!</p>
                      <p className="text-xs mt-2">I'm here to help you understand better.</p>
                    </div>
                  )}
                  
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}>
                        {msg.role === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="text-sm prose prose-invert prose-sm max-w-none
                            prose-p:my-2 prose-p:leading-relaxed
                            prose-headings:text-gray-100 prose-headings:font-bold
                            prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
                            prose-strong:text-white prose-strong:font-bold
                            prose-em:text-blue-300 prose-em:italic
                            prose-code:text-green-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                            prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                            prose-a:text-green-400 prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-4 prose-blockquote:italic
                          ">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath, remarkGfm]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                // Custom component for better code block styling
                                code: ({node, className, children, ...props}: any) => {
                                  const isInline = !className || !className.includes('language-');
                                  return isInline ? (
                                    <code className="text-green-300 bg-gray-900 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                      {children}
                                    </code>
                                  ) : (
                                    <code className="block bg-gray-900 p-3 rounded-lg border border-gray-700 text-xs font-mono overflow-x-auto" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                // Style links
                                a: ({node, children, ...props}) => (
                                  <a className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer" {...props}>
                                    {children}
                                  </a>
                                ),
                                // Style lists
                                ul: ({node, children, ...props}) => (
                                  <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                                    {children}
                                  </ul>
                                ),
                                ol: ({node, children, ...props}) => (
                                  <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                                    {children}
                                  </ol>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isSendingMessage && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                          <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm border border-gray-700 focus:outline-none focus:border-green-500"
                      disabled={isSendingMessage}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isSendingMessage}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Center - Video Player */}
              <div className="flex-1 flex flex-col">
                {/* Close Button */}
                <button
                  onClick={handleCloseVideo}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Completion Message */}
                <AnimatePresence>
                  {showCompletionMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-semibold"
                    >
                      ✓ Video Marked Complete!
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Player */}
                <div className="flex-1 bg-black">
                  <div id="youtube-player" className="w-full h-full"></div>
                </div>

                {/* Mark Complete Button */}
                <div className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
                  <div className="text-white">
                    <p className="text-sm text-gray-400">Watching: {topicTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {videoWatched ? '✓ Marked as complete' : videoEnded ? 'Video finished! Click to mark complete' : 'Watch the video till the end to unlock completion'}
                    </p>
                  </div>
                  {!videoWatched && showCompleteButton && (
                    <button
                      onClick={handleVideoComplete}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 animate-pulse"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Mark as Complete
                    </button>
                  )}
                  {videoWatched && (
                    <button
                      onClick={handleCloseVideo}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Back to Topics
                    </button>
                  )}
                </div>

                {/* Quiz Section */}
                <div className="bg-gray-800 p-4">
                  {!showQuiz ? (
                    <button
                      onClick={handleGenerateQuiz}
                      disabled={isGeneratingQuiz}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Quiz with AI...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          <Sparkles className="w-4 h-4" />
                          Generate Quiz with Gemini AI
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {isGeneratingQuiz ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                          <p className="text-white font-semibold">Creating personalized quiz...</p>
                          <p className="text-sm text-gray-400 mt-2">AI is analyzing the video content</p>
                        </div>
                      ) : showResults ? (
                        <div className="space-y-4">
                          {/* Quiz Results */}
                          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-center">
                            <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                            <p className="text-3xl font-bold text-white mb-2">
                              {quizScore} / {quizQuestions.length}
                            </p>
                            <p className="text-white/90">
                              {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
                            </p>
                          </div>

                          {/* Review Answers */}
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {quizQuestions.map((q, idx) => {
                              const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                              return (
                                <div key={idx} className={`rounded-xl p-4 border-2 ${isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                                  <div className="flex items-start gap-2 mb-3">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                                    ) : (
                                      <X className="w-5 h-5 text-red-400 mt-0.5" />
                                    )}
                                    <p className="text-white font-semibold flex-1">Q{idx + 1}: {q.question}</p>
                                  </div>
                                  <div className="ml-7 space-y-2">
                                    {q.options.map((opt: string, optIdx: number) => (
                                      <div
                                        key={optIdx}
                                        className={`p-2 rounded-lg text-sm ${
                                          optIdx === q.correctAnswer
                                            ? 'bg-green-700/50 text-green-100 font-semibold'
                                            : optIdx === selectedAnswers[idx] && optIdx !== q.correctAnswer
                                            ? 'bg-red-700/50 text-red-100'
                                            : 'bg-gray-700/50 text-gray-300'
                                        }`}
                                      >
                                        {String.fromCharCode(65 + optIdx)}. {opt}
                                        {optIdx === q.correctAnswer && ' ✓'}
                                        {optIdx === selectedAnswers[idx] && optIdx !== q.correctAnswer && ' ✗'}
                                      </div>
                                    ))}
                                    <p className="text-gray-300 text-xs mt-2 italic">
                                      💡 {q.explanation}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setShowQuiz(false);
                                setQuizQuestions([]);
                                setSelectedAnswers({});
                                setShowResults(false);
                                setCurrentQuestionIndex(0);
                              }}
                              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                            >
                              Close Quiz
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAnswers({});
                                setShowResults(false);
                                setCurrentQuestionIndex(0);
                                handleGenerateQuiz();
                              }}
                              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                            >
                              Try New Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div className="flex items-center justify-between text-white mb-2">
                            <span className="text-sm font-semibold">
                              Question {currentQuestionIndex + 1} of {quizQuestions.length}
                            </span>
                            <span className="text-sm text-gray-400">
                              {Object.keys(selectedAnswers).length}/{quizQuestions.length} answered
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                            />
                          </div>

                          {/* Current Question */}
                          {quizQuestions[currentQuestionIndex] && (
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                              <h4 className="text-lg font-bold text-white mb-4">
                                {quizQuestions[currentQuestionIndex].question}
                              </h4>
                              <div className="space-y-3">
                                {quizQuestions[currentQuestionIndex].options.map((option: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(currentQuestionIndex, idx)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                      selectedAnswers[currentQuestionIndex] === idx
                                        ? 'border-purple-500 bg-purple-900/30 text-white'
                                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                                        selectedAnswers[currentQuestionIndex] === idx
                                          ? 'border-purple-500 bg-purple-600 text-white'
                                          : 'border-gray-600 text-gray-400'
                                      }`}>
                                        {String.fromCharCode(65 + idx)}
                                      </div>
                                      <span className="flex-1">{option}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Navigation Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={handlePreviousQuestion}
                              disabled={currentQuestionIndex === 0}
                              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                            >
                              Previous
                            </button>
                            {currentQuestionIndex < quizQuestions.length - 1 ? (
                              <button
                                onClick={handleNextQuestion}
                                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                Next Question
                              </button>
                            ) : (
                              <button
                                onClick={handleSubmitQuiz}
                                disabled={Object.keys(selectedAnswers).length !== quizQuestions.length}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <Trophy className="w-5 h-5" />
                                Submit Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Progress Tracker */}
              <div className="w-80 bg-gray-900 flex flex-col border-l border-gray-700">
                {/* Progress Header */}
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 border-b border-gray-700">
                  <h3 className="font-bold text-white mb-2">Learning Progress</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-100">
                      {subtopics.filter(st => st.completed).length}/{subtopics.length} Complete
                    </span>
                    <span className="text-green-100 font-semibold">
                      {Math.round((subtopics.filter(st => st.completed).length / subtopics.length) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(subtopics.filter(st => st.completed).length / subtopics.length) * 100}%` 
                      }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Subtopics List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {subtopics.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                      <Circle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                      <p>No subtopics available</p>
                    </div>
                  ) : (
                    subtopics.map((subtopic, index) => (
                      <motion.button
                        key={subtopic.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSubtopicClick(subtopic)}
                        disabled={activeSubtopicId === subtopic.id}
                        className={`w-full p-3 rounded-lg border transition-all text-left hover:scale-105 hover:shadow-lg ${
                          activeSubtopicId === subtopic.id
                            ? 'bg-green-900/50 border-green-500 cursor-wait'
                            : subtopic.completed
                            ? 'bg-green-900/30 border-green-700 hover:bg-green-900/40'
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-green-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {activeSubtopicId === subtopic.id ? (
                              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            ) : subtopic.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Play className="w-5 h-5 text-blue-400" fill="currentColor" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              activeSubtopicId === subtopic.id
                                ? 'text-blue-200'
                                : subtopic.completed 
                                ? 'text-green-100 line-through' 
                                : 'text-gray-200'
                            }`}>
                              {subtopic.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activeSubtopicId === subtopic.id 
                                ? 'Loading videos...' 
                                : subtopic.completed 
                                ? '✓ Completed' 
                                : 'Click to watch videos'}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {topicTitle}
              </h1>
              <p className="text-sm text-gray-600">{subjectName} - Video Tutorials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Play className="w-6 h-6" />
              <h2 className="text-xl font-bold">Learn with Videos</h2>
            </div>
            <p className="text-white/90">
              Watch curated tutorials to master {topicTitle}. Click on any video to start learning!
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading videos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => fetchVideos(topicTitle)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Videos Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleVideoSelect(video.id.videoId, video.snippet.title)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden group">
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                      {video.snippet.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {video.snippet.channelTitle}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(video.snippet.publishedAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Videos Found */}
          {!loading && !error && videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Play className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No videos found for this topic.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VideosContent />
    </Suspense>
  );
}
