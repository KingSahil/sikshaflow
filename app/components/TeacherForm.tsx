"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, School, BookOpen, MapPin, Building2, Award } from "lucide-react";
import { useState } from "react";

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherForm({ isOpen, onClose }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    department: "",
    designation: "",
    employeeId: "",
    specialization: "",
    experience: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate full name field - no numbers allowed
    if (name === "fullName") {
      const hasNumbers = /\d/.test(value);
      if (hasNumbers) {
        setNameError("Name cannot contain numbers");
        return;
      } else {
        setNameError("");
      }
    }
    
    // Validate phone number - only numbers and must be 10 digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, '');
      
      if (value && !/^\d*$/.test(value.replace(/[\s\-\+]/g, ''))) {
        setPhoneError("Phone number can only contain digits");
        return;
      }
      
      if (numericValue.length > 0 && numericValue.length !== 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        university: "",
        department: "",
        designation: "",
        employeeId: "",
        specialization: "",
        experience: "",
        city: "",
      });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Success State */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-white rounded-3xl flex flex-col items-center justify-center z-20"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SikshaFlow!</h3>
                  <p className="text-gray-600 text-lg">Your teacher registration is complete. Let's transform education!</p>
                </motion.div>
              )}

              {/* Form Content */}
              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
                    Teacher Registration
                  </h2>
                  <p className="text-gray-600">Join our community of educators shaping the future</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          } focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400`}
                        />
                        {nameError && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {nameError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@university.edu"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 98765 43210"
                            maxLength={10}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                              phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400`}
                          />
                        </div>
                        {phoneError && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {phoneError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Your city"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      Professional Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          University/College Name *
                        </label>
                        <div className="relative">
                          <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                          <select
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 appearance-none bg-white"
                          >
                            <option value="" className="text-gray-500">Select your university</option>
                            <option value="Guru Nanak Dev University" className="text-gray-900">Guru Nanak Dev University</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department *
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Computer Science"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Designation *
                        </label>
                        <select
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        >
                          <option value="" className="text-gray-500">Select designation</option>
                          <option value="Professor" className="text-gray-900">Professor</option>
                          <option value="Associate Professor" className="text-gray-900">Associate Professor</option>
                          <option value="Assistant Professor" className="text-gray-900">Assistant Professor</option>
                          <option value="Lecturer" className="text-gray-900">Lecturer</option>
                          <option value="Senior Lecturer" className="text-gray-900">Senior Lecturer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID *
                        </label>
                        <input
                          type="text"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                          required
                          placeholder="Enter your employee ID"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization *
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                          placeholder="Your area of expertise"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience *
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        >
                          <option value="" className="text-gray-500">Select experience</option>
                          <option value="0-2" className="text-gray-900">0-2 years</option>
                          <option value="3-5" className="text-gray-900">3-5 years</option>
                          <option value="6-10" className="text-gray-900">6-10 years</option>
                          <option value="11-15" className="text-gray-900">11-15 years</option>
                          <option value="16-20" className="text-gray-900">16-20 years</option>
                          <option value="20+" className="text-gray-900">20+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="pt-4">
                    <div className="flex items-start mb-6">
                      <input
                        type="checkbox"
                        id="terms-teacher"
                        required
                        className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="terms-teacher" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Already have an account?{" "}
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        Sign in
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
