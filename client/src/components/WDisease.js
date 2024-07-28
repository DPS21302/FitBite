import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import { FaWeight, FaExclamationTriangle, FaHeartbeat, FaListUl } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import WGemini from './WGemini';

// Import your JSON data
import diseaseData from '../data/diseaseData.json';

const WDisease = () => {
  const { disease } = useParams();
  console.log("From URL: ", disease)
  const [currentDisease, setCurrentDisease] = useState(null);
  
  useEffect(() => {
    const diseaseSelected = diseaseData[disease];
    if (diseaseSelected) {
      console.log("From JSON: ", diseaseSelected)
      setCurrentDisease(diseaseSelected);
    }
  }, [disease]);
  
  
  if (!currentDisease) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse animation-delay-400"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50">
      <DiseaseOverview data={currentDisease.overview} />
      <DiseaseCalculator data={currentDisease.calculator} />
      <ResourcesAndSupport data={currentDisease.resources} />
      <RecipeSuggestions data={currentDisease.recipeData}  />
     <MythsAndFAQs data={currentDisease.mythsAndFAQs} />
    </div>
  );
}

const DiseaseOverview = ({ data }) => {
  const [selectedFact, setSelectedFact] = useState(null);

  return (
    <div className="p-8 min-h-screen">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-center text-teal-600 tracking-wide"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Unraveling {data.fullName}
      </motion.h1>

      <motion.div 
        className="bg-white p-8 rounded-3xl shadow-lg mb-12 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold mb-4 text-teal-700">What is {data.name}?</h2>
        <p className="text-lg text-gray-700 relative z-10">
          {data.description}
        </p>
        <FaIcons.FaLeaf className="absolute right-4 bottom-4 text-green-200 text-8xl transform rotate-45" />
      </motion.div>

      <h2 className="text-3xl font-semibold mb-8 text-center text-teal-600">The {data.name} Mosaic</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.quickFacts.map((fact, index) => (
          <motion.div 
            key={index}
            className="relative group"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-md cursor-pointer overflow-hidden group-hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedFact(fact)}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ color: fact.color }}>
                {React.createElement(FaIcons[fact.icon])}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{fact.text}</h3>
              <p className="text-md mb-2 text-black line-clamp-1">{fact.details}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 transition-opacity duration-300" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedFact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-20"
            onClick={() => setSelectedFact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 15 }}
              className="bg-white text-gray-800 p-8 rounded-3xl max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-6" style={{ color: selectedFact.color }}>
                {React.createElement(FaIcons[selectedFact.icon])}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-teal-700">{selectedFact.text}</h3>
              <p className="text-gray-600 text-lg">{selectedFact.details}</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100 to-transparent rounded-bl-full opacity-50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



const DiseaseCalculator = ({ data }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    ...data.symptoms.reduce((acc, symptom) => ({ ...acc, [symptom.name]: false }), {}),
    ...data.lifestyle.reduce((acc, factor) => ({ ...acc, [factor.name]: 5 }), {}),
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePrompt = () => {
    const activeSymptoms = data.symptoms
      .filter(symptom => formData[symptom.name])
      .map(symptom => symptom.label);

    const lifestyleFactors = data.lifestyle.map(factor =>
      `${factor.label}: ${formData[factor.name]}`
    ).join(', ');

    return `Based on the following information, provide a health risk assessment and recommendations:
    Age: ${formData.age}
    Height: ${formData.height} cm
    Weight: ${formData.weight} kg
    Symptoms: ${activeSymptoms.join(', ') || 'None'}
    Lifestyle factors: ${lifestyleFactors}
    
    Please provide the results in the following JSON format:
    {
      "bmi": {"value": 0, "status": {"text": "", "color": ""}},
      "riskLevel": {"text": "", "color": ""},
      "lifestyleScore": 0,
      "recommendations": []
    }`;
  };

  const handleGeminiResult = (result) => {
    if (result && typeof result === 'object') {
      // Ensure all properties are in the expected format
      const formattedResult = {
        bmi: result.bmi || { value: 'N/A', status: { text: 'Unknown', color: 'gray' } },
        riskLevel: result.riskLevel || { text: 'Unknown', color: 'gray' },
        lifestyleScore: result.lifestyleScore || 'N/A',
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
      };
      setResults(formattedResult);
    } else {
      console.error('Invalid AI response:', result);
      setResults({
        error: "Failed to get valid AI suggestions. Please try again."
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicInfoStep formData={formData} handleInputChange={handleInputChange} data={data.basicInfo} />;
      case 1:
        return <SymptomsStep formData={formData} handleInputChange={handleInputChange} data={data.symptoms} />;
      case 2:
        return <LifestyleStep formData={formData} handleInputChange={handleInputChange} data={data.lifestyle} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-red-100 p-16 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">
            Comprehensive Risk Assessment
          </h1>

          {!results && (
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {data.steps.map((s, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col items-center ${
                      index <= step ? 'text-purple-600' : 'text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl mb-2">{React.createElement(FaIcons[s.icon])}</div>
                    <div className="text-sm font-medium">{s.title}</div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full">
                <motion.div
                  className="h-full bg-purple-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / (data.steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {!results ? renderStep() : <ResultsView results={results} />}
            </motion.div>
          </AnimatePresence>

          {!results && (
            <div className="mt-8 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold ${
                  step > 0 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}
                onClick={() => setStep(prev => Math.max(0, prev - 1))}
                disabled={step === 0}
              >
                Previous
              </motion.button>
              {step < data.steps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold"
                  onClick={() => setStep(prev => prev + 1)}
                >
                  Next
                </motion.button>
              ) : (
                <WGemini
                  prompt={generatePrompt()}
                  onResult={handleGeminiResult}
                />
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const BasicInfoStep = ({ formData, handleInputChange, data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((field, index) => (
      <InputField
        key={index}
        icon={React.createElement(FaIcons[field.icon], { className: `text-${field.color}` })}
        label={field.label}
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
      />
    ))}
  </div>
);

const SymptomsStep = ({ formData, handleInputChange, data }) => (
  <motion.div
    className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ staggerChildren: 0.1 }}
  >
    {data.map((symptom, index) => (
      <SymptomButton
        key={index}
        name={symptom.name}
        label={symptom.label}
        icon={React.createElement(FaIcons[symptom.icon], { className: "text-4xl mb-2", style: { color: symptom.color } })}
        checked={formData[symptom.name]}
        onChange={handleInputChange}
      />
    ))}
  </motion.div>
);

const LifestyleStep = ({ formData, handleInputChange, data }) => (
  <div className="space-y-6">
    {data.map((field, index) => (
      <SliderField
        key={index}
        icon={React.createElement(FaIcons[field.icon], { className: `text-${field.color}` })}
        label={field.label}
        name={field.name}
        value={formData[field.name]}
        onChange={handleInputChange}
      />
    ))}
  </div>
);

const InputField = ({ icon, label, name, value, onChange }) => (
  <motion.div
    className="bg-white p-4 rounded-xl shadow-md"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center mb-2">
      {icon}
      <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
    </div>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </motion.div>
);

const SymptomButton = ({ name, label, icon, checked, onChange }) => (
  <motion.button
    className={`bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 ${
      checked
        ? "transform scale-105"
        : "ring-transparent hover:ring-2 hover:ring-indigo-200"
    }`}
    whileHover={{
      scale: 1.05,
      boxShadow: "0 0 20px rgba(99,102,241,0.4)",
    }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
    style={{
      background: checked
        ? `linear-gradient(135deg, ${icon.props.style.color}40, white)`
        : "white",
    }}
  >
    {icon}
    <span className="text-center text-sm font-semibold text-gray-700">
      {label}
    </span>
  </motion.button>
);

const SliderField = ({ icon, label, name, value, onChange }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-md"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center mb-4">
      {icon}
      <label className="ml-2 text-sm font-medium text-gray-700">{label}</label>
    </div>
    <input
      type="range"
      name={name}
      min="0"
      max="10"
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <div className="flex justify-between mt-2 text-xs text-gray-500">
      <span>Low</span>
      <span>Medium</span>
      <span>High</span>
    </div>
  </motion.div>
);


const ResultsView = ({ results }) => {
  if (!results || results.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{results?.error || 'Unknown error occurred'}</p>
      </motion.div>
    );
  }

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      <motion.h2
        variants={cardVariants}
        className="text-3xl font-bold text-center text-purple-800 mb-8"
      >
        Your Assessment Results
      </motion.h2>

      <motion.div variants={cardVariants} className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold flex items-center text-purple-700 mb-4">
          <FaWeight className="mr-2" /> BMI
        </h3>
        <p className="text-4xl font-bold text-gray-800">{renderValue(results.bmi?.value) || 'N/A'}</p>
        <p className="text-lg text-gray-600 mt-2">{results.bmi?.status?.text || 'Unknown'}</p>
      </motion.div>

      <motion.div variants={cardVariants} className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold flex items-center text-purple-700 mb-4">
          <FaExclamationTriangle className="mr-2" /> Risk Level
        </h3>
        <p
          className="text-4xl font-bold"
          style={{ color: results.riskLevel?.color || 'inherit' }}
        >
          {results.riskLevel?.text || 'Unknown'}
        </p>
      </motion.div>

      <motion.div variants={cardVariants} className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold flex items-center text-purple-700 mb-4">
          <FaHeartbeat className="mr-2" /> Lifestyle Score
        </h3>
        <p className="text-4xl font-bold text-gray-800">{renderValue(results.lifestyleScore) ?? 'N/A'}</p>
      </motion.div>

      <motion.div variants={cardVariants} className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold flex items-center text-purple-700 mb-4">
          <FaListUl className="mr-2" /> Recommendations
        </h3>
        {Array.isArray(results.recommendations) && results.recommendations.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {results.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700"
              >
                {typeof rec === 'object' ? JSON.stringify(rec) : rec}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">No recommendations available.</p>
        )}
      </motion.div>
    </motion.div>
  );
};


const ResultCard = ({ title, value, status, icon }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg text-center"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="flex justify-center mb-4 text-4xl">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold mb-2">{value}</p>
    <p className={`text-sm font-medium ${status?.color ?? 'text-gray-500'}`}>{status?.text ?? 'Unknown'}</p>
  </motion.div>
);


const RecipeSuggestions = ({ data, Icon }) => {
  const [videoResults, setVideoResults] = useState({});

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      if (!data || !data.recipes) return;

      const API_KEY = 'AIzaSyCdeQS71SGmaB8U4Fu6nenkCOi6YIZ2jAY'; // Replace with your actual YouTube API key

      const fetchedVideos = {};
      for (const recipe of data.recipes) {
        try {
          const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(data.youtubeQuery + ' ' + recipe.name)}&type=video&key=${API_KEY}`
          );
          fetchedVideos[recipe.name] = response.data.items[0]?.id?.videoId;
        } catch (error) {
          console.error('Error fetching YouTube video:', error);
        }
      }
      setVideoResults(fetchedVideos);
    };

    fetchYouTubeVideos();
  }, [data]);

  if (!data || !data.recipes) {
    return null; // or return a loading indicator
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 px-4 bg-gradient-to-br from-gray-100 to-pink-100"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center text-purple-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {data.title}
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {data.recipes.map((recipe, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative pb-[56.25%] h-0">
                {videoResults[recipe.name] && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoResults[recipe.name]}`}
                    title={recipe.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  {Icon && <Icon className="text-2xl mr-2" />}
                  <h3 className="text-lg font-semibold">{recipe.name}</h3>
                </div>
                {videoResults[recipe.name] && (
                  <motion.a
                    href={`https://www.youtube.com/watch?v=${videoResults[recipe.name]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {Icon && <Icon name="FaPlay" className="mr-2" />} Watch Recipe
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};


const ResourcesAndSupport = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <FaIcons.FaQuestionCircle />, color: '#4A5568' },
    { name: 'Articles', icon: <FaIcons.FaBook />, color: '#38A169' },
    { name: 'Videos', icon: <FaIcons.FaVideo />, color: '#E53E3E' },
    { name: 'Podcasts', icon: <FaIcons.FaPodcast />, color: '#805AD5' }
  ];

  const filteredResources = activeCategory === 'All' 
    ? data 
    : data.filter(resource => resource.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-blue-50 to-yellow-50 min-h-screen"
    >
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Resources & Support</h2>

      <div className="flex justify-center mb-8">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            className={`mx-2 px-4 py-2 rounded-full flex items-center ${
              activeCategory === category.name 
                ? 'bg-white text-gray-800 shadow-md' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.name)}
          >
            <span className="mr-2" style={{ color: category.color }}>{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredResources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-white rounded-xl text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.03, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4" style={{ color: resource.color }}>
                {React.createElement(FaIcons[resource.icon])}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{resource.category}</p>
            </motion.a>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="mt-12 p-6 bg-white rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Need personalized support?</h3>
        <p className="text-gray-600 mb-4">
          Our team of specialists is here to help. Schedule a free consultation to discuss your unique needs and create a personalized support plan.
        </p>
        <motion.button
          className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Schedule Consultation
        </motion.button>
      </motion.div>
    </motion.div>
  );
};



const MythsAndFAQs = ({ data }) => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [selectedItem, setSelectedItem] = useState(null);

  // Check if data or data[activeTab] is undefined before accessing
  if (!data || !data[activeTab]) {
    return <div>Loading...</div>; // Handle loading state
  }

  const TabButton = ({ label, isActive, onClick }) => (
    <motion.button
      className={`px-6 py-3 rounded-full text-lg font-semibold transition-colors ${
        isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );

  const ItemCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-4" style={{ color: item.color }}>
            {React.createElement(FaIcons[item.icon])}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{item.question}</h3>
        </div>
        <motion.button
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedItem(item)}
        >
          Learn More
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-blue-100">
      <motion.h1
        className="text-5xl font-bold mb-12 text-center text-purple-800 tracking-wide"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data.title || "Debunking: Myths & Facts"}
      </motion.h1>

      <div className="flex justify-center space-x-4 mb-12">
        <TabButton
          label="FAQs"
          isActive={activeTab === 'faqs'}
          onClick={() => setActiveTab('faqs')}
        />
        <TabButton
          label="Myths"
          isActive={activeTab === 'myths'}
          onClick={() => setActiveTab('myths')}
        />
        <TabButton
          label="Facts"
          isActive={activeTab === 'facts'}
          onClick={() => setActiveTab('facts')}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data[activeTab].map((item, index) => (
            <ItemCard key={index} item={item} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-20"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 15 }}
              className="bg-white text-gray-800 p-8 rounded-3xl max-w-md shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-6" style={{ color: selectedItem.color }}>
                {React.createElement(FaIcons[selectedItem.icon])}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-700">
                {activeTab === 'myths' ? 'Myth Busted!' : 'FAQ'}
              </h3>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{selectedItem.question}</h4>
              <p className="text-gray-600 text-lg">{selectedItem.answer}</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-full opacity-50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};





export default WDisease;