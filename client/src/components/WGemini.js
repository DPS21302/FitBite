// WGemini.js
import React, { useState } from 'react';
import { FaRobot, FaSpinner } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';

const WGemini = ({ prompt, onResult }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const genAI = new GoogleGenerativeAI('AIzaSyASTsmmCaNfcu5eoqsqRZqZqDb7SXOjQ9Q'); // Replace with your Gemini API key
  const fetchGeminiResponse = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Remove markdown code block indicators and parse JSON
      text = text.replace(/^```json\s?/, '').replace(/\s?```$/, '').trim();
      const suggestions = JSON.parse(text);
      
      onResult(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setError(`Failed to get AI suggestions: ${error.message}`);
      onResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className='flex flex-col items-center justify-center space-y-4'>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center space-x-2 text-indigo-600"
        >
          <FaSpinner className="animate-spin" />
          <p>Generating AI suggestions...</p>
        </motion.div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 bg-red-100 px-4 py-2 rounded-full"
        >
          {error}
        </motion.p>
      )}
      <motion.button
        onClick={fetchGeminiResponse}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="absolute inset-0 bg-white"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.5, opacity: 0.3 }}
          transition={{ duration: 0.4 }}
        />
        <span className="relative z-10 flex items-center justify-center">
          <FaRobot className="mr-2" />
          Get AI Suggestions
        </span>
      </motion.button>
    </div>
  );
};

export default WGemini;