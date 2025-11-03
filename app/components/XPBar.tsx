"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Zap } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  username: string;
}

export default function XPBar({ currentXP, levelXP, level, username }: XPBarProps) {
  const xpPercentage = (currentXP / levelXP) * 100;
  const nextLevel = level + 1;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{username}</h3>
            <p className="text-sm text-blue-100">Level {level} Scholar</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-300">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold text-2xl">{level}</span>
          </div>
          <p className="text-xs text-blue-100">Level</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-300" />
            {currentXP} XP
          </span>
          <span className="text-blue-100">{levelXP} XP to Level {nextLevel}</span>
        </div>
        
        <div className="relative h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          >
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-0 left-0 h-full w-20 bg-white/30 blur-sm"
            />
          </motion.div>
        </div>
        
        <p className="text-xs text-blue-100 text-center">
          {levelXP - currentXP} XP remaining to next level
        </p>
      </div>
    </div>
  );
}
