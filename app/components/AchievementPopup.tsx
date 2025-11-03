"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Star, Zap } from "lucide-react";
import { useEffect } from "react";

interface Achievement {
  title: string;
  description: string;
  xp: number;
  type: 'xp' | 'level' | 'completion';
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          className="fixed top-6 left-1/2 z-50 w-96 max-w-[90vw]"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative p-6">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    >
                      <Star className="w-4 h-4 fill-white" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  {achievement.type === 'level' ? (
                    <Trophy className="w-8 h-8 text-orange-500" />
                  ) : achievement.type === 'xp' ? (
                    <Zap className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <Star className="w-8 h-8 text-orange-500 fill-current" />
                  )}
                </motion.div>

                <div className="flex-1 text-white">
                  <h3 className="font-bold text-xl mb-1">{achievement.title}</h3>
                  <p className="text-sm text-white/90">{achievement.description}</p>
                  <div className="mt-2 flex items-center gap-1 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>+{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-white/30"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
