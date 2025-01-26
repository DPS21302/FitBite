import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaGlobeAmericas, FaHeart, FaBrain, FaLeaf, FaHandsHelping, FaPalette, FaLightbulb, FaChartLine, FaBalanceScale } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyAkIxz2zqMBwz4o791F_tbHpUUuMG6e8oc";

const FutureVisionBoard = () => {
  const [visionAreas, setVisionAreas] = useState({
    career: "",
    relationships: "",
    personalGrowth: "",
    health: "",
    environment: "",
    society: "",
    creativity: "",
    innovation: "",
    wealth: "",
    ethics: "",
  });
  const [utopiaVision, setUtopiaVision] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inspirationQuote, setInspirationQuote] = useState("");

  useEffect(() => {
    generateInspirationQuote();
  }, []);

  const handleVisionChange = (area, value) => {
    setVisionAreas(prevVision => ({
      ...prevVision,
      [area]: value,
    }));
  };

  const generateUtopiaVision = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Create a vivid and inspiring vision of a personal utopia based on the following aspirations:

        ${Object.entries(visionAreas).map(([area, vision]) => `${area}: ${vision}`).join('\n')}

        Please include:
        1. A compelling narrative describing this ideal future (5-10 years from now)
        2. How personal goals align with global progress and societal well-being
        3. Innovative solutions to current global challenges incorporated in this vision
        4. The emotional and sensory experience of living in this personal utopia
        5. Potential ripple effects of achieving this vision on the wider community and world
        6. Ethical considerations and how they're addressed in this utopian future
        7. Balance between technological advancement and environmental sustainability
        8. How relationships and community evolve in this ideal future
        9. The role of creativity and innovation in shaping this utopia
        10. How personal growth and societal progress intertwine in this vision

        Format the response using Markdown for better readability. Use vivid language, metaphors, and sensory details to make the vision come alive.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setUtopiaVision(text);
    } catch (error) {
      console.error("Error generating utopia vision:", error);
      setUtopiaVision("An error occurred while generating the utopia vision. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Create a detailed 5-year roadmap to achieve the following personal utopia vision:

        ${utopiaVision}

        Please include:
        1. Quarterly milestones for each year, covering all aspects of the vision
        2. Specific, actionable steps to achieve each milestone
        3. Potential challenges and strategies to overcome them
        4. Required skills to develop and resources to acquire
        5. Networking and collaboration opportunities to support the journey
        6. Methods to measure progress and adjust the plan as needed
        7. Integration of personal growth with societal contribution
        8. Balancing short-term actions with long-term vision
        9. Incorporating flexibility to adapt to changing global circumstances
        10. Suggestions for maintaining motivation and resilience throughout the journey

        Format the response using Markdown for better readability. Use headings, subheadings, and bullet points for clarity.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setRoadmap(text);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setRoadmap("An error occurred while generating the roadmap. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInspirationQuote = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate an inspiring and thought-provoking quote about shaping the future, personal growth, 
        and making a positive impact on the world. The quote should be original and not attributed to any person.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setInspirationQuote(text);
    } catch (error) {
      console.error("Error generating inspiration quote:", error);
      setInspirationQuote("The future belongs to those who believe in the beauty of their dreams and the power of their actions.");
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
        <FaRocket className="mr-2" /> Future Vision Board & Personal Utopia Generator
      </h2>

      <AnimatePresence>
        {inspirationQuote && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Inspiration of the Day</h3>
            <p className="text-gray-700 italic">"{inspirationQuote}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">Shape Your Future Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(visionAreas).map(([area, vision]) => (
            <div key={area} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </label>
              <textarea
                value={vision}
                onChange={(e) => handleVisionChange(area, e.target.value)}
                placeholder={`Describe your vision for ${area}...`}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateUtopiaVision}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          disabled={Object.values(visionAreas).every(v => v === "") || isLoading}
        >
          <FaGlobeAmericas className="inline-block mr-2" /> Generate Utopia Vision
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRoadmap}
          className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          disabled={!utopiaVision || isLoading}
        >
          <FaChartLine className="inline-block mr-2" /> Create 5-Year Roadmap
        </motion.button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {utopiaVision && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center">
            <FaGlobeAmericas className="mr-2" /> Your Personal Utopia Vision
          </h3>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-indigo-600" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-indigo-600" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2 text-indigo-500" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3 text-gray-700" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            }}
          >
            {utopiaVision}
          </ReactMarkdown>
        </motion.div>
      )}

      {roadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
            <FaChartLine className="mr-2" /> Your 5-Year Roadmap to Utopia
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
            {roadmap}
          </ReactMarkdown>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2 text-indigo-600">Utopia Builder Challenge</h3>
        <p className="text-gray-700">
          Embark on the 365-day Utopia Builder Challenge! Commit to taking one action every day that brings you closer to your personal utopia vision. 
          Share your journey and inspire others with #365DaysToUtopia. Together, let's create a better future for ourselves and the world!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FutureVisionBoard;