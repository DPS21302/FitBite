import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaLanguage, FaUtensils, FaLandmark, FaTheaterMasks, FaHandshake, FaBook, FaMusic, FaPray, FaUsers,FaRoute,FaTrash } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyAkIxz2zqMBwz4o791F_tbHpUUuMG6e8oc";

const GlobalCultureExplorer = () => {
  const [selectedCultures, setSelectedCultures] = useState([]);
  const [newCulture, setNewCulture] = useState("");
  const [culturalInsights, setCulturalInsights] = useState("");
  const [explorationPlan, setExplorationPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [culturalTip, setCulturalTip] = useState("");

  useEffect(() => {
    generateCulturalTip();
  }, []);

  const addCulture = () => {
    if (newCulture && !selectedCultures.includes(newCulture)) {
      setSelectedCultures([...selectedCultures, newCulture]);
      setNewCulture("");
    }
  };

  const removeCulture = (culture) => {
    setSelectedCultures(selectedCultures.filter(c => c !== culture));
  };

  const generateCulturalInsights = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Provide cultural insights and promote intercultural understanding for the following cultures:
        
        ${selectedCultures.join(", ")}
        
        Please include:
        1. Brief overview of each culture's history and significance
        2. Key cultural values and beliefs
        3. Traditional customs and etiquette
        4. Significant holidays and celebrations
        5. Traditional arts and crafts
        6. Culinary traditions and popular dishes
        7. Language basics (greetings, thank you, please)
        8. Cultural dos and don'ts
        9. Similarities and differences between the cultures
        10. Tips for respectful cultural exchange and communication
        
        Format the response using Markdown for better readability. Use headings, subheadings, and bullet points for clarity.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setCulturalInsights(text);
    } catch (error) {
      console.error("Error generating cultural insights:", error);
      setCulturalInsights("An error occurred while generating cultural insights. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateExplorationPlan = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a 30-day cultural exploration plan for the following cultures:
        
        ${selectedCultures.join(", ")}
        
        Please include:
        1. A title for the 30-day cultural exploration journey
        2. 30 daily activities or mini-challenges related to the selected cultures
        3. Book, movie, and music recommendations for each culture
        4. Virtual tour suggestions for cultural landmarks and museums
        5. Language learning resources and daily practice ideas
        6. Recipes for traditional dishes to try at home
        7. Suggestions for connecting with people from these cultures (e.g., language exchange, cultural events)
        8. Reflection prompts to deepen intercultural understanding
        9. Ideas for applying cultural learnings in daily life
        10. Tips for respectful cultural appreciation vs. appropriation
        
        Format the response using Markdown for better readability. Use headings, subheadings, and bullet points for clarity.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setExplorationPlan(text);
    } catch (error) {
      console.error("Error generating exploration plan:", error);
      setExplorationPlan("An error occurred while generating the exploration plan. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateCulturalTip = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a brief, practical tip for fostering intercultural understanding and appreciation. 
        This should be a single sentence or short paragraph that offers an easy-to-implement 
        suggestion for broadening one's cultural horizons and promoting global awareness.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setCulturalTip(text);
    } catch (error) {
      console.error("Error generating cultural tip:", error);
      setCulturalTip("Learn a few basic phrases in a new language and use them to greet people from that culture.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-teal-100 to-blue-100 p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-teal-700 flex items-center">
        <FaGlobe className="mr-2" /> Global Culture Explorer
      </h2>

      <AnimatePresence>
        {culturalTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-teal-600">Cultural Tip of the Day</h3>
            <p className="text-gray-700">{culturalTip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-teal-600">Select Cultures to Explore</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            value={newCulture}
            onChange={(e) => setNewCulture(e.target.value)}
            placeholder="Enter a culture or country"
            className="p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCulture}
            className="bg-teal-500 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            <FaGlobe className="inline-block mr-2" /> Add Culture
          </motion.button>
        </div>

        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2 text-teal-600">Selected Cultures:</h4>
          {selectedCultures.map((culture, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
            >
              <span className="flex items-center">
                <FaLandmark className="mr-2 text-teal-500" />
                <span>{culture}</span>
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeCulture(culture)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateCulturalInsights}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={selectedCultures.length === 0 || isLoading}
        >
          <FaBook className="inline-block mr-2" /> Generate Cultural Insights
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateExplorationPlan}
          className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          disabled={selectedCultures.length === 0 || isLoading}
        >
          <FaRoute className="inline-block mr-2" /> Create Exploration Plan
        </motion.button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      )}

      {culturalInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-teal-700 flex items-center">
            <FaBook className="mr-2" /> Cultural Insights
          </h3>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-teal-600" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-teal-600" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2 text-teal-500" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3 text-gray-700" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            }}
          >
            {culturalInsights}
          </ReactMarkdown>
        </motion.div>
      )}

      {explorationPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
            <FaRoute className="mr-2" /> 30-Day Cultural Exploration Plan
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
            {explorationPlan}
          </ReactMarkdown>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2 text-teal-600">Global Citizen Challenge</h3>
        <p className="text-gray-700">
          Take the 30-day Global Citizen Challenge! Commit to learning about and engaging with different cultures every day. 
          Share your experiences on social media with #30DaysOfCulturalExploration to inspire others and connect with fellow global citizens!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GlobalCultureExplorer;