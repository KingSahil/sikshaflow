"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Video,
  BarChart3,
  Loader2,
  LogOut,
  Home,
  Settings,
  FileText,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"content" | "analytics">("content");

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      const isTeacher = localStorage.getItem(`user-role-email-${user.email}`) === "teacher";
      if (!isTeacher) {
        router.push("/subjects");
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SikshaFlow Teacher Portal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Educator</p>
                <p className="font-semibold text-gray-900">{user.email?.split('@')[0]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "content"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Content Management</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Student Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "content" ? (
          <ContentManagement />
        ) : (
          <StudentAnalytics />
        )}
      </div>
    </div>
  );
}

// Content Management Component
function ContentManagement() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([
    { id: "mathematics", name: "Mathematics-I", topicCount: 4, videoCount: 25 },
    { id: "engineering-graphics", name: "Engineering Graphics", topicCount: 4, videoCount: 20 },
    { id: "engineering-mechanics", name: "Engineering Mechanics", topicCount: 6, videoCount: 30 },
    { id: "physics", name: "Physics", topicCount: 4, videoCount: 28 },
    { id: "punjabi", name: "Punjabi", topicCount: 4, videoCount: 15 },
    { id: "entrepreneurship", name: "Entrepreneurship", topicCount: 4, videoCount: 18 },
  ]);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Subjects</h3>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Topics</h3>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {subjects.reduce((sum, s) => sum + s.topicCount, 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Videos</h3>
            <Video className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {subjects.reduce((sum, s) => sum + s.videoCount, 0)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Active Students</h3>
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">247</p>
        </motion.div>
      </div>

      {/* Subjects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Subjects</h2>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5" />
            Add New Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {subject.topicCount} Topics
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    {subject.videoCount} Videos
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <Link href={`/teacher/manage-content?subject=${subject.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Edit className="w-4 h-4" />
                    Manage Content
                  </button>
                </Link>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium">
                  <Plus className="w-4 h-4" />
                  Add Topic/Video
                </button>

                <Link href={`/subjects?subject=${subject.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium">
                    <Home className="w-4 h-4" />
                    View as Student
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Student Analytics Component
function StudentAnalytics() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      completedTopics: 18,
      totalTopics: 26,
      totalXP: 1250,
      level: 8,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@example.com",
      completedTopics: 22,
      totalTopics: 26,
      totalXP: 1580,
      level: 10,
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@example.com",
      completedTopics: 12,
      totalTopics: 26,
      totalXP: 850,
      level: 6,
      lastActive: "5 hours ago",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha@example.com",
      completedTopics: 25,
      totalTopics: 26,
      totalXP: 1820,
      level: 12,
      lastActive: "30 minutes ago",
    },
    {
      id: 5,
      name: "Vikram Reddy",
      email: "vikram@example.com",
      completedTopics: 15,
      totalTopics: 26,
      totalXP: 980,
      level: 7,
      lastActive: "3 hours ago",
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total Students</h3>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{students.length}</p>
          <p className="text-sm text-gray-500 mt-2">Active learners</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Avg. Completion</h3>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(
              (students.reduce((sum, s) => sum + (s.completedTopics / s.totalTopics) * 100, 0) /
                students.length)
            )}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Course progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Total XP Earned</h3>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {students.reduce((sum, s) => sum + s.totalXP, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Across all students</p>
        </motion.div>
      </div>

      {/* Student List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Performance</h2>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">XP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => {
                  const progress = Math.round((student.completedTopics / student.totalTopics) * 100);
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {student.completedTopics}/{student.totalTopics} topics
                            </span>
                            <span className="font-semibold text-gray-900">{progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-orange-600">
                          {student.totalXP.toLocaleString()} XP
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                          Level {student.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{student.lastActive}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
