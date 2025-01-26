import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaCar, FaHome, FaUtensils, FaShoppingBag, FaPlane, FaRecycle, FaLightbulb, FaChartLine } from "react-icons/fa";

const GEMINI_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const CarbonFootprint = () => {
  const [footprintData, setFootprintData] = useState({
    transportation: {
      carType: "",
      carMileage: "",
      publicTransportUsage: "",
      flightsPerYear: "",
    },
    home: {
      energySource: [],
      homeSize: "",
      occupants: "",
      heatingType: "",
      coolingType: "",
    },
    diet: {
      dietType: "",
      localFoodPercentage: "",
      foodWaste: "",
    },
    consumption: {
      clothingPurchases: "",
      electronicsUsage: "",
      recyclingHabits: [],
    },
    lifestyle: {
      hobbies: [],
      ecofriendlyProducts: "",
    },
  });

  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ecoTip, setEcoTip] = useState("");
  const [currentSection, setCurrentSection] = useState("transportation");
  const [progress, setProgress] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState(null);

  useEffect(() => {
    generateEcoTip();
    generateQuizQuestion();
  }, []);

  useEffect(() => {
    const totalFields = Object.values(footprintData).reduce(
      (acc, section) => acc + Object.keys(section).length,
      0
    );
    const filledFields = Object.values(footprintData).reduce(
      (acc, section) => acc + Object.values(section).filter(v => v !== "" && v.length !== 0).length,
      0
    );
    setProgress((filledFields / totalFields) * 100);
  }, [footprintData]);

  const handleInputChange = (category, subcategory, value) => {
    setFootprintData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [subcategory]: value,
      },
    }));
  };

  const handleArrayInputChange = (category, subcategory, value) => {
    setFootprintData((prevData) => {
      const currentArray = prevData[category][subcategory] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prevData,
        [category]: {
          ...prevData[category],
          [subcategory]: newArray,
        },
      };
    });
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Analyze the following personal carbon footprint data and provide insights, recommendations, and potential improvements:
        
        ${JSON.stringify(footprintData, null, 2)}
        
        Please include:
        1. Estimated annual carbon footprint in metric tons of CO2
        2. Breakdown of carbon footprint by category (transportation, home, diet, consumption, lifestyle)
        3. Comparison to average carbon footprint in user's region (assume global average if no specific region)
        4. Top 3 areas where the user can make the biggest impact in reducing their carbon footprint
        5. Personalized, actionable recommendations for reducing carbon footprint in each category
        6. Long-term strategies for adopting a more sustainable lifestyle
        7. Potential positive environmental impact if recommendations are followed
        8. Suggestions for community involvement and advocacy for climate action
        9. Resources and tools for further learning about sustainability and climate change
        
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

  const generateEcoTip = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a brief, practical eco-friendly tip for reducing one's carbon footprint. 
        This should be a single sentence or short paragraph that offers an easy-to-implement 
        suggestion for more sustainable living.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setEcoTip(text);
    } catch (error) {
      console.error("Error generating eco tip:", error);
      setEcoTip("Turn off lights and electronics when not in use to save energy.");
    }
  };

  const generateQuizQuestion = async () => {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Generate a multiple-choice quiz question about carbon footprint and sustainability.
        Include the question, four answer options, and the correct answer.
        Format the response as a JSON object with keys: question, options (array), and correctAnswer.
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setQuizQuestion(JSON.parse(text));
    } catch (error) {
      console.error("Error generating quiz question:", error);
      setQuizQuestion(null);
    }
  };

  const renderInputField = (category, subcategory, label, type = "text", options = []) => {
    const value = footprintData[category][subcategory] || "";
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(category, subcategory, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "multiselect" ? (
          <div className="mt-1 space-y-2">
            {options.map((option) => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={() => handleArrayInputChange(category, subcategory, option)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleInputChange(category, subcategory, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        )}
      </div>
    );
  };

  const renderSection = (section) => {
    switch (section) {
      case "transportation":
        return (
          <div>
            <h4 className="text-xl font-semibold mb-2 text-green-500 flex items-center">
              <FaCar className="mr-2" /> Transportation
            </h4>
            {renderInputField("transportation", "carType", "Car Type", "select", ["Electric", "Hybrid", "Gasoline", "Diesel", "No car"])}
            {renderInputField("transportation", "carMileage", "Annual Car Mileage", "number")}
            {renderInputField("transportation", "publicTransportUsage", "Public Transport Usage", "select", ["Daily", "Weekly", "Monthly", "Rarely", "Never"])}
            {renderInputField("transportation", "flightsPerYear", "Flights per Year", "number")}
          </div>
        );
      case "home":
        return (
          <div>
            <h4 className="text-xl font-semibold mb-2 text-green-500 flex items-center">
              <FaHome className="mr-2" /> Home
            </h4>
            {renderInputField("home", "energySource", "Energy Sources", "multiselect", ["Grid Electricity", "Solar", "Wind", "Natural Gas", "Oil"])}
            {renderInputField("home", "homeSize", "Home Size (sq ft)", "number")}
            {renderInputField("home", "occupants", "Number of Occupants", "number")}
            {renderInputField("home", "heatingType", "Heating Type", "select", ["Electric", "Natural Gas", "Oil", "Heat Pump", "Wood"])}
            {renderInputField("home", "coolingType", "Cooling Type", "select", ["Central AC", "Window AC", "Heat Pump", "Fans", "None"])}
          </div>
        );
      case "diet":
        return (
          <div>
            <h4 className="text-xl font-semibold mb-2 text-green-500 flex items-center">
              <FaUtensils className="mr-2" /> Diet
            </h4>
            {renderInputField("diet", "dietType", "Diet Type", "select", ["Vegan", "Vegetarian", "Pescatarian", "Flexitarian", "Omnivore"])}
            {renderInputField("diet", "localFoodPercentage", "Local Food Percentage", "number")}
            {renderInputField("diet", "foodWaste", "Food Waste Percentage", "number")}
          </div>
        );
      case "consumption":
        return (
          <div>
            <h4 className="text-xl font-semibold mb-2 text-green-500 flex items-center">
              <FaShoppingBag className="mr-2" /> Consumption
            </h4>
            {renderInputField("consumption", "clothingPurchases", "New Clothing Items per Year", "number")}
            {renderInputField("consumption", "electronicsUsage", "Electronics Usage", "select", ["Low", "Moderate", "High"])}
            {renderInputField("consumption", "recyclingHabits", "Recycling Habits", "multiselect", ["Paper", "Plastic", "Glass", "Metal", "Electronics", "Compost"])}
          </div>
        );
      case "lifestyle":
        return (
          <div>
            <h4 className="text-xl font-semibold mb-2 text-green-500 flex items-center">
              <FaLeaf className="mr-2" /> Lifestyle
            </h4>
            {renderInputField("lifestyle", "hobbies", "Eco-friendly Hobbies", "multiselect", ["Gardening", "Hiking", "Cycling", "Upcycling", "Volunteering"])}
            {renderInputField("lifestyle", "ecofriendlyProducts", "Eco-friendly Product Usage", "select", ["Always", "Often", "Sometimes", "Rarely", "Never"])}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-green-700 flex items-center">
        <FaLeaf className="mr-2" /> Carbon Footprint Calculator & Sustainability Advisor
      </h2>

      <AnimatePresence>
        {ecoTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-green-600">Eco Tip of the Day</h3>
            <p className="text-gray-700">{ecoTip}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-green-600">Your Carbon Footprint Data</h3>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="flex mb-4 space-x-2">
          {["transportation", "home", "diet", "consumption", "lifestyle"].map((section) => (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentSection === section
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection(currentSection)}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateAnalysis}
        className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mx-auto block mt-8"
        disabled={isLoading}
      >
        <FaChartLine className="inline-block mr-2" /> Analyze Carbon Footprint
      </motion.button>

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
            <FaChartLine className="mr-2" /> Carbon Footprint Analysis
          </h3>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-green-600" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-green-600" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mb-2 text-green-500" {...props} />,
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

      {/* Sustainability Challenge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2 text-green-600">Sustainability Challenge</h3>
        <p className="text-gray-700">
          Take the 30-day sustainability challenge! Each day, implement one small change to reduce your carbon footprint. 
          Share your progress on social media with #30DaysSustainable to inspire others!
        </p>
      </motion.div>

      {/* Sustainability Quiz */}
      {quizQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-green-600">Sustainability Quiz</h3>
          <p className="text-gray-700 mb-4">{quizQuestion.question}</p>
          <div className="space-y-2">
            {quizQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => alert(option === quizQuestion.correctAnswer ? "Correct!" : "Incorrect. Try again!")}
                className="block w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Eco-friendly Tips Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8 bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-green-600">Eco-friendly Tips</h3>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out transform -translate-x-full">
            <div className="flex-shrink-0 w-full">
              <p className="text-gray-700">Use reusable bags when shopping to reduce plastic waste.</p>
            </div>
            <div className="flex-shrink-0 w-full">
              <p className="text-gray-700">Switch to LED bulbs to save energy and reduce your electricity bill.</p>
            </div>
            <div className="flex-shrink-0 w-full">
              <p className="text-gray-700">Start composting food scraps to reduce landfill waste and create nutrient-rich soil.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Community Impact Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="mt-8 bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-green-600">Community Impact</h3>
        <div className="flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border-8 border-green-500 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">1,234</p>
              <p className="text-sm text-gray-600">Trees Saved</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CarbonFootprint;