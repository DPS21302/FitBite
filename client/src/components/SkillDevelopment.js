import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaGraduationCap, FaChartLine, FaBook, FaLaptopCode, FaPalette, FaLanguage, FaMusic, FaDumbbell, FaChess,FaTrash,FaFlask } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyCl1TuHfx8HGdGCj6D-ZSTQSdCKEjX_IYg";

const SkillDevelopment = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Beginner");
  const [learningPath, setLearningPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    generateDailyTip();
  }, []);

  const skillCategories = [
    "Programming",
    "Language",
    "Art",
    "Music",
    "Sports",
    "Business",
    "Science",
    "Math",
    "Soft Skills",
    "Other",
  ];

  const skillLevels = ["Beginner", "Intermediate", "Advanced"];

  const addSkill = () => {
    if (newSkill && newSkillCategory && newSkillLevel) {
      setSkills([...skills, { name: newSkill, category: newSkillCategory, level: newSkillLevel }]);
      setNewSkill("");
      setNewSkillCategory("");
      setNewSkillLevel("Beginner");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const generateLearningPath = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a personalized learning path for the following skills:
        
        ${skills.map(skill => `- ${skill.name} (${skill.category}) - Current level: ${skill.level}`).join('\n')}
        
        Please include:
        1. Recommended order for skill development
        2. Estimated time commitment for each skill
        3. Key milestones and projects for each skill
        4. Recommended learning resources (books, online courses, tutorials)
        5. Potential career opportunities or applications for the skillset
        6. Tips for maintaining motivation and overcoming learning plateaus
        7. Suggestions for practical application of skills
        8. Long-term goals and advanced topics to explore
        
        Format the response using Markdown for better readability. Use headings, subheadings, and bullet points for clarity.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setLearningPath(text);
    } catch (error) {
      console.error("Error generating learning path:", error);
      setLearningPath("An error occurred while generating the learning path. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateDailyTip = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a brief, practical tip for effective skill development and learning. 
        This should be a single sentence or short paragraph that offers an easy-to-implement 
        suggestion for improving one's learning process or maintaining motivation.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setDailyTip(text);
    } catch (error) {
      console.error("Error generating daily tip:", error);
      setDailyTip("Set aside dedicated time each day for focused practice and learning.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaBrain className="mr-2" /> Skill Development Tracker & Learning Path Generator
      </h2>

      <AnimatePresence>
        {dailyTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Daily Learning Tip</h3>
            <p className="text-gray-700">{dailyTip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">Add Your Skills</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Skill Name"
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {skillCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {skillLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addSkill}
            className="bg-indigo-500 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <FaGraduationCap className="inline-block mr-2" /> Add Skill
          </motion.button>
        </div>

        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2 text-indigo-600">Your Skills:</h4>
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
            >
              <span className="flex items-center">
                {getSkillIcon(skill.category)}
                <span className="ml-2">{skill.name} - {skill.category} ({skill.level})</span>
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateLearningPath}
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mx-auto block mt-8"
        disabled={skills.length === 0 || isLoading}
      >
        <FaChartLine className="inline-block mr-2" /> Generate Learning Path
      </motion.button>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {learningPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
            <FaBook className="mr-2" /> Your Personalized Learning Path
          </h3>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-purple-600" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-purple-600" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2 text-purple-500" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3 text-gray-700" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            }}
          >
            {learningPath}
          </ReactMarkdown>
        </motion.div>
      )}

      {/* Learning Challenge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2 text-indigo-600">30-Day Learning Challenge</h3>
        <p className="text-gray-700">
          Take the 30-day learning challenge! Commit to practicing your chosen skill for at least 30 minutes every day. 
          Share your progress on social media with #30DaysOfLearning to inspire others and stay accountable!
        </p>
      </motion.div>
    </motion.div>
  );
};

const getSkillIcon = (category) => {
  switch (category) {
    case "Programming":
      return <FaLaptopCode className="text-blue-500" />;
    case "Language":
      return <FaLanguage className="text-green-500" />;
    case "Art":
      return <FaPalette className="text-pink-500" />;
    case "Music":
      return <FaMusic className="text-yellow-500" />;
    case "Sports":
      return <FaDumbbell className="text-red-500" />;
    case "Business":
      return <FaChartLine className="text-indigo-500" />;
    case "Science":
      return <FaFlask className="text-purple-500" />;
    case "Math":
      return <FaCalculator className="text-orange-500" />;
    case "Soft Skills":
      return <FaUsers className="text-teal-500" />;
    default:
      return <FaBrain className="text-gray-500" />;
  }
};

export default SkillDevelopment;