import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaChartLine, FaCheckCircle, FaCalendarAlt, FaBook, FaRunning, FaMeditation, FaLightbulb } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyCl1TuHfx8HGdGCj6D-ZSTQSdCKEjX_IYg";

const PersonalGrowthTracker = () => {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [growthTip, setGrowthTip] = useState("");

  useEffect(() => {
    generateGrowthTip();
  }, []);

  const addHabit = () => {
    setHabits([...habits, { name: "", frequency: "daily", streak: 0, completed: false }]);
  };

  const updateHabit = (index, field, value) => {
    const updatedHabits = [...habits];
    updatedHabits[index][field] = value;
    setHabits(updatedHabits);
  };

  const addGoal = () => {
    setGoals([...goals, { description: "", deadline: "", progress: 0 }]);
  };

  const updateGoal = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const addReflection = () => {
    setReflections([...reflections, { date: new Date().toISOString().split('T')[0], content: "" }]);
  };

  const updateReflection = (index, field, value) => {
    const updatedReflections = [...reflections];
    updatedReflections[index][field] = value;
    setReflections(updatedReflections);
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Analyze the following personal growth data and provide insights, recommendations, and potential improvements:
        
        Habits:
        ${habits.map(h => `- ${h.name} (Frequency: ${h.frequency}, Streak: ${h.streak})`).join('\n')}

        Goals:
        ${goals.map(g => `- ${g.description} (Deadline: ${g.deadline}, Progress: ${g.progress}%)`).join('\n')}

        Recent Reflections:
        ${reflections.map(r => `- ${r.date}: ${r.content}`).join('\n')}
        
        Please include:
        1. Analysis of habit consistency and suggestions for improvement
        2. Goal progress evaluation and strategies for achieving them
        3. Insights from reflections and how they relate to personal growth
        4. Personalized recommendations for developing new habits or skills
        5. Suggestions for overcoming potential obstacles
        6. Long-term strategies for continuous personal development
        7. Recommended resources (books, courses, apps) for further growth
        8. Ideas for incorporating mindfulness and self-care into daily routines
        9. Strategies for maintaining motivation and accountability
        
        Format the response using Markdown for better readability. Use headings, subheadings, and bullet points for clarity.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setAnalysis(text);
    } catch (error) {
      console.error("Error generating analysis:", error);
      setAnalysis("An error occurred while generating the analysis. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateGrowthTip = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a brief, practical personal growth tip. 
        This should be a single sentence or short paragraph that offers an 
        easy-to-implement suggestion for self-improvement or developing a positive habit.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setGrowthTip(text);
    } catch (error) {
      console.error("Error generating growth tip:", error);
      setGrowthTip("Start your day with a short meditation or mindfulness exercise to improve focus and reduce stress.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-purple-700 flex items-center">
        <FaBrain className="mr-2" /> Personal Growth and Habit Tracker
      </h2>

      <AnimatePresence>
        {growthTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-purple-600">Growth Tip of the Day</h3>
            <p className="text-gray-700">{growthTip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-purple-600">Track Your Growth</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xl font-semibold mb-2 text-purple-500 flex items-center">
              <FaCheckCircle className="mr-2" /> Habits
            </h4>
            {habits.map((habit, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={habit.name}
                  onChange={(e) => updateHabit(index, "name", e.target.value)}
                  placeholder="Habit name"
                  className="w-full p-2 border rounded"
                />
                <select
                  value={habit.frequency}
                  onChange={(e) => updateHabit(index, "frequency", e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  value={habit.streak}
                  onChange={(e) => updateHabit(index, "streak", parseInt(e.target.value))}
                  placeholder="Current streak"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            ))}
            <button onClick={addHabit} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
              Add Habit
            </button>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2 text-purple-500 flex items-center">
              <FaChartLine className="mr-2" /> Goals
            </h4>
            {goals.map((goal, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={goal.description}
                  onChange={(e) => updateGoal(index, "description", e.target.value)}
                  placeholder="Goal description"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={goal.deadline}
                  onChange={(e) => updateGoal(index, "deadline", e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                />
                <input
                  type="number"
                  value={goal.progress}
                  onChange={(e) => updateGoal(index, "progress", parseInt(e.target.value))}
                  placeholder="Progress (%)"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            ))}
            <button onClick={addGoal} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
              Add Goal
            </button>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2 text-purple-500 flex items-center">
              <FaBook className="mr-2" /> Reflections
            </h4>
            {reflections.map((reflection, index) => (
              <div key={index} className="mb-2">
                <input
                  type="date"
                  value={reflection.date}
                  onChange={(e) => updateReflection(index, "date", e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={reflection.content}
                  onChange={(e) => updateReflection(index, "content", e.target.value)}
                  placeholder="Your reflection..."
                  className="w-full mt-1 p-2 border rounded"
                  rows="3"
                />
              </div>
            ))}
            <button onClick={addReflection} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
              Add Reflection
            </button>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateAnalysis}
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mx-auto block mt-8"
        disabled={isLoading}
      >
        <FaChartLine className="inline-block mr-2" /> Analyze Growth Journey
      </motion.button>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
            <FaChartLine className="mr-2" /> Personal Growth Analysis
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
            {analysis}
          </ReactMarkdown>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2 text-purple-600">30-Day Growth Challenge</h3>
        <p className="text-gray-700">
          Take on our 30-day personal growth challenge! Each day, focus on one aspect of your life to improve.
          Share your progress and insights with #30DaysOfGrowth to inspire others and stay accountable!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PersonalGrowthTracker;