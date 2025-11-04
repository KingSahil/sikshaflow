# 🎓 shikshaFlow - Reimagining Education, The Smarter Way

## 📖 About

shikshaFlow is a modern, gamified education management platform designed to streamline university learning experiences. It combines AI-powered features with an engaging, Duolingo-inspired interface to help students learn effectively while earning rewards and tracking progress.

## ✨ Key Features

### 🎯 For Students

- **Gamified Learning Dashboard** 
  - XP (Experience Points) system for completing topics
  - Level progression and achievements
  - Global leaderboard to compete with peers
  - Coupons & rewards unlockable with earned XP

- **AI-Powered Video Learning**
  - YouTube video integration for educational content
  - AI Tutor powered by Google Gemini 2.5 Pro
  - Real-time chat assistance while watching videos
  - Video progress tracking and completion system
  - Interactive markdown support with LaTeX math rendering

- **Smart Quiz Generation**
  - AI-generated quizzes based on video content using Gemini AI
  - Multiple-choice questions with explanations
  - Instant feedback and score tracking
  - Detailed answer review with correct/incorrect highlights

- **Subject Organization**
  - Structured curriculum by subjects (Computer Science)
  - Topics with multiple subtopics
  - Progress tracking for each subject
  - Visual progress indicators

- **Coupons & Rewards System**
  - Unlock exclusive discounts and offers
  - Copy coupon codes with one click
  - Earn rewards by completing learning modules
  - Brand partnerships (Amazon, Swiggy, Zomato, Netflix, Spotify, Udemy)

### 👨‍🏫 For Teachers/Universities

- **Teacher Dashboard**
  - Content management interface
  - Student progress monitoring
  - Separate registration and authentication

### 🔐 Authentication & User Management

- **Firebase Authentication**
  - Secure email/password login
  - Role-based access (Student/Teacher)
  - User session persistence
  - Password recovery functionality
  - Separate registration flows for students and teachers

### 🎨 Modern UI/UX

- **Duolingo-Inspired Design**
  - Vibrant green color scheme (#22c55e, #10b981)
  - Blue and orange accents for branding
  - Smooth animations with Framer Motion
  - Responsive design for all devices
  - Interactive hover effects and transitions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.1 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: React Markdown with KaTeX for math rendering

### Backend & Services
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: 
  - Google Gemini 2.5 Pro (AI Tutor & Quiz Generation)
  - YouTube Data API v3 (Video search)
- **Video Player**: YouTube IFrame API

### APIs
- `/api/chat` - AI Tutor conversations using Gemini
- `/api/generate-quiz` - AI quiz generation based on topics
- `/api/search-videos` - YouTube video search integration

## 🚀 Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Firebase project with Authentication enabled
3. Google Gemini API key
4. YouTube Data API v3 key

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Application Structure

### Pages

- **`/`** - Landing page with features and CTAs
- **`/signup`** - User registration (Student/Teacher)
- **`/login`** - User authentication
- **`/forgot-password`** - Password recovery
- **`/subjects`** - Student dashboard with subjects, leaderboard, and coupons
- **`/topics`** - Topic details with subtopics list
- **`/videos`** - Video player with AI tutor, quiz, and progress tracking
- **`/teacher/dashboard`** - Teacher control panel
- **`/teacher/manage-content`** - Content management interface

### Key Components

- **Navigation** - Main header with branding
- **StudentForm** - Student registration modal
- **TeacherForm** - Teacher registration modal
- **TopicDetailModal** - Topic overview with subtopics
- **XPBar** - Experience points and level display
- **AchievementPopup** - Achievement unlock notifications

## 🎮 Gamification System

### XP (Experience Points)
- Earn XP by completing video topics
- Each topic has assigned XP value
- Progress tracked across all subjects

### Levels & Achievements
- Level up based on total XP earned
- Unlock achievements for milestones
- Visual feedback with animations

### Leaderboard
- Global ranking system
- Compare progress with other students
- Real-time score updates

### Rewards
- Unlock coupons with accumulated XP
- Tiered reward system (500-5000 XP required)
- Exclusive brand discounts and offers

## 🎨 Color Palette

- **Primary Green**: `#22c55e`, `#10b981` - Duolingo-inspired
- **Blue Accent**: `#3b82f6`, `#1e40af` - Brand identity
- **Orange Accent**: `#f97316`, `#ea580c` - Energy and warmth
- **Purple Accent**: `#9333ea`, `#7c3aed` - AI features
- **Gray Scale**: Various shades for text and backgrounds

## 🔒 Security Features

- Firebase Authentication with email/password
- Browser session persistence
- Protected routes for authenticated users
- Role-based access control
- Environment variables for API keys
- Secure API endpoints

## 📊 Progress Tracking

- Video completion tracking
- Topic-wise progress indicators
- Subject completion percentages
- Quiz scores and history
- XP accumulation over time

## 🎯 Future Enhancements

- Mobile app (React Native)
- More subjects and courses
- Live classes integration
- Assignment submission system
- Real-time notifications
- Social features (study groups)
- Advanced analytics dashboard

## 🤝 Contributing

This is an educational project. Feel free to fork and customize for your institution!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **UI Inspiration**: Duolingo
- **AI**: Google Gemini 2.5 Pro
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Firebase

---

Made with ❤️ for education • © 2025 shikshaFlow

