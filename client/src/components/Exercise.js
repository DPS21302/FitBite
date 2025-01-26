import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from './Footer';

const Exercise = () => {
  const [query, setQuery] = useState('');
  const [suggestedExercises, setSuggestedExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Get exercise recommendations from Gemini
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using base model for faster response
      const prompt = `
      Based on the user's request: "${query}"
      Recommend suitable exercises for the user.
      Return only the exercise names as a comma-separated list.
      Important: Return only exercise names that are commonly found in gyms or workout routines.
      `; 
      console.log('Sending query to Gemini:', query);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendedExercises = response.text().split(',').map(e => e.trim());
      console.log('Received recommendations:', recommendedExercises);

      // 2. Get exercise details from backend
      const backendResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/exercises`,
        { 
          exerciseNames: recommendedExercises.filter(name => name.length > 0) // Filter out empty names
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (backendResponse.data.length === 0) {
        toast.error('No matching exercises found');
        return;
      }

      console.log('Received exercise details:', backendResponse.data);
      setSuggestedExercises(backendResponse.data);

    } catch (error) {
      console.error('Error details:', error);
      toast.error('Failed to fetch exercise recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 text-center mb-12"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Exercise Recommendations
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your fitness goals
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md"
              placeholder="e.g., I want exercises for building upper body strength"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full p-4 bg-[#609a33] text-white rounded-md hover:bg-[#4c7a29] transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </form>

        {suggestedExercises.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Suggested Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedExercises.map((exercise, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h4 className="text-xl font-bold mb-4">{exercise.name}</h4>
                  {exercise.gifUrl && (
                    <img 
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-128 object-cover rounded-md mb-4"
                      onError={(e) => {
                        console.error('Failed to load image:', exercise.gifUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-gray-600 mb-4">{exercise.instructions}</p>
                  <a 
                    href={exercise.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Exercise;