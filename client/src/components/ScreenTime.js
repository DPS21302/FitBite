import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaClock, FaChartBar, FaLaptop, FaMobileAlt, FaTabletAlt, FaTv, FaDesktop, FaGamepad, FaHeadphones } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";

const GEMINI_API_KEY = "AIzaSyCl1TuHfx8HGdGCj6D-ZSTQSdCKEjX_IYg";

const ScreenTime = () => {
  const [screenTimeData, setScreenTimeData] = useState({});
  const [selectedDevice, setSelectedDevice] = useState("");
  const [hours, setHours] = useState("");
  const [purpose, setPurpose] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const devices = [
    "Laptop",
    "Smartphone",
    "Tablet",
    "TV",
    "Desktop Computer",
    "Gaming Console",
    "Smart Watch",
    "E-reader",
  ];

  const addScreenTimeEntry = () => {
    if (selectedDevice && hours && purpose) {
      setScreenTimeData(prevData => ({
        ...prevData,
        [selectedDevice]: [
          ...(prevData[selectedDevice] || []),
          { hours: parseFloat(hours), purpose }
        ]
      }));
      setHours("");
      setPurpose("");
    }
  };

  const removeScreenTimeEntry = (device, index) => {
    setScreenTimeData(prevData => ({
      ...prevData,
      [device]: prevData[device].filter((_, i) => i !== index)
    }));
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Analyze the following screen time data and provide insights, recommendations, and potential health impacts:
        
        ${Object.entries(screenTimeData).map(([device, entries]) => 
          `${device}:\n${entries.map(entry => `- ${entry.hours} hours: ${entry.purpose}`).join('\n')}`
        ).join('\n\n')}
        
        Please include:
        1. Total screen time and breakdown by device
        2. Potential health impacts (eye strain, posture issues, etc.)
        3. Productivity analysis
        4. Recommendations for reducing screen time
        5. Suggestions for more balanced device usage
        6. Diet recommendations to support eye health and overall well-being
        
        Format the response using Markdown for better readability.
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

  const deviceIcons = {
    Laptop: <FaLaptop />,
    Smartphone: <FaMobileAlt />,
    Tablet: <FaTabletAlt />,
    TV: <FaTv />,
    "Desktop Computer": <FaDesktop />,
    "Gaming Console": <FaGamepad />,
    "Smart Watch": <FaHeadphones />,
    "E-reader": <FaTabletAlt />,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-blue-700 flex items-center">
        <FaClock className="mr-2" /> Screen Time Analyzer
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-blue-600">Add Screen Time Entry</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Device</option>
            {devices.map(device => (
              <option key={device} value={device}>{device}</option>
            ))}
          </select>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Purpose"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addScreenTimeEntry}
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaPlus className="inline-block mr-2" /> Add Entry
          </motion.button>
        </div>

        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2 text-blue-600">Entered Data:</h4>
          {Object.entries(screenTimeData).map(([device, entries]) => (
            <div key={device} className="mb-4">
              <h5 className="text-lg font-semibold mb-2">{device}</h5>
              {entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2"
                >
                  <span className="flex items-center">
                    {deviceIcons[device]}
                    <span className="ml-2">{entry.hours} hours - {entry.purpose}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeScreenTimeEntry(device, index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateAnalysis}
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mx-auto block mt-8"
        disabled={Object.keys(screenTimeData).length === 0 || isLoading}
      >
        <MdAnalytics className="inline-block mr-2" /> Analyze Screen Time
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
            <FaChartBar className="mr-2" /> Screen Time Analysis
          </h3>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 text-purple-600" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-2 text-purple-600" {...props} />,
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
    </motion.div>
  );
};

export default ScreenTime;