import React from "react";
import PropTypes from "prop-types";
import { FaRobot, FaChartLine, FaGraduationCap, FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <nav className="w-full bg-gray-800 shadow-lg py-6 px-10 flex justify-between items-center fixed top-0 z-50 border-b border-gray-700">
        <h1 className="text-4xl font-extrabold text-yellow-200">Academia</h1>
        <div className="flex space-x-8">
          <a href="#home" className="hover:text-yellow-200 text-lg font-medium">
            Home
          </a>
          <a href="#features" className="hover:text-yellow-200 text-lg font-medium">
            Features
          </a>
          <a href="#about" className="hover:text-yellow-200 text-lg font-medium">
            About
          </a>
          <a href="#testimonials" className="hover:text-yellow-200 text-lg font-medium">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-yellow-200 text-lg font-medium">
            Contact
          </a>
          <Link to="/authentication/sign-up">
            <button className="bg-yellow-300 text-gray-900 px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition">
              Sign Up
            </button>
          </Link>
          <Link to="/authentication/sign-in">
            <button className="bg-yellow-300 text-gray-900 px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition">
              Sign in
            </button>
          </Link>
        </div>
      </nav>

      <header
        id="home"
        className="relative flex flex-col md:flex-row items-center justify-between py-40 px-12 mt-16 bg-gradient-to-r from-gray-800 to-gray-700 text-white text-center md:text-left rounded-b-3xl shadow-xl"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 space-y-6"
        >
          <h1 className="text-6xl font-extrabold leading-tight">
            Revolutionizing Learning with AI
          </h1>
          <p className="text-xl opacity-90">
            Academia provides AI-driven personalized learning, interactive modules, and real-time
            progress tracking.
          </p>
          <button className="bg-yellow-300 text-gray-900 px-10 py-4 rounded-lg font-semibold shadow-lg hover:bg-yellow-500 transition text-lg">
            Get Started
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-8 md:mt-0"
        >
          <img
            src="https://img.freepik.com/premium-photo/aipowered-online-education-platforms-creating-personalized-learning-paths-digital-learning-environments-using-ai-analyze-student-progress-adjust-lessons-accordingly_1230253-31206.jpg"
            alt="Education"
            className="rounded-3xl shadow-2xl max-w-full"
          />
        </motion.div>
      </header>

      <section
        id="features"
        className="max-w-6xl mx-auto py-24 px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16 text-center"
      >
        <FeatureCard
          icon={<FaRobot />}
          title="AI-Powered Quizzes"
          description="Intelligent adaptive testing for personalized learning."
        />
        <FeatureCard
          icon={<FaChartLine />}
          title="Progress Analytics"
          description="Track and visualize your educational journey."
        />
        <FeatureCard
          icon={<FaGraduationCap />}
          title="Smart Flashcards"
          description="Enhance memory retention with AI-driven flashcards."
        />
        <FeatureCard
          icon={<FaMicrophone />}
          title="Voice Assistant"
          description="Engage in seamless, hands-free learning experiences."
        />
      </section>

      <section id="testimonials" className="max-w-6xl mx-auto py-24 px-12 text-center">
        <h2 className="text-5xl font-bold text-yellow-400">What Our Users Say</h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <TestimonialCard
            name="Sarah Thompson"
            feedback="AI Learning has completely transformed the way I study."
          />
          <TestimonialCard
            name="James Rodriguez"
            feedback="The voice assistant feature is amazing! I can learn on the go."
          />
          <TestimonialCard
            name="Emily Davis"
            feedback="I love the real-time progress tracking. It keeps me motivated."
          />
          <TestimonialCard
            name="Michael Brown"
            feedback="AI-curated revision flashcards are a game-changer."
          />
        </div>
      </section>

      <section
        id="contact"
        className="bg-gray-700 py-24 px-12 text-center max-w-6xl mx-auto rounded-xl shadow-lg"
      >
        <h2 className="text-5xl font-bold text-yellow-400">Contact Us</h2>
        <p className="mt-6 text-xl text-gray-300 leading-relaxed">
          {`Have any questions? Reach out to us and we'll be happy to help.`}
        </p>
        <p className="mt-2 text-gray-300">
          Email us at <span className="font-semibold text-yellow-400">support@academia.com</span>
        </p>
        <button className="mt-6 bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition text-lg">
          Get in Touch
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-10 bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transform transition-all w-full"
    >
      <div className="text-yellow-400 text-6xl mb-6">{icon}</div>
      <h3 className="text-3xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 mt-4 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

function TestimonialCard({ name, feedback }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform transition-all"
    >
      <p className="text-gray-300 italic">&ldquo;{feedback}&rdquo;</p>
      <h3 className="text-2xl font-semibold mt-4 text-yellow-400">- {name}</h3>
    </motion.div>
  );
}

TestimonialCard.propTypes = {
  name: PropTypes.string.isRequired,
  feedback: PropTypes.string.isRequired,
};
