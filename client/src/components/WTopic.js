import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as GrIcons from "react-icons/gr"
import WomenData from "../data/Womendata.json";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import WGemini from "./WGemini";


const WTopic = () => {
  const { topic } = useParams();

  const [topicData, setTopicData] = useState(null);


  const Icon = ({ name, ...props }) => {
    const IconComponent =
      FaIcons[name] || GiIcons[name] || RiIcons[name] || MdIcons[name];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  useEffect(() => {
    // Fetch diet data based on dietId
    const selectedTopic = WomenData[topic];
    if (selectedTopic) {
      setTopicData(selectedTopic);
    }
  }, [topic]);

  if (!topicData) {
    return <div>Loading...</div>;
  }

  const data = topicData;
  return (
    <div className="relative min-h-screen">
      <main>
        <CycleInfo data={data.cycleInfo} Icon={Icon} />
        <SymptomTracker data={data.symptomTracker} Icon={Icon} />
        <SelfCare data={data} Icon={Icon} />
        <RecipeSuggestions data={data.recipeData} Icon={Icon} />
        <FAQ data={data.faq} Icon={Icon} />
        <Myths data={data.myths} Icon={Icon} />
      </main>

      <EmergencyButton Icon={Icon} />
    </div>
  );
};

const CycleInfo = ({ data, Icon }) => {
  const [activePhase, setActivePhase] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-16">
      <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 p-2">
        {data.title}
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-gray-100 p-6">
            {data.phases.map((phase, index) => (
              <div key={index} className="mb-4">
                <button
                  className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
                    activePhase === index && activeSection === 'overview'
                      ? "bg-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setActivePhase(index);
                    setActiveSection('overview');
                  }}
                >
                  <div className="flex items-center">
                    <Icon
                      name={phase.icon}
                      className="text-2xl mr-3"
                      style={{ color: phase.color }}
                    />
                    <span className="font-semibold">{phase.name}</span>
                  </div>
                </button>
                <button
                  className={`w-full text-left p-4 rounded-lg mb-2 transition-all ${
                    activePhase === index && activeSection === 'diet'
                      ? "bg-white shadow-md"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setActivePhase(index);
                    setActiveSection('diet');
                  }}
                >
                  <div className="flex items-center">
                    <Icon
                      name="FaUtensils"
                      className="text-2xl mr-3"
                      style={{ color: phase.color }}
                    />
                    <span className="font-semibold">{phase.name} Diet</span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="w-full md:w-2/3 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activePhase}-${activeSection}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'overview' ? (
                  // Existing overview content
                  <>
                    <h2
                      className="text-3xl font-bold mb-4"
                      style={{ color: data.phases[activePhase].color }}
                    >
                      {data.phases[activePhase].name} Phase
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Duration: {data.phases[activePhase].duration}
                    </p>
                    <p className="text-gray-800 mb-6">
                      {data.phases[activePhase].description}
                    </p>

                    <h3 className="text-xl font-semibold mb-3">General Tips:</h3>
                    <ul className="space-y-2 mb-6">
                      {data.phases[activePhase].tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center"
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{
                              backgroundColor: data.phases[activePhase].color,
                            }}
                          ></div>
                          {tip}
                        </motion.li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <Icon
                        name="FaAppleAlt"
                        className="mr-2"
                        style={{ color: data.phases[activePhase].color }}
                      />
                      Dietary Recommendations:
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {data.phases[activePhase].dietTips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center"
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{
                              backgroundColor: data.phases[activePhase].color,
                            }}
                          ></div>
                          {tip}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Health Focus:</h4>
                      <p>{data.phases[activePhase].healthFocus}</p>
                    </div>
                  </>
                ) : (
                  // New diet content
                  <>
                    <h2
                      className="text-3xl font-bold mb-4"
                      style={{ color: data.phases[activePhase].color }}
                    >
                      {data.phases[activePhase].name} Phase Diet
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold mb-3 flex items-center text-green-600">
      <Icon name="FaCheckCircle" className="mr-2" />
      Foods to Eat
    </h3>
    <ul className="space-y-2">
      {data.phases[activePhase].foodsToEat.map((food, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: food.iconBg }}>
            <Icon name={food.icon} className="text-white" />
          </div>
          <div>
            <span className="font-semibold">{food.name}</span>
            <p className="text-sm text-gray-600">{food.reason}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  </div>

  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold mb-3 flex items-center text-red-600">
      <Icon name="FaTimesCircle" className="mr-2" />
      Foods to Avoid
    </h3>
    <ul className="space-y-2">
      {data.phases[activePhase].foodsToAvoid.map((food, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: food.iconBg }}>
            <Icon name={food.icon} className="text-white" />
          </div>
          <div>
            <span className="font-semibold">{food.name}</span>
            <p className="text-sm text-gray-600">{food.reason}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  </div>
</div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};




const SymptomTracker = ({ data, Icon }) => {
  const [symptoms, setSymptoms] = useState({});
  const [currentDate] = useState(new Date());
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleSymptomToggle = (symptomName) => {
    setSymptoms(prevSymptoms => ({
      ...prevSymptoms,
      [symptomName]: !prevSymptoms[symptomName]
    }));
  };

  const getPrompt = () => {
    const activeSymptoms = Object.keys(symptoms).filter(sym => symptoms[sym]);
    return data.promptTemplate.replace('{symptoms}', activeSymptoms.join(', '));
  };

  const handleGeminiResult = (result) => {
    setAiSuggestions(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"
    >
      <motion.div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center text-indigo-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {data.title}
        </motion.h2>

        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-600">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {data.symptoms.map((symptom, index) => (
            <motion.button
              key={index}
              className={`bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 ${
                symptoms[symptom.name]
                  ? "transform scale-105"
                  : "ring-transparent hover:ring-2 hover:ring-indigo-200"
              }`}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSymptomToggle(symptom.name)}
              style={{
                background: symptoms[symptom.name]
                  ? `linear-gradient(135deg, ${symptom.color}40, white)`
                  : "white",
              }}
            >
              <Icon
                name={symptom.icon}
                className="text-4xl mb-2"
                style={{ color: symptom.color }}
              />
              <span className="text-center text-sm font-semibold text-gray-700">
                {symptom.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <WGemini prompt={getPrompt()} onResult={handleGeminiResult} />


<AnimatePresence>
  {aiSuggestions && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl relative overflow-hidden mt-8"
    >
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-900">
          AI-Generated Self-Care Suggestions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(aiSuggestions).map(([category, tips], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h4 className="font-bold text-xl mb-3 text-blue-800 ">
                {category.split(/(?=[A-Z])/).map((word, i) => (
                  <span key={i}>
                    {word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()}
                    {i !== category.split(/(?=[A-Z])/).length - 1 && ' '}
                  </span>
                ))}
              </h4>
              <ul className="list-none">
                {tips.map((tip, tipIndex) => (
                  <motion.li
                    key={tipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tipIndex * 0.05 }}
                    className="text-sm text-gray-700 mb-2 flex items-start"
                  >
                    <span className="text-indigo-400 mr-2">•</span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </motion.div>
    </motion.div>
  );
};



const SelfCare = ({ data, Icon }) => {
  const [activeCategory, setActiveCategory] = useState('selfCare');
  const [activeTip, setActiveTip] = useState(0);
  const [cycleDay, setCycleDay] = useState(1);
  const [mood, setMood] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const categories = [
    { id: 'selfCare', name: 'Self Care', color: 'text-green-600' },
    { id: 'nutrition', name: 'Nutrition', color: 'text-orange-600' },
    { id: 'exerciseRest', name: 'Exercise & Rest', color: 'text-blue-600' },
    // { id: 'cycleTracker', name: 'Cycle Tracker', color: 'text-purple-600' },
  ];

  const renderTips = () => {
    const tips = data[activeCategory].tips;
    
    return (
      <motion.div
        className="flex flex-wrap justify-center items-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            className="cursor-pointer w-32"
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveTip(activeTip === index ? null : index)}
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto"
                style={{ backgroundColor: tip.color }}
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 2 + index * 0.2,
                    ease: "easeInOut",
                  },
                }}
              >
                <Icon name={tip.icon} className="text-4xl text-white" />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1"
                initial={{ height: 0 }}
                animate={{ height: activeTip === index ? 100 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center mt-2 font-medium text-sm break-words">{tip.name || tip.tip}</p>
          </motion.div>
        ))}
      </motion.div>
    );
  };

 

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center text-green-800">
          {data[activeCategory].title}
        </h2>
        <div className="flex justify-center mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`mx-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                activeCategory === category.id
                  ? `bg-green-100 ${category.color}`
                  : `bg-white ${category.color} hover:bg-${category.color} hover:bg-opacity-20`
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveTip(0);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
        <div className="relative">
          {activeCategory === 'cycleTracker' ? renderTips() : renderTips()}
          <AnimatePresence>
            {activeTip !== null && activeCategory !== 'cycleTracker' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="mt-8 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"
              >
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Icon
                    name={data[activeCategory].tips[activeTip].icon}
                    className="mr-2"
                    style={{ color: data[activeCategory].tips[activeTip].color }}
                  />
                  {data[activeCategory].tips[activeTip].name || data[activeCategory].tips[activeTip].tip}
                </h3>
                <p>{data[activeCategory].tips[activeTip].description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};




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
      className="py-12 px-4 bg-gradient-to-br from-pink-100 to-purple-100"
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

const FAQ = ({ data, Icon }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  return (
    <section className=" bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
        {data.title}
      </h2>
      <div className="space-y-6">
        {data.questions.map((q, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() =>
              setExpandedQuestion(expandedQuestion === index ? null : index)
            }
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center">
                <Icon name={q.icon} className={`${q.color} mr-3`} />
                {q.question}
              </h3>
              <motion.div
                animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon name="FaChevronDown" className="text-purple-500" />
              </motion.div>
            </div>
            <AnimatePresence>
              {expandedQuestion === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mt-4 text-gray-700">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Myths = ({ data, Icon }) => {
  const [expandedMyth, setExpandedMyth] = useState(null);

  return (
    <section className=" bg-gradient-to-r from-pink-100 to-red-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-red-800">
        {data.title}
      </h2>
      <div className="space-y-6">
        {data.mythList.map((myth, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() =>
              setExpandedMyth(expandedMyth === index ? null : index)
            }
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center">
                <Icon name={myth.icon} className={`${myth.color} mr-3`} />
                {myth.title}
              </h3>
              <motion.div
                animate={{ rotate: expandedMyth === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon name="FaChevronDown" className="text-purple-500" />
              </motion.div>
            </div>
            <AnimatePresence>
              {expandedMyth === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mt-4 text-gray-700">{myth.content}</p>
                  <div className="mt-4 flex items-center text-green-600">
                    <Icon name="FaCheckCircle" className="mr-2" />
                    <span className="font-semibold">Fact:</span>
                    <span className="ml-2">The truth behind the myth.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};




const EmergencyButton = ({ Icon }) => (
  <motion.button
    className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-full shadow-lg"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    animate={{
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity },
    }}
    onClick={() => window.open("tel:911")}
  >
    <Icon name="MdLocalHospital" className="text-2xl" />
  </motion.button>
);

export default WTopic;