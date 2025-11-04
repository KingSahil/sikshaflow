"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Video,
  ArrowLeft,
  Save,
  X,
  Loader2,
  FileText,
  Youtube,
} from "lucide-react";

function ManageContentComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [subject, setSubject] = useState("");
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  // Define types for better type safety
  interface Topic {
    id: number;
    title: string;
    description: string;
    xp: number;
    subtopics: Subtopic[];
  }

  interface Subtopic {
    id: number;
    title: string;
    videoId: string;
    duration: string;
  }

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState(() => {
    // Load topics from localStorage on initialization
    if (typeof window !== 'undefined') {
      const subject = new URLSearchParams(window.location.search).get("subject");
      if (subject) {
        const savedTopics = localStorage.getItem(`teacher-topics-${subject}`);
        if (savedTopics) {
          return JSON.parse(savedTopics);
        }
      }
    }
    // Default topics if none saved
    return [
      {
        id: 1,
        title: "Introduction to Calculus",
        description: "Basic concepts of differentiation and integration",
        xp: 100,
        subtopics: [
          { id: 1, title: "Limits", videoId: "abc123", duration: "15:30" },
          { id: 2, title: "Derivatives", videoId: "def456", duration: "20:45" },
        ],
      },
      {
        id: 2,
        title: "Linear Algebra Fundamentals",
        description: "Matrices, vectors, and transformations",
        xp: 150,
        subtopics: [
          { id: 1, title: "Matrix Operations", videoId: "ghi789", duration: "18:20" },
          { id: 2, title: "Determinants", videoId: "jkl012", duration: "22:10" },
        ],
      },
    ];
  });

  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    xp: 100,
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    videoId: "",
    topicId: 0,
  });

  useEffect(() => {
    const subjectId = searchParams.get("subject");
    if (subjectId) {
      setSubject(subjectId);
      // Load topics from localStorage when subject changes
      const savedTopics = localStorage.getItem(`teacher-topics-${subjectId}`);
      if (savedTopics) {
        setTopics(JSON.parse(savedTopics));
      }
    }
  }, [searchParams]);

  // Save topics to localStorage whenever topics change
  useEffect(() => {
    if (subject && topics.length > 0) {
      localStorage.setItem(`teacher-topics-${subject}`, JSON.stringify(topics));
    }
  }, [topics, subject]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleAddTopic = () => {
    if (!newTopic.title || !newTopic.description) {
      alert("Please fill in all fields");
      return;
    }

    const topic = {
      id: topics.length + 1,
      title: newTopic.title,
      description: newTopic.description,
      xp: newTopic.xp,
      subtopics: [],
    };

    setTopics([...topics, topic]);
    setNewTopic({ title: "", description: "", xp: 100 });
    setShowAddTopicModal(false);
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.videoId || !newVideo.topicId) {
      alert("Please fill in all fields");
      return;
    }

    const updatedTopics = topics.map((topic: Topic) => {
      if (topic.id === newVideo.topicId) {
        return {
          ...topic,
          subtopics: [
            ...topic.subtopics,
            {
              id: topic.subtopics.length + 1,
              title: newVideo.title,
              videoId: newVideo.videoId,
              duration: "00:00", // You can add duration input
            },
          ],
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
    setNewVideo({ title: "", videoId: "", topicId: 0 });
    setShowAddVideoModal(false);
  };

  const handleDeleteTopic = (topicId: number) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      setTopics(topics.filter((t: Topic) => t.id !== topicId));
    }
  };

  const handleDeleteVideo = (topicId: number, videoId: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      const updatedTopics = topics.map((topic: Topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subtopics: topic.subtopics.filter((v: Subtopic) => v.id !== videoId),
          };
        }
        return topic;
      });
      setTopics(updatedTopics);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Content - {subject}
                </h1>
                <p className="text-sm text-gray-600">Add, edit, or remove topics and videos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowAddTopicModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Topic
          </button>
          <button
            onClick={() => setShowAddVideoModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Video to Topic
          </button>
        </div>

        {/* Topics List */}
        <div className="space-y-6">
          {topics.map((topic: Topic, index: number) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Topic Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
                    <p className="text-blue-100 mb-3">{topic.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                        <FileText className="w-4 h-4" />
                        {topic.xp} XP
                      </span>
                      <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                        <Video className="w-4 h-4" />
                        {topic.subtopics.length} Videos
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTopic(topic)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Videos List */}
              <div className="p-6">
                {topic.subtopics.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No videos added yet. Click "Add Video to Topic" to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topic.subtopics.map((video: Subtopic) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <Youtube className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-600">
                              Video ID: {video.videoId} • Duration: {video.duration}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(topic.id, video.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Topic Modal */}
      <AnimatePresence>
        {showAddTopicModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTopicModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Topic</h2>
                  <button
                    onClick={() => setShowAddTopicModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Topic Title *
                    </label>
                    <input
                      type="text"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter topic title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter topic description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      XP Points *
                    </label>
                    <input
                      type="number"
                      value={newTopic.xp}
                      onChange={(e) => setNewTopic({ ...newTopic, xp: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="100"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddTopic}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Save Topic
                    </button>
                    <button
                      onClick={() => setShowAddTopicModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddVideoModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVideoModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add Video to Topic</h2>
                  <button
                    onClick={() => setShowAddVideoModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Topic *
                    </label>
                    <select
                      value={newVideo.topicId}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, topicId: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value={0}>Select a topic</option>
                      {topics.map((topic: Topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Enter video title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      YouTube Video ID *
                    </label>
                    <input
                      type="text"
                      value={newVideo.videoId}
                      onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="e.g., dQw4w9WgXcQ"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Extract the video ID from YouTube URL (the part after v=)
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddVideo}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Add Video
                    </button>
                    <button
                      onClick={() => setShowAddVideoModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ManageContentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ManageContentComponent />
    </Suspense>
  );
}
