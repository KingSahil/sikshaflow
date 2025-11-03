"use client";

import { motion } from "framer-motion";
import { 
  Calculator, 
  Pencil, 
  Cog, 
  Atom, 
  Languages, 
  Briefcase,
  ArrowLeft,
  BookOpen,
  Trophy,
  Star
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function SubjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [studentName, setStudentName] = useState("Student");
  const [year, setYear] = useState("1");
  const [semester, setSemester] = useState("1");

  useEffect(() => {
    const name = searchParams.get("name") || "Student";
    const yr = searchParams.get("year") || "1";
    const sem = searchParams.get("semester") || "1";
    setStudentName(name);
    setYear(yr);
    setSemester(sem);
  }, [searchParams]);

  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics-I",
      icon: Calculator,
      color: "from-blue-500 to-blue-600",
      description: "Calculus, Linear Algebra & Differential Equations",
      topicCount: 4,
      totalXP: 450
    },
    {
      id: "engineering-graphics",
      name: "Engineering Graphics",
      icon: Pencil,
      color: "from-purple-500 to-purple-600",
      description: "Technical Drawing & CAD Fundamentals",
      topicCount: 4,
      totalXP: 400
    },
    {
      id: "engineering-mechanics",
      name: "Engineering Mechanics",
      icon: Cog,
      color: "from-orange-500 to-orange-600",
      description: "Statics, Dynamics & Strength of Materials",
      topicCount: 6,
      totalXP: 600
    },
    {
      id: "physics",
      name: "Physics",
      icon: Atom,
      color: "from-green-500 to-green-600",
      description: "Modern Physics & Wave Optics",
      topicCount: 4,
      totalXP: 540
    },
    {
      id: "punjabi",
      name: "Punjabi",
      icon: Languages,
      color: "from-pink-500 to-pink-600",
      description: "Language, Literature & Communication",
      topicCount: 4,
      totalXP: 300
    },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship",
      icon: Briefcase,
      color: "from-yellow-500 to-yellow-600",
      description: "Business Fundamentals & Innovation",
      topicCount: 4,
      totalXP: 360
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    // Navigate to topics page with gamification
    router.push(`/topics?subject=${subjectId}`);
  };

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
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SikshaFlow
                </h1>
                <p className="text-sm text-gray-600">Year {year} - Semester {semester}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-semibold text-gray-900">{studentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
              <Trophy className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Start Earning XP Today!</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Your Subjects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a subject to start learning and earn XP by completing topics
            </p>
          </motion.div>

          {/* Info Banner */}
          <motion.div 
            variants={fadeInUp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12 text-white shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Star className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Gamified Learning Experience</h3>
                <p className="text-sm text-blue-100">
                  Complete topics, earn XP, level up, and unlock achievements! Each subject has multiple topics worth varying XP points.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Subjects Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubjectClick(subject.id)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300">
                  {/* Subject Header */}
                  <div className={`bg-gradient-to-r ${subject.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <subject.icon className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">{subject.topicCount} Topics</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{subject.name}</h3>
                  </div>

                  {/* Subject Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{subject.description}</p>
                    
                    {/* Progress Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">0%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-0"></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Star className="w-4 h-4 text-orange-500 fill-current" />
                          Total XP
                        </span>
                        <span className="font-semibold text-orange-600">{subject.totalXP} XP</span>
                      </div>
                    </div>

                    {/* Start Button */}
                    <button
                      className={`w-full mt-6 py-3 bg-gradient-to-r ${subject.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      Start Learning
                      <BookOpen className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Info */}
          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-gray-600">
              Complete all topics in a subject to unlock a special achievement! 🏆
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SubjectsContent />
    </Suspense>
  );
}
