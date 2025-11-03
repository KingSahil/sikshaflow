"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Home, Trophy, Star, Target, TrendingUp } from "lucide-react";
import XPBar from "../components/XPBar";
import TopicCard from "../components/TopicCard";
import TopicDetailModal from "../components/TopicDetailModal";
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

// Define subtopics for each topic
const topicSubtopics: { [key: string]: Array<{ id: string; title: string }> } = {
  // Mathematics
  "matrices": [
    { id: "hermitian", title: "Hermitian, unitary & orthogonal matrices" },
    { id: "rank-inverse", title: "Rank and inverse using Gauss-Jordan method" },
    { id: "eigenvalues", title: "Eigenvalues and eigenvectors" },
    { id: "cayley-hamilton", title: "Cayley-Hamilton theorem" }
  ],
  "differential-calculus": [
    { id: "partial-derivatives", title: "Partial derivatives and Euler's theorem" },
    { id: "total-derivatives", title: "Total derivatives and Jacobian" },
    { id: "taylor-series", title: "Taylor and Maclaurin series" },
    { id: "maxima-minima", title: "Maxima and minima" },
    { id: "lagrange", title: "Lagrange multipliers" }
  ],
  "integral-calculus": [
    { id: "double-integrals", title: "Double integrals (Cartesian & polar)" },
    { id: "triple-integrals", title: "Triple integrals" },
    { id: "change-variables", title: "Change of variables" },
    { id: "beta-gamma", title: "Beta and Gamma functions" }
  ],
  "vector-calculus": [
    { id: "gradient", title: "Gradient, divergence, and curl" },
    { id: "line-integral", title: "Line integrals" },
    { id: "surface-volume", title: "Surface and volume integrals" },
    { id: "greens-theorem", title: "Green's theorem" },
    { id: "stokes-gauss", title: "Stokes and Gauss divergence theorems" }
  ],
  // Engineering Graphics
  "drawing-basics": [
    { id: "instruments", title: "Drawing instruments and their usage" },
    { id: "lettering", title: "Lettering and line types" },
    { id: "projection-types", title: "Types of projections" },
    { id: "dimensioning", title: "Dimensioning standards" },
    { id: "orthographic", title: "Orthographic projection of points, lines, and lamina" }
  ],
  "projection-solids": [
    { id: "prisms", title: "Projection of prisms" },
    { id: "pyramids", title: "Projection of pyramids" },
    { id: "cylinders", title: "Projection of cylinders" },
    { id: "cones", title: "Projection of cones" },
    { id: "sections", title: "Sections of solids" }
  ],
  "isometric": [
    { id: "isometric-basics", title: "Isometric projection basics" },
    { id: "isometric-scale", title: "Isometric scale" },
    { id: "isometric-views", title: "Isometric views of simple objects" },
    { id: "conversion", title: "Conversion from orthographic to isometric" }
  ],
  "autocad": [
    { id: "autocad-basics", title: "AutoCAD interface and basics" },
    { id: "2d-commands", title: "2D drawing commands" },
    { id: "editing-tools", title: "Editing tools and layers" },
    { id: "dimensioning-autocad", title: "Dimensioning in AutoCAD" },
    { id: "3d-basics", title: "Introduction to 3D modeling" }
  ],
  // Engineering Mechanics
  "force-systems": [
    { id: "force-basics", title: "Force system basics and laws of mechanics" },
    { id: "vector-algebra", title: "Vector algebra applied to forces" },
    { id: "moments", title: "Moments and couples" },
    { id: "lamis-theorem", title: "Lami's theorem" },
    { id: "varignons", title: "Varignon's theorem" }
  ],
  "trusses": [
    { id: "truss-basics", title: "Introduction to trusses" },
    { id: "method-joints", title: "Method of joints" },
    { id: "method-sections", title: "Method of sections" },
    { id: "perfect-truss", title: "Perfect, deficient, and redundant trusses" }
  ],
  "moment-inertia": [
    { id: "centroid", title: "Centroid of simple shapes" },
    { id: "composite-shapes", title: "Centroid of composite shapes" },
    { id: "moi-basics", title: "Moment of inertia basics" },
    { id: "parallel-axis", title: "Parallel axis theorem" },
    { id: "perpendicular-axis", title: "Perpendicular axis theorem" }
  ],
  "kinematics": [
    { id: "rectilinear", title: "Rectilinear motion" },
    { id: "curvilinear", title: "Curvilinear motion" },
    { id: "projectile", title: "Projectile motion" },
    { id: "relative-motion", title: "Relative motion" }
  ],
  "particle-dynamics": [
    { id: "newtons-laws", title: "Newton's laws of motion" },
    { id: "work-energy", title: "Work and energy principles" },
    { id: "impulse-momentum", title: "Impulse and momentum" },
    { id: "impact", title: "Impact and collisions" }
  ],
  "shear-bending": [
    { id: "shear-force", title: "Shear force diagrams" },
    { id: "bending-moment", title: "Bending moment diagrams" },
    { id: "simply-supported", title: "Simply supported beams" },
    { id: "cantilever", title: "Cantilever beams" },
    { id: "overhanging", title: "Overhanging beams" }
  ],
  // Physics
  "em-fields": [
    { id: "coulombs-law", title: "Coulomb's law and electric fields" },
    { id: "gauss-law", title: "Gauss's law" },
    { id: "electric-potential", title: "Electric potential and energy" },
    { id: "magnetic-fields", title: "Magnetic fields" },
    { id: "amperes-law", title: "Ampere's law and applications" }
  ],
  "polarization": [
    { id: "polarization-basics", title: "Light polarization basics" },
    { id: "malus-law", title: "Malus's law" },
    { id: "double-refraction", title: "Double refraction" },
    { id: "wave-nature", title: "Wave nature of light" },
    { id: "interference", title: "Interference and diffraction" }
  ],
  "wave-particle": [
    { id: "photoelectric", title: "Photoelectric effect" },
    { id: "compton-effect", title: "Compton effect" },
    { id: "de-broglie", title: "De Broglie hypothesis" },
    { id: "uncertainty", title: "Heisenberg uncertainty principle" },
    { id: "wave-function", title: "Wave functions and probability" }
  ],
  "quantum-tunneling": [
    { id: "schrodinger", title: "Schrödinger equation" },
    { id: "potential-well", title: "Particle in a potential well" },
    { id: "tunneling-basics", title: "Quantum tunneling basics" },
    { id: "applications", title: "Applications in STM and radioactive decay" },
    { id: "band-theory", title: "Introduction to band theory" }
  ],
  // Punjabi
  "grammar": [
    { id: "nouns-pronouns", title: "Nouns and pronouns (ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ)" },
    { id: "verbs", title: "Verbs and tenses (ਕਿਰਿਆ ਅਤੇ ਕਾਲ)" },
    { id: "adjectives", title: "Adjectives and adverbs (ਵਿਸ਼ੇਸ਼ਣ)" },
    { id: "sentence-structure", title: "Sentence structure (ਵਾਕ ਰਚਨਾ)" }
  ],
  "literature": [
    { id: "poetry", title: "Punjabi poetry (ਪੰਜਾਬੀ ਕਵਿਤਾ)" },
    { id: "prose", title: "Prose and essays (ਗੱਦ)" },
    { id: "folk-literature", title: "Folk literature (ਲੋਕ ਸਾਹਿਤ)" },
    { id: "modern-writers", title: "Modern Punjabi writers" }
  ],
  "composition": [
    { id: "essay-writing", title: "Essay writing (ਲੇਖ ਲਿਖਣਾ)" },
    { id: "letter-writing", title: "Letter writing (ਚਿੱਠੀ ਲਿਖਣੀ)" },
    { id: "paragraph", title: "Paragraph writing (ਪੈਰਾ ਲਿਖਣਾ)" },
    { id: "translation", title: "Translation skills (ਅਨੁਵਾਦ)" }
  ],
  "comprehension": [
    { id: "reading", title: "Reading comprehension (ਪੜ੍ਹਨ ਦੀ ਸਮਝ)" },
    { id: "vocabulary", title: "Vocabulary building (ਸ਼ਬਦ ਭੰਡਾਰ)" },
    { id: "idioms", title: "Idioms and phrases (ਮੁਹਾਵਰੇ)" },
    { id: "proverbs", title: "Punjabi proverbs (ਕਹਾਵਤਾਂ)" }
  ],
  // Entrepreneurship
  "business-fundamentals": [
    { id: "entrepreneurship-basics", title: "Introduction to entrepreneurship" },
    { id: "business-models", title: "Business models and types" },
    { id: "startup-ecosystem", title: "Startup ecosystem" },
    { id: "legal-aspects", title: "Legal aspects of business" }
  ],
  "innovation": [
    { id: "creative-thinking", title: "Creative thinking techniques" },
    { id: "idea-generation", title: "Idea generation and validation" },
    { id: "design-thinking", title: "Design thinking process" },
    { id: "product-development", title: "Product development basics" }
  ],
  "business-planning": [
    { id: "market-research", title: "Market research and analysis" },
    { id: "business-plan", title: "Writing a business plan" },
    { id: "financial-planning", title: "Financial planning and projections" },
    { id: "funding-sources", title: "Funding sources and pitching" }
  ],
  "marketing": [
    { id: "marketing-basics", title: "Marketing fundamentals" },
    { id: "digital-marketing", title: "Digital marketing strategies" },
    { id: "customer-acquisition", title: "Customer acquisition techniques" },
    { id: "growth-hacking", title: "Growth hacking tactics" }
  ]
};

function TopicsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState("");
  
  // Load XP and level from localStorage on initialization
  const [currentXP, setCurrentXP] = useState(() => {
    if (typeof window !== 'undefined') {
      const subject = new URLSearchParams(window.location.search).get("subject");
      if (subject) {
        const savedXP = localStorage.getItem(`xp-${subject}`);
        return savedXP ? parseInt(savedXP, 10) : 0;
      }
    }
    return 0;
  });
  
  const [level, setLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      const subject = new URLSearchParams(window.location.search).get("subject");
      if (subject) {
        const savedLevel = localStorage.getItem(`level-${subject}`);
        return savedLevel ? parseInt(savedLevel, 10) : 1;
      }
    }
    return 1;
  });
  
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
    subtopics: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  }>>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    title: string;
    description: string;
    xpReward: number;
    subtopics: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  } | null>(null);

  useEffect(() => {
    const subject = searchParams.get("subject") || "";
    setSubjectId(subject);

    // Initialize topics for the subject
    if (subject && subjectTopics[subject]) {
      const initialTopics = subjectTopics[subject].map((topic, index) => {
        // Check localStorage for topic completion
        const topicCompletedKey = `topic-completed-${subject}-${topic.id}`;
        const isTopicCompleted = typeof window !== 'undefined' && localStorage.getItem(topicCompletedKey) === 'true';
        
        return {
          ...topic,
          completed: isTopicCompleted,
          locked: index !== 0 && !isTopicCompleted, // Unlock if completed or first topic
          subtopics: (topicSubtopics[topic.id] || []).map(st => {
            // Check localStorage for completion
            const completedKey = `video-completed-${st.title}`;
            const isCompleted = typeof window !== 'undefined' && localStorage.getItem(completedKey) === 'true';
            return {
              ...st,
              completed: isCompleted
            };
          })
        };
      });
      
      // Unlock topics that come after completed topics
      for (let i = 1; i < initialTopics.length; i++) {
        if (initialTopics[i - 1].completed) {
          initialTopics[i].locked = false;
        }
      }
      
      setTopics(initialTopics);
    }
  }, [searchParams]);

  // Check for completed videos when modal is opened
  useEffect(() => {
    if (isModalOpen && selectedTopic) {
      // Update subtopics completion status from localStorage
      setTopics(prevTopics =>
        prevTopics.map(topic =>
          topic.id === selectedTopic.id
            ? {
                ...topic,
                subtopics: topic.subtopics.map(st => {
                  const completedKey = `video-completed-${st.title}`;
                  const isCompleted = localStorage.getItem(completedKey) === 'true';
                  return { ...st, completed: isCompleted };
                })
              }
            : topic
        )
      );
    }
  }, [isModalOpen]);

  // Listen for storage changes from other tabs (when videos are completed)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Check if a video completion was updated
      if (e.key && e.key.startsWith('video-completed-') && e.newValue === 'true') {
        console.log('Storage change detected:', e.key, 'New value:', e.newValue);
        
        // Extract the subtopic title from the key
        const subtopicTitle = e.key.replace('video-completed-', '');
        
        // Update the topics state to reflect the completion
        setTopics(prevTopics =>
          prevTopics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(st =>
              st.title === subtopicTitle
                ? { ...st, completed: true }
                : st
            )
          }))
        );

        // If modal is open, update selected topic as well
        if (selectedTopic) {
          setSelectedTopic(prev => {
            if (!prev) return null;
            return {
              ...prev,
              subtopics: prev.subtopics.map(st =>
                st.title === subtopicTitle
                  ? { ...st, completed: true }
                  : st
              )
            };
          });
        }
      }
    };

    // Handle messages from child windows (video tabs)
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from our domain
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'videoCompleted') {
        const subtopicTitle = event.data.subtopicTitle;
        console.log('Video completion message received:', subtopicTitle);
        
        // Update the topics state to reflect the completion
        setTopics(prevTopics =>
          prevTopics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(st =>
              st.title === subtopicTitle
                ? { ...st, completed: true }
                : st
            )
          }))
        );

        // If modal is open, update selected topic as well
        if (selectedTopic) {
          setSelectedTopic(prev => {
            if (!prev) return null;
            return {
              ...prev,
              subtopics: prev.subtopics.map(st =>
                st.title === subtopicTitle
                  ? { ...st, completed: true }
                  : st
              )
            };
          });
        }
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedTopic]);

  const handleTopicComplete = (topicId: string, xpReward: number) => {
    // Save topic completion to localStorage
    const subject = searchParams.get("subject");
    if (subject) {
      const topicCompletedKey = `topic-completed-${subject}-${topicId}`;
      localStorage.setItem(topicCompletedKey, 'true');
    }
    
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
    
    // Save XP to localStorage
    if (subject) {
      localStorage.setItem(`xp-${subject}`, newXP.toString());
    }

    // Check for level up
    if (newXP >= levelXP) {
      const newLevel = level + 1;
      setLevel(newLevel);
      const remainingXP = newXP - levelXP;
      setCurrentXP(remainingXP);
      
      // Save level and updated XP to localStorage
      if (subject) {
        localStorage.setItem(`level-${subject}`, newLevel.toString());
        localStorage.setItem(`xp-${subject}`, remainingXP.toString());
      }
      
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

  const handleStartTopic = (topic: typeof topics[0]) => {
    // Check localStorage for latest completion status
    const updatedSubtopics = topic.subtopics.map(st => {
      const completedKey = `video-completed-${st.title}`;
      const isCompleted = localStorage.getItem(completedKey) === 'true';
      return { ...st, completed: isCompleted };
    });

    setSelectedTopic({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      xpReward: topic.xpReward,
      subtopics: updatedSubtopics
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
  };

  const handleSubtopicComplete = (subtopicId: string) => {
    if (!selectedTopic) return;

    // Update subtopic completion in selected topic
    const updatedSubtopics = selectedTopic.subtopics.map(st =>
      st.id === subtopicId ? { ...st, completed: !st.completed } : st
    );

    setSelectedTopic({
      ...selectedTopic,
      subtopics: updatedSubtopics
    });

    // Also update in topics array
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === selectedTopic.id
          ? { ...topic, subtopics: updatedSubtopics }
          : topic
      )
    );
  };

  const handleCompleteAll = () => {
    if (!selectedTopic) return;

    // Complete the topic and award XP
    handleTopicComplete(selectedTopic.id, selectedTopic.xpReward);
    handleCloseModal();
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

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <TopicDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          topicTitle={selectedTopic.title}
          topicDescription={selectedTopic.description}
          subtopics={selectedTopic.subtopics}
          xpReward={selectedTopic.xpReward}
          onCompleteSubtopic={handleSubtopicComplete}
          onCompleteAll={handleCompleteAll}
          subjectName={getSubjectName(subjectId)}
        />
      )}

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
                  id={topic.id}
                  title={topic.title}
                  description={topic.description}
                  xpReward={topic.xpReward}
                  completed={topic.completed}
                  locked={topic.locked}
                  onStart={() => handleStartTopic(topic)}
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
