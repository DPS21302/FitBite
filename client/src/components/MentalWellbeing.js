import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaHeartbeat, FaMoon, FaUtensils, FaRunning, FaSmile, FaChartLine, FaBook, FaSun, FaLeaf } from "react-icons/fa";
import { MdWork, MdNaturePeople, MdMood } from "react-icons/md";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { MdAnalytics } from "react-icons/md";


const GEMINI_API_KEY = "AIzaSyCl1TuHfx8HGdGCj6D-ZSTQSdCKEjX_IYg";



// Add this function to generate the analysis


// Add this button at the end of your component, before the closing div


const MentalWellbeing = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wellbeingData, setWellbeingData] = useState({
    mood: { morning: "", afternoon: "", evening: "" },
    sleep: { duration: "7", quality: "", consistency: "" },
    stress: { level: "", sources: [], copingMechanisms: [] },
    physicalHealth: { exercise: { type: [], duration: "", frequency: "" }, diet: { quality: "", waterIntake: "", nutritionBalance: "" } },
    socialLife: { interactionsFrequency: "", relationshipSatisfaction: "", supportSystem: "" },
    work: { satisfaction: "", workLifeBalance: "", jobStress: "" },
    personalGrowth: { hobbies: [], learningNewSkills: "", selfReflection: "" },
    environment: { homeAtmosphere: "", natureExposure: "", screenTime: "" },
    mentalStates: { anxiety: "", depression: "", focus: "", creativity: "" },
    copingStrategies: { meditation: "", journaling: "", therapy: "", relaxationTechniques: [] }
  });

  const sections = [
    { name: "Mood", icon: MdMood, color: "bg-blue-500" },
    { name: "Sleep", icon: FaMoon, color: "bg-indigo-500" },
    { name: "Stress", icon: FaHeartbeat, color: "bg-red-500" },
    { name: "Social Life", icon: FaSmile, color: "bg-yellow-500" },
    { name: "Work", icon: MdWork, color: "bg-purple-500" },
    { name: "Personal Growth", icon: FaBook, color: "bg-pink-500" },
    { name: "Environment", icon: MdNaturePeople, color: "bg-teal-500" },
    { name: "Mental States", icon: FaBrain, color: "bg-orange-500" },
    { name: "Coping Strategies", icon: FaLeaf, color: "bg-lime-500" }
  ];

  const handleInputChange = (category, subcategory, value) => {
    setWellbeingData((prevData) => ({
      ...prevData,
      [category]: { ...prevData[category], [subcategory]: value },
    }));
  };
  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      const prompt = `
        Analyze the following mental wellbeing data and provide insights, recommendations, and potential health impacts:
        
        ${Object.entries(wellbeingData).map(([category, data]) => 
          `${category}:\n${Object.entries(data).map(([key, value]) => `- ${key}: ${value}`).join('\n')}`
        ).join('\n\n')}
        
        Please include:
        1. Overall mental wellbeing assessment
        2. Breakdown of each category (mood, sleep, stress, etc.)
        3. Potential health impacts
        4. Recommendations for improving mental wellbeing
        5. Suggestions for lifestyle changes
        6. Advice on seeking professional help if necessary
        
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


  const handleArrayInputChange = (category, subcategory, value) => {
    setWellbeingData((prevData) => {
      const currentArray = prevData[category][subcategory] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return {
        ...prevData,
        [category]: { 
          ...prevData[category], 
          [subcategory]: newArray 
        },
      };
    });
  };

  const renderCurrentSection = () => {
    const section = sections[currentSection];
    switch (section.name) {
      case "Mood":
        return (
          <div className="space-y-4">
            {["morning", "afternoon", "evening"].map((time) => (
              <div key={time}>
                <label className="block text-lg font-medium text-gray-700 mb-2">{time.charAt(0).toUpperCase() + time.slice(1)} Mood</label>
                <div className="flex justify-between">
                  {["😢", "😐", "😊", "😄", "🤩"].map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange("mood", time, index)}
                      className={`text-4xl p-2 rounded-full ${
                        wellbeingData.mood[time] === index ? "bg-blue-200" : "hover:bg-gray-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "Sleep":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Sleep Duration</label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={wellbeingData.sleep.duration}
                onChange={(e) => handleInputChange("sleep", "duration", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">{wellbeingData.sleep.duration} hours</div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Sleep Quality</label>
              <div className="flex justify-between">
                {["Poor", "Fair", "Good", "Excellent"].map((quality) => (
                  <button
                    key={quality}
                    onClick={() => handleInputChange("sleep", "quality", quality)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.sleep.quality === quality ? "bg-indigo-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Sleep Consistency</label>
              <div className="flex justify-between">
                {["Inconsistent", "Somewhat Consistent", "Very Consistent"].map((consistency) => (
                  <button
                    key={consistency}
                    onClick={() => handleInputChange("sleep", "consistency", consistency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.sleep.consistency === consistency ? "bg-indigo-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {consistency}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "Stress":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Stress Level</label>
              <input
                type="range"
                min="0"
                max="10"
                value={wellbeingData.stress.level}
                onChange={(e) => handleInputChange("stress", "level", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">Level: {wellbeingData.stress.level}</div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Stress Sources</label>
              <div className="grid grid-cols-2 gap-2">
                {["Work", "Relationships", "Finance", "Health", "Family", "Education"].map((source) => (
                  <button
                    key={source}
                    onClick={() => handleArrayInputChange("stress", "sources", source)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.stress.sources.includes(source) ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Coping Mechanisms</label>
              <div className="grid grid-cols-2 gap-2">
                {["Exercise", "Meditation", "Talking to Friends", "Hobbies", "Professional Help", "Relaxation"].map((mechanism) => (
                  <button
                    key={mechanism}
                    onClick={() => handleArrayInputChange("stress", "copingMechanisms", mechanism)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.stress.copingMechanisms.includes(mechanism) ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {mechanism}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
       case "Social Life":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Social Interactions Frequency</label>
              <div className="flex justify-between">
                {["Rarely", "Monthly", "Weekly", "Several times a week", "Daily"].map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => handleInputChange("socialLife", "interactionsFrequency", frequency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.socialLife.interactionsFrequency === frequency ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Relationship Satisfaction</label>
              <input
                type="range"
                min="0"
                max="10"
                value={wellbeingData.socialLife.relationshipSatisfaction}
                onChange={(e) => handleInputChange("socialLife", "relationshipSatisfaction", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">Satisfaction: {wellbeingData.socialLife.relationshipSatisfaction}/10</div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Support System Strength</label>
              <div className="flex justify-between">
                {["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"].map((strength) => (
                  <button
                    key={strength}
                    onClick={() => handleInputChange("socialLife", "supportSystem", strength)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.socialLife.supportSystem === strength ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {strength}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "Work":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Job Satisfaction</label>
              <input
                type="range"
                min="0"
                max="10"
                value={wellbeingData.work.satisfaction}
                onChange={(e) => handleInputChange("work", "satisfaction", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">Satisfaction: {wellbeingData.work.satisfaction}/10</div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Work-Life Balance</label>
              <div className="flex justify-between">
                {["Poor", "Fair", "Good", "Excellent"].map((balance) => (
                  <button
                    key={balance}
                    onClick={() => handleInputChange("work", "workLifeBalance", balance)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.work.workLifeBalance === balance ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {balance}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Job Stress Level</label>
              <input
                type="range"
                min="0"
                max="10"
                value={wellbeingData.work.jobStress}
                onChange={(e) => handleInputChange("work", "jobStress", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">Stress Level: {wellbeingData.work.jobStress}/10</div>
            </div>
          </div>
        );
      case "Personal Growth":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Hobbies</label>
              <div className="grid grid-cols-3 gap-2">
                {["Reading", "Art", "Music", "Sports", "Cooking", "Gardening", "Travel", "Photography", "Writing"].map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => handleArrayInputChange("personalGrowth", "hobbies", hobby)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.personalGrowth.hobbies.includes(hobby) ? "bg-pink-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Learning New Skills</label>
              <div className="flex justify-between">
                {["Never", "Rarely", "Sometimes", "Often", "Constantly"].map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => handleInputChange("personalGrowth", "learningNewSkills", frequency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.personalGrowth.learningNewSkills === frequency ? "bg-pink-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Self-Reflection Practice</label>
              <div className="flex justify-between">
                {["Never", "Rarely", "Monthly", "Weekly", "Daily"].map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => handleInputChange("personalGrowth", "selfReflection", frequency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.personalGrowth.selfReflection === frequency ? "bg-pink-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "Environment":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Home Atmosphere</label>
              <div className="flex justify-between">
                {["Very Stressful", "Somewhat Stressful", "Neutral", "Somewhat Peaceful", "Very Peaceful"].map((atmosphere) => (
                  <button
                    key={atmosphere}
                    onClick={() => handleInputChange("environment", "homeAtmosphere", atmosphere)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.environment.homeAtmosphere === atmosphere ? "bg-teal-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {atmosphere}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Nature Exposure</label>
              <div className="flex justify-between">
                {["Rarely", "Monthly", "Weekly", "Several times a week", "Daily"].map((exposure) => (
                  <button
                    key={exposure}
                    onClick={() => handleInputChange("environment", "natureExposure", exposure)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.environment.natureExposure === exposure ? "bg-teal-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {exposure}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Daily Screen Time (hours)</label>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={wellbeingData.environment.screenTime}
                onChange={(e) => handleInputChange("environment", "screenTime", e.target.value)}
                className="w-full"
              />
              <div className="text-center mt-2">{wellbeingData.environment.screenTime} hours</div>
            </div>
          </div>
        );
      case "Mental States":
        return (
          <div className="space-y-4">
            {["anxiety", "depression", "focus", "creativity"].map((state) => (
              <div key={state}>
                <label className="block text-lg font-medium text-gray-700 mb-2">{state.charAt(0).toUpperCase() + state.slice(1)} Level</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={wellbeingData.mentalStates[state]}
                  onChange={(e) => handleInputChange("mentalStates", state, e.target.value)}
                  className="w-full"
                />
                <div className="text-center mt-2">{state.charAt(0).toUpperCase() + state.slice(1)}: {wellbeingData.mentalStates[state]}/10</div>
              </div>
            ))}
          </div>
        );
      case "Coping Strategies":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Meditation Practice</label>
              <div className="flex justify-between">
                {["Never", "Rarely", "Sometimes", "Often", "Daily"].map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => handleInputChange("copingStrategies", "meditation", frequency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.copingStrategies.meditation === frequency ? "bg-lime-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Journaling Frequency</label>
              <div className="flex justify-between">
                {["Never", "Rarely", "Sometimes", "Often", "Daily"].map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => handleInputChange("copingStrategies", "journaling", frequency)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.copingStrategies.journaling === frequency ? "bg-lime-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Therapy/Counseling</label>
              <div className="flex justify-between">
                {["Never tried", "Not currently", "Occasional sessions", "Regular sessions"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleInputChange("copingStrategies", "therapy", status)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.copingStrategies.therapy === status ? "bg-lime-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Relaxation Techniques</label>
              <div className="grid grid-cols-2 gap-2">
                {["Deep breathing", "Progressive muscle relaxation", "Visualization", "Yoga", "Tai Chi", "Aromatherapy"].map((technique) => (
                  <button
                    key={technique}
                    onClick={() => handleArrayInputChange("copingStrategies", "relaxationTechniques", technique)}
                    className={`px-4 py-2 rounded ${
                      wellbeingData.copingStrategies.relaxationTechniques.includes(technique) ? "bg-lime-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {technique}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div>Section not implemented</div>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center">
        <FaBrain className="mr-2" /> Mental Wellbeing Tracker
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap justify-center mb-6">
          {sections.map((section, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection(index)}
              className={`${section.color} text-white p-3 rounded-full m-2 ${
                currentSection === index ? "ring-4 ring-offset-2 ring-blue-300" : ""
              }`}
            >
              <section.icon size={24} />
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">{sections[currentSection].name}</h3>
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection((prev) => (prev > 0 ? prev - 1 : prev))}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          disabled={currentSection === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentSection((prev) => (prev < sections.length - 1 ? prev + 1 : prev))}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          disabled={currentSection === sections.length - 1}
        >
          Next
        </button>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateAnalysis}
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 mx-auto block mt-8"
        disabled={isLoading}
      >
        <MdAnalytics className="inline-block mr-2" /> Analyze Mental Wellbeing
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
            <MdAnalytics className="mr-2" /> Mental Wellbeing Analysis
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
    </div>
  );
};

export default MentalWellbeing;