"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home, Trophy, Star, Target, TrendingUp } from "lucide-react";
import XPBar from "../components/XPBar";
import TopicCard from "../components/TopicCard";
import AchievementPopup from "../components/AchievementPopup";

// Define all topics for each subject
const subjectTopics: { [key: string]: Array<{
  id: string;
  title: string;
  description: string;
  xpReward: number;
}> } = {
  "mathematics": [
    {
      id: "matrices",
      title: "Matrices",
      description: "Hermitian, unitary, orthogonal matrices, rank, inverse (Gauss-Jordan), eigenvalues & eigenvectors, Cayley-Hamilton theorem",
      xpReward: 100
    },
    {
      id: "differential-calculus",
      title: "Differential Calculus",
      description: "Partial derivatives, Euler's theorem, total derivatives, Jacobian, Taylor & Maclaurin series, maxima & minima, Lagrange multipliers",
      xpReward: 120
    },
    {
      id: "integral-calculus",
      title: "Integral Calculus",
      description: "Double and triple integrals (Cartesian & polar), change of variables, Beta & Gamma functions",
      xpReward: 110
    },
    {
      id: "vector-calculus",
      title: "Vector Calculus",
      description: "Gradient, divergence, curl, line/surface/volume integrals, Green's, Stokes, and Gauss divergence theorems",
      xpReward: 120
    }
  ],
  "engineering-graphics": [
    {
      id: "drawing-basics",
      title: "Drawing Instruments & Basics",
      description: "Drawing instruments, lettering, projection types, dimensioning, orthographic projection of points, lines, lamina",
      xpReward: 80
    },
    {
      id: "solids-projection",
      title: "Projection of Solids",
      description: "Projection of solids, section and intersection of solids, curve of interpenetration, development of surfaces",
      xpReward: 100
    },
    {
      id: "isometric",
      title: "Isometric Drawing & Projection",
      description: "Isometric drawing and projection techniques",
      xpReward: 90
    },
    {
      id: "cad",
      title: "Freehand Sketching & AutoCAD",
      description: "Freehand sketching, AutoCAD 2D & 3D commands",
      xpReward: 130
    }
  ],
  "engineering-mechanics": [
    {
      id: "force-systems",
      title: "Force System & Equilibrium",
      description: "Force system, laws of mechanics, vector algebra, moments, couples, equilibrium (Lami's theorem, Varignon's theorem)",
      xpReward: 100
    },
    {
      id: "trusses-frames",
      title: "Trusses & Frames",
      description: "Trusses and frames (method of joints, method of sections), centroid, centre of mass and gravity",
      xpReward: 110
    },
    {
      id: "moment-inertia",
      title: "Moment of Inertia",
      description: "Moment of inertia (area & mass), parallel/perpendicular axis theorem, radius of gyration, principle axes",
      xpReward: 100
    },
    {
      id: "kinematics",
      title: "Kinematics of Rigid Body",
      description: "Kinematics of rigid body, velocity, acceleration, translation, rotation",
      xpReward: 90
    },
    {
      id: "particle-dynamics",
      title: "Particle Dynamics",
      description: "Particle dynamics, work-energy and momentum methods, Newton's laws, projectile motion",
      xpReward: 110
    },
    {
      id: "shear-bending",
      title: "Shear Force & Bending Moment",
      description: "Shear force & bending moment diagrams for beams",
      xpReward: 90
    }
  ],
  "physics": [
    {
      id: "em-fields",
      title: "Electric & Magnetic Fields",
      description: "Electric & magnetic fields in medium, susceptibility, conductivity, Maxwell's equations, EM wave equation",
      xpReward: 120
    },
    {
      id: "polarization-waves",
      title: "Polarization & EM Waves",
      description: "Polarization, Poynting vector, phase/group velocity, reflection & refraction at dielectric interface, Brewster angle, total internal reflection, EM waves in conducting medium",
      xpReward: 130
    },
    {
      id: "quantum-basics",
      title: "Wave-Particle Duality",
      description: "Wave-particle duality, de-Broglie hypothesis, Schrödinger equation, wave function, probability interpretation, stationary & bound states",
      xpReward: 140
    },
    {
      id: "quantum-mechanics",
      title: "Quantum Mechanical Tunneling",
      description: "Quantum mechanical tunneling, 1D potential wells (finite & infinite), expectation values, uncertainty principle, Kronig-Penny model, energy bands",
      xpReward: 150
    }
  ],
  "punjabi": [
    {
      id: "grammar-basics",
      title: "Grammar & Basics",
      description: "Basic grammar rules, sentence structure, and linguistic fundamentals",
      xpReward: 70
    },
    {
      id: "literature",
      title: "Punjabi Literature",
      description: "Study of classic and modern Punjabi literature, poetry, and prose",
      xpReward: 80
    },
    {
      id: "composition",
      title: "Essay & Letter Writing",
      description: "Composition skills, essay writing, and formal letter writing",
      xpReward: 75
    },
    {
      id: "comprehension",
      title: "Reading Comprehension",
      description: "Reading comprehension, interpretation, and critical analysis",
      xpReward: 75
    }
  ],
  "entrepreneurship": [
    {
      id: "business-fundamentals",
      title: "Business Fundamentals",
      description: "Introduction to entrepreneurship, business models, and startup basics",
      xpReward: 80
    },
    {
      id: "innovation",
      title: "Innovation & Creativity",
      description: "Creative thinking, innovation processes, and problem-solving techniques",
      xpReward: 90
    },
    {
      id: "business-planning",
      title: "Business Planning",
      description: "Business plan development, market analysis, and financial planning",
      xpReward: 100
    },
    {
      id: "marketing",
      title: "Marketing & Growth",
      description: "Marketing strategies, customer acquisition, and business growth tactics",
      xpReward: 90
    }
  ]
};

// Get subject name from ID
const getSubjectName = (id: string): string => {
  const names: { [key: string]: string } = {
    "mathematics": "Mathematics",
    "engineering-graphics": "Engineering Graphics",
    "engineering-mechanics": "Engineering Mechanics",
    "physics": "Physics",
    "punjabi": "Punjabi",
    "entrepreneurship": "Entrepreneurship"
  };
  return names[id] || "Subject";
};

function TopicsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState("");
  const [currentXP, setCurrentXP] = useState(0);
  const [level, setLevel] = useState(1);
  const levelXP = level * 500;

  const [achievement, setAchievement] = useState<{
    title: string;
    description: string;
    xp: number;
    type: 'xp' | 'level' | 'completion';
  } | null>(null);

  const [topics, setTopics] = useState<Array<{
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    locked: boolean;
  }>>([]);

  useEffect(() => {
    const subject = searchParams.get("subject") || "";
    setSubjectId(subject);

    // Initialize topics for the subject
    if (subject && subjectTopics[subject]) {
      const initialTopics = subjectTopics[subject].map((topic, index) => ({
        ...topic,
        completed: false,
        locked: index !== 0 // Only first topic is unlocked
      }));
      setTopics(initialTopics);
    }
  }, [searchParams]);

  const handleTopicComplete = (topicId: string, xpReward: number) => {
    // Update topic completion status
    setTopics(prevTopics => 
      prevTopics.map((topic, index) => {
        if (topic.id === topicId) {
          return { ...topic, completed: true };
        }
        // Unlock next topic
        const currentIndex = prevTopics.findIndex(t => t.id === topicId);
        if (index === currentIndex + 1 && topic.locked) {
          return { ...topic, locked: false };
        }
        return topic;
      })
    );

    // Add XP
    const newXP = currentXP + xpReward;
    setCurrentXP(newXP);

    // Check for level up
    if (newXP >= levelXP) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setCurrentXP(newXP - levelXP);
      
      setAchievement({
        title: "Level Up! 🎉",
        description: `You've reached Level ${newLevel}!`,
        xp: xpReward,
        type: 'level'
      });
    } else {
      setAchievement({
        title: "Topic Completed! ✨",
        description: "Great job! Keep learning!",
        xp: xpReward,
        type: 'completion'
      });
    }

    // Check if all topics completed
    const allCompleted = topics.every(t => t.id === topicId || t.completed);
    if (allCompleted) {
      setTimeout(() => {
        setAchievement({
          title: "Subject Mastered! 🏆",
          description: `You've completed all topics in ${getSubjectName(subjectId)}!`,
          xp: 200,
          type: 'level'
        });
        setCurrentXP(prev => prev + 200);
      }, 2000);
    }
  };

  const completedCount = topics.filter(t => t.completed).length;
  const totalTopics = topics.length;
  const progressPercentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  const stats = [
    { 
      label: "Completed Topics", 
      value: `${completedCount}/${totalTopics}`, 
      icon: Target, 
      color: "from-green-500 to-emerald-600" 
    },
    { 
      label: "Total XP Earned", 
      value: currentXP + (level - 1) * 500, 
      icon: TrendingUp, 
      color: "from-blue-500 to-purple-600" 
    },
    { 
      label: "Current Level", 
      value: level, 
      icon: Trophy, 
      color: "from-orange-500 to-red-600" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Achievement Popup */}
      <AchievementPopup 
        achievement={achievement} 
        onClose={() => setAchievement(null)} 
      />

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
              <button
                onClick={() => router.push('/subjects')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Back to Subjects"
              >
                <Home className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getSubjectName(subjectId)}
                </h1>
                <p className="text-sm text-gray-600">Complete topics to earn XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* XP Bar */}
          <div className="mb-8">
            <XPBar 
              currentXP={currentXP} 
              levelXP={levelXP} 
              level={level}
              username="Student"
            />
          </div>

          {/* Progress Banner */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Course Progress</h3>
              <span className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedCount} of {totalTopics} topics completed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <p className="text-sm text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Topics Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Topics</h3>
              <span className="text-sm text-gray-600">
                {completedCount} of {totalTopics} completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  {...topic}
                  onComplete={(xp) => handleTopicComplete(topic.id, xp)}
                />
              ))}
            </div>

            {topics.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No topics available for this subject yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopicsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TopicsContent />
    </Suspense>
  );
}
