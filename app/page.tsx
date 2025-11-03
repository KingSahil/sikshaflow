"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Brain, 
  GraduationCap, 
  MessageSquare, 
  ArrowRight,
  CheckCircle2,
  Users,
  School,
  Sparkles,
  Mail,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import { useState } from "react";
import Navigation from "./components/Navigation";
import StudentForm from "./components/StudentForm";
import TeacherForm from "./components/TeacherForm";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTeacherFormOpen, setIsTeacherFormOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Timetables",
      description: "AI-powered scheduling that adapts to your learning pace and preferences.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-powered Learning Insights",
      description: "Get personalized recommendations and track your progress with intelligent analytics.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Interactive Attendance & Grades",
      description: "Seamless tracking and real-time updates on your academic performance.",
      color: "from-blue-600 to-blue-700"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "University-Wide Communication",
      description: "Stay connected with peers, teachers, and institutions in one place.",
      color: "from-orange-600 to-orange-700"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Join your institution and connect with your courses seamlessly"
    },
    {
      number: "02",
      title: "Learn",
      description: "Access resources, attend classes, and engage with interactive content"
    },
    {
      number: "03",
      title: "Flow",
      description: "Experience effortless learning with AI-powered insights and automation"
    }
  ];

  const testimonials = [
    {
      name: "Raghav Sharma",
      role: "Computer Science Student",
      text: "SikshaFlow has completely transformed how I manage my studies. Everything is so organized and intuitive!",
      avatar: "RS"
    },
    {
      name: "Samaira",
      role: "Professor, IIT Delhi",
      text: "Finally, a platform that understands the needs of both educators and students. The analytics are game-changing.",
      avatar: "SS"
    },
    {
      name: "Navya Umat",
      role: "Engineering Student",
      text: "I love how SikshaFlow keeps me updated on everything. No more missing deadlines or important announcements!",
      avatar: "NU"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation onGetStartedClick={() => setIsFormOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-wave"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-wave" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-wave" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">The Future of Education is Here</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 bg-clip-text text-transparent"
            >
              Reimagining Education,<br />The Smarter Way
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              SikshaFlow is a smart education management platform designed to streamline university life—from assignments to analytics.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={() => setIsFormOpen(true)}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsTeacherFormOpen(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-blue-600 flex items-center gap-2"
              >
                <School className="w-5 h-5" />
                Join as University
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Powerful Features for Modern Education
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your academic journey
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 transform hover:rotate-6 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is as easy as 1-2-3
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center"
              >
                <div className="mb-6">
                  <span className="text-8xl font-bold bg-gradient-to-br from-blue-200 to-orange-200 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-6 text-blue-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Loved by Students & Teachers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community has to say
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                SikshaFlow
              </h3>
              <p className="text-gray-400 mb-4">
                Reimagining education for a smarter tomorrow.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Students</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SikshaFlow. All rights reserved. Made with ❤️ for education.</p>
          </div>
        </div>
      </footer>

      {/* Student Registration Form Modal */}
      <StudentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      
      {/* Teacher Registration Form Modal */}
      <TeacherForm isOpen={isTeacherFormOpen} onClose={() => setIsTeacherFormOpen(false)} />
    </div>
  );
}
