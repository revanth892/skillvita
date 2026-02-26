"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Loader2,
  Building2,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function RegisterSection() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const formattedValue = value.replace(/[^0-9+()-\s]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (error) setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ObjectKeys = Object.keys(formData) as Array<keyof typeof formData>;
    const missingFields = ObjectKeys.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = bcrypt.hashSync(formData.password, 10);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/mentor/public-create-learner`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          mobile: formData.mobile,
          email: formData.email,
          password: hashedPassword,
        },
      );

      // Registration successful
      window.location.href = "https://skill.coursevita.com/signin/";
    } catch (err) {
      let errorMsg =
        "Registration failed. An account with these details might already exist.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="register-section"
      className="py-20 relative overflow-hidden bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl p-6 md:p-12 overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl"
        >
          {/* Subtle gradient background */}
          <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            {/* Left side content and points */}
            <div className="space-y-8 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Free Access Now Available
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Hiring Assignment Portal
                </h2>
                <p className="text-lg text-gray-400 max-w-xl">
                  Streamline your hiring process with our Hiring Portal.
                  Evaluate candidates through simulation, quizzes and
                  submissions effectively.
                </p>
              </div>

              <div className="pt-4 space-y-6">
                {[
                  "Create customized simulations and quizzes",
                  "Manage candidate submissions",
                  "Automated evaluation capabilities",
                  "Dedicated recruiter dashboard",
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 bg-green-500/10 rounded-full p-2 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-gray-200 text-lg sm:text-xl font-medium tracking-tight">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://skill.coursevita.com/signin/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold hover:bg-white/[0.1] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <Building2 className="w-5 h-5" />
                  Company Login
                </Link>
              </div>
            </div>

            {/* Right side form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-black/60 p-6 md:p-8 backdrop-blur-md shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-400">
                    Sign up to access the hiring portal
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="flex items-start p-4 text-sm text-green-200 bg-green-500/10 border border-green-500/20 rounded-xl shadow-sm">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-green-400" />
                    <p className="leading-relaxed">
                      Please ensure you provide your correct{" "}
                      <strong className="text-white">mobile number</strong> and{" "}
                      <strong className="text-white">email address</strong>.
                      They will be used for logging in and communication.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        placeholder="Enter first name"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        placeholder="Enter last name"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      placeholder="Enter your mobile number"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      placeholder="Enter your email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        placeholder="Enter your password"
                        type={isVisible ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {isVisible ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">
                      Re-enter Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      placeholder="Confirm your password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3.5 px-4 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="https://skill.coursevita.com/signin/"
                      className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                    >
                      Sign In here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
