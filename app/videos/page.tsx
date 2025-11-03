"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Clock, Eye, ThumbsUp, X, Loader2 } from "lucide-react";

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
    console.log('Videos page loaded - Topic:', topic, 'Subject:', subject);
    setTopicTitle(topic);
    setSubjectName(subject);

    if (topic) {
      fetchVideos(topic);
    }
  }, [searchParams]);

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
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setShowCompletionMessage(false);
    }, 3000);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setVideoEnded(false);
    setShowCompleteButton(false);
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
    setVideoEnded(false);
    setShowCompleteButton(false);
    
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
              className="relative w-full max-w-6xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
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
              <div className="aspect-video bg-black">
                <div id="youtube-player" className="w-full h-full"></div>
              </div>

              {/* Mark Complete Button */}
              <div className="bg-gray-900 p-4 flex items-center justify-between">
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
                  onClick={() => handleVideoSelect(video.id.videoId)}
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
