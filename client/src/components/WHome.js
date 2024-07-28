import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, animate, AnimatePresence } from 'framer-motion';
import WNavbar from './WNavbar';
import WHero from './WHero';
import { Link } from 'react-router-dom';
import { FaPregnantWomen, FaHourglassHalf, FaPause, FaBrain, FaHeartbeat, FaFemale, FaBaby, FaAppleAlt, FaDna, FaMoon, FaSun, FaWalking, FaSwimmer, FaBiking, FaOilCan } from 'react-icons/fa';
import { GiMeditation, GiWeightLiftingUp, GiBodySwapping, GiMedicalThermometer, GiMedicines, GiNightSleep, GiDna1, GiFruitBowl, GiMilkCarton } from 'react-icons/gi';
import { IoIosNutrition, IoMdFlower } from 'react-icons/io';
import { MdPregnantWoman, MdOutlineMenuBook, MdWaterDrop, MdMood } from 'react-icons/md';
import { RiMentalHealthLine, RiHeartPulseLine, RiPlantLine } from 'react-icons/ri';
import { AiOutlineSchedule, AiFillFire, AiOutlineExperiment } from 'react-icons/ai';
import { TbSalad, TbDna } from 'react-icons/tb';
import { GiMoonOrbit } from 'react-icons/gi';





const HealthCategories = () => {
  const categories = [
    { icon: FaFemale, title: "Menstruation", color: "#FF69B4" },
    { icon: MdPregnantWoman, title: "Pregnancy", color: "#87CEEB" },
    { icon: IoMdFlower, title: "Menopause", color: "#DDA0DD" },
    { icon: RiMentalHealthLine, title: "PCOS", color: "#20B2AA" },
    { icon: RiHeartPulseLine, title: "Anemia", color: "#CD5C5C" },
    { icon: AiOutlineExperiment, title: "Breast Health", color: "#FF69B4" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-800">Featured Health Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="text-5xl mb-4"
                style={{ color: category.color }}
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                <category.icon />
              </motion.div>
              <h3 className="text-xl font-semibold text-center">{category.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const LifecyclePhase = ({ icon: Icon, color, label, to }) => {
  return (
    <Link to={to}>
      <motion.div
        className="flex flex-col items-center justify-center w-40 h-40 m-4 rounded-full shadow-lg cursor-pointer"
        whileHover={{ scale: 1.1, boxShadow: '0px 0px 8px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        style={{ backgroundColor: color }}
      >
        <Icon className="text-4xl text-white mb-2" />
        <span className="text-white font-semibold text-center">{label}</span>
      </motion.div>
    </Link>
  );
};

const WomenLifecycle = () => {
  const phases = [
    { icon: FaFemale, color: '#FF6B6B', label: 'Menstruation', to: '/women-segment/menstruation' },
    { icon: MdPregnantWoman, color: '#4ECDC4', label: 'Pregnancy', to: '/women-segment/pregnancy' },
    { icon: FaHourglassHalf, color: '#45B7D1', label: 'Perimenopause', to: '/women-segment/perimenopause' },
    { icon: GiMoonOrbit, color: '#7F63B8', label: 'Menopause', to: '/women-segment/menopause' },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Women's Lifecycle Phases
        </h2>
        <motion.div
          className="flex flex-wrap justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {phases.map((phase, index) => (
            <motion.div
              key={phase.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <LifecyclePhase {...phase} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


const HealthJourneyAndFacts = () => {
  const [mode, setMode] = useState('facts'); // 'journey' or 'facts'
  const [stage, setStage] = useState(0);
  const [character, setCharacter] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [healthScore, setHealthScore] = useState(100);
  const [activeFact, setActiveFact] = useState(null);

  const characters = [
    { name: "Sophia", age: 25, occupation: "Software Engineer" },
    { name: "Elena", age: 35, occupation: "Teacher" },
    { name: "Zara", age: 45, occupation: "Business Owner" },
  ];
  const stages = [
    {
      title: "Morning Routine",
      description: "It's 7 AM. How do you start your day?",
      options: [
        { text: "Skip breakfast and rush to work", impact: -10, icon: GiBodySwapping },
        { text: "Quick yoga and a balanced breakfast", impact: 10, icon: FaHeartbeat },
        { text: "Check emails in bed for an hour", impact: -5, icon: FaBrain },
      ],
    },
    {
      title: "Work Stress",
      description: "Deadlines are piling up. How do you cope?",
      options: [
        { text: "Work through lunch and stay late", impact: -15, icon: GiMedicalThermometer },
        { text: "Take short breaks and prioritize tasks", impact: 5, icon: MdMood },
        { text: "Delegate some work to colleagues", impact: 10, icon: FaBrain },
      ],
    },
    {
      title: "Evening Dilemma",
      description: "You're feeling exhausted. What's your evening plan?",
      options: [
        { text: "Order takeout and binge-watch TV", impact: -10, icon: GiMedicines },
        { text: "Cook a nutritious meal and read a book", impact: 15, icon: GiBodySwapping },
        { text: "Go out for drinks with friends", impact: -5, icon: MdMood },
      ],
    },
    {
      title: "Health Check",
      description: "You've been feeling off lately. What do you do?",
      options: [
        { text: "Ignore it and hope it goes away", impact: -20, icon: GiMedicalThermometer },
        { text: "Research symptoms online", impact: -5, icon: FaBrain },
        { text: "Schedule a check-up with your doctor", impact: 20, icon: FaHeartbeat },
      ],
    },
    {
      title: "Self-Care Sunday",
      description: "You have a free day. How do you spend it?",
      options: [
        { text: "Catch up on work", impact: -10, icon: GiMedicines },
        { text: "Spa day and meditation", impact: 15, icon: MdMood },
        { text: "Outdoor activities and nature", impact: 10, icon: GiBodySwapping },
      ],
    },
  ];

  const facts = [
    { 
      icon: GiMedicalThermometer, 
      title: "PMS Symptoms",
      fact: "75% of women experience PMS symptoms", 
      detail: "Premenstrual syndrome can cause mood swings, bloating, and fatigue. Lifestyle changes and certain medications can help manage symptoms."
    },
    { 
      icon: FaHeartbeat, 
      title: "PCOS",
      fact: "1 in 10 women have PCOS", 
      detail: "Polycystic Ovary Syndrome affects hormones and metabolism. Early diagnosis and treatment can prevent long-term complications."
    },
    { 
      icon: GiMedicines, 
      title: "Iron Deficiency",
      fact: "30% of women have iron-deficiency anemia", 
      detail: "Iron deficiency can cause fatigue and weakness. Dietary changes and supplements can help boost iron levels."
    },
    { 
      icon: MdMood, 
      title: "Postpartum Depression",
      fact: "20% of women experience postpartum depression", 
      detail: "Postpartum depression is a serious condition that can affect new mothers. Support and treatment are available and essential."
    },
  ];

  useEffect(() => {
    if (stage === stages.length) {
      // Journey complete, calculate final health impact
      const totalImpact = decisions.reduce((sum, decision) => sum + decision.impact, 0);
      setHealthScore(prev => Math.max(0, Math.min(100, prev + totalImpact)));
    }
  }, [stage, decisions]);

  const handleCharacterSelect = (selectedCharacter) => {
    setCharacter(selectedCharacter);
    setStage(1);
  };

  const handleDecision = (option) => {
    setDecisions([...decisions, option]);
    setStage(stage + 1);
    setHealthScore(prev => Math.max(0, Math.min(100, prev + option.impact)));
  };

  const renderCharacterSelection = () => (
    <div className="flex justify-center space-x-4">
      {characters.map((char, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCharacterSelect(char)}
        >
          <h3 className="text-xl font-bold">{char.name}</h3>
          <p>{char.age} years old</p>
          <p>{char.occupation}</p>
        </motion.div>
      ))}
    </div>
  );

  const renderStage = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{stages[stage - 1].title}</h2>
      <p className="mb-6">{stages[stage - 1].description}</p>
      <div className="space-y-4">
        {stages[stage - 1].options.map((option, index) => (
          <motion.button
            key={index}
            className="w-full bg-purple-100 p-4 rounded-lg flex items-center justify-between"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDecision(option)}
          >
            <span>{option.text}</span>
            <option.icon className="text-2xl" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Journey Complete!</h2>
      <p className="text-xl mb-4">
        {character.name}, your final health score is: {healthScore}
      </p>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Your Decisions:</h3>
        {decisions.map((decision, index) => (
          <p key={index} className={decision.impact > 0 ? "text-green-600" : "text-red-600"}>
            {decision.text} (Impact: {decision.impact})
          </p>
        ))}
      </div>
      <button
        className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold"
        onClick={() => {
          setStage(0);
          setCharacter(null);
          setDecisions([]);
          setHealthScore(100);
        }}
      >
        Start New Journey
      </button>
    </div>
  );

  const renderFactShowcase = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facts.map((fact, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveFact(activeFact === index ? null : index)}
        >
          <div className="flex items-center mb-4">
            <fact.icon className="text-3xl text-purple-600 mr-4" />
            <h3 className="text-xl font-bold">{fact.title}</h3>
          </div>
          <p className="font-semibold mb-2">{fact.fact}</p>
          <AnimatePresence>
            {activeFact === index && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-600"
              >
                {fact.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-center mb-12 text-purple-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Women's Health: Journey & Facts
        </motion.h1>
        
        <div className="flex justify-center mb-8">
        <button
            className={`mx-2 px-6 py-2 rounded-full font-bold ${mode === 'facts' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
            onClick={() => setMode('facts')}
          >
            Health Facts
          </button>
          <button
            className={`mx-2 px-6 py-2 rounded-full font-bold ${mode === 'journey' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
            onClick={() => setMode('journey')}
          >
            Interactive Journey
          </button>
         
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {mode === 'journey' && (
              <>
                {stage === 0 && renderCharacterSelection()}
                {stage > 0 && stage <= stages.length && renderStage()}
                {stage > stages.length && renderSummary()}
                {stage > 0 && stage <= stages.length && (
                  <div className="mt-8 text-center">
                    <p className="text-xl font-bold">Current Health Score: {healthScore}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{width: `${healthScore}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}
            {mode === 'facts' && renderFactShowcase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};


const LifeStageTimeline = () => {
  const [activeStage, setActiveStage] = useState(null);

  const stages = [
    { icon: FaFemale, title: "Adolescence", color: "#FF6B6B", description: "Crucial nutrients for growth and development" },
    { icon: IoMdFlower, title: "Reproductive Years", color: "#4ECDC4", description: "Balanced diet for hormonal health and fertility" },
    { icon: MdPregnantWoman, title: "Pregnancy", color: "#45B7D1", description: "Essential nutrients for fetal development" },
    { icon: FaBaby, title: "Postpartum", color: "#F9DB6D", description: "Recovery and breastfeeding nutrition" },
    { icon: RiMentalHealthLine, title: "Menopause", color: "#8A2BE2", description: "Diet to manage symptoms and maintain health" },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Women's Health Journey
      </motion.h1>

      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="absolute left-0 right-0 h-1 top-24 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full hidden lg:block" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start">
            {stages.map((stage, index) => (
              <div key={index} className="relative mb-12 lg:mb-0 w-full lg:w-1/5">
                <motion.div
                  className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer z-10 mx-auto
                              shadow-lg transition-all duration-300 ease-in-out
                              ${activeStage === index ? 'ring-4 ring-offset-4 ring-pink-500 scale-110' : ''}`}
                  style={{ backgroundColor: stage.color }}
                  onClick={() => setActiveStage(activeStage === index ? null : index)}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <stage.icon className="text-3xl text-white" />
                </motion.div>
                
                <motion.h3 
                  className="mt-5 font-semibold text-center text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {stage.title}
                </motion.h3>

                <AnimatePresence>
                  {activeStage === index && (
                    <motion.div
                      className="bg-white p-4 rounded-xl shadow-xl mt-4 mx-auto lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 w-full lg:w-64 z-20"
                      style={{ 
                        borderTop: `4px solid ${stage.color}`,
                        top: 'calc(100% + 1rem)',
                        left: "0%"
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-lg font-bold mb-2" style={{ color: stage.color }}>{stage.title}</h4>
                      <p className="text-sm text-gray-700">{stage.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-pink-500 mt-24 text-white px-8 py-3 rounded-full font-semibold shadow-lg text-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveStage(null)}
          >
            Reset Timeline
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};



const NutritionWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const wheelRef = useRef(null);
  const spinningRef = useRef(null);

  const foods = [
    { name: "Fruits", icon: FaAppleAlt, color: "#FF6B6B", benefits: "Rich in vitamins, fiber, and antioxidants. Boost immune system and support heart health.", tip: "Include a variety of colorful fruits in your diet for diverse nutrients." },
    { name: "Vegetables", icon: TbSalad, color: "#4ECDC4", benefits: "Packed with minerals and phytonutrients. Support digestive health and reduce inflammation.", tip: "Aim for at least 5 servings of vegetables daily, including leafy greens." },
    { name: "Proteins", icon: GiDna1, color: "#45B7D1", benefits: "Essential for muscle repair and hormone production. Support bone health and immune function.", tip: "Include lean meats, fish, eggs, and plant-based proteins like beans and nuts." },
    { name: "Grains", icon: IoIosNutrition, color: "#F9DB6D", benefits: "Provide energy and B vitamins. Support brain function and digestive health.", tip: "Choose whole grains over refined grains for more fiber and nutrients." },
    { name: "Dairy", icon: GiMilkCarton, color: "#8A2BE2", benefits: "Good source of calcium and vitamin D. Support bone health and muscle function.", tip: "If lactose intolerant, consider fortified plant-based alternatives." },
    { name: "Healthy Fats", icon: FaOilCan, color: "#FF9A8B", benefits: "Essential for hormone balance and nutrient absorption. Support brain and heart health.", tip: "Include sources like avocados, nuts, seeds, and olive oil in moderation." },
    { name: "Hydration", icon: MdWaterDrop, color: "#82C0CC", benefits: "Crucial for all bodily functions. Supports skin health and detoxification.", tip: "Aim for at least 8 glasses of water daily, more if physically active." },
    { name: "Superfoods", icon: GiFruitBowl, color: "#FFA62B", benefits: "Nutrient-dense foods with potential health-promoting properties.", tip: "Incorporate foods like berries, leafy greens, and fatty fish into your diet." },
  ];

  const handleSpin = () => {
    if (isSpinning) {
      if (spinningRef.current) {
        spinningRef.current.stop();
      }
      setIsSpinning(false);
      const currentRotation = rotation % 360;
      const snapAngle = Math.round(currentRotation / (360 / foods.length)) * (360 / foods.length);
      setRotation(snapAngle);
      const selectedIndex = (foods.length - Math.round(snapAngle / (360 / foods.length))) % foods.length;
      setSelectedFood(foods[selectedIndex]);
    } else {
      setIsSpinning(true);
      setSelectedFood(null);
      spinningRef.current = animate(wheelRef.current, 
        { rotate: rotation + 360 * 10 },
        { 
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          onUpdate: (latest) => {
            setRotation(latest);
          }
        }
      );
    }
  };

  const handleIconClick = (index) => {
    if (!isSpinning) {
      const targetRotation = 270 - (index * (360 / foods.length));
      setRotation(targetRotation);
      setSelectedFood(foods[index]);

      animate(wheelRef.current, { rotate: targetRotation }, {
        duration: 1,
        ease: "easeInOut",
      });
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto lg:flex lg:items-center lg:justify-between">
      <div className="lg:w-1/2">
        <motion.div 
          ref={wheelRef}
          className="w-96 h-96 mx-auto rounded-full border-4 border-gray-200 flex items-center justify-center relative"
          style={{ rotate: rotation }}
        >
          {foods.map((food, index) => (
            <motion.div
              key={index}
              className="absolute cursor-pointer"
              style={{
                transform: `rotate(${index * (360 / foods.length)}deg) translateX(150px) rotate(-${index * (360 / foods.length)}deg)`,
              }}
              onClick={() => handleIconClick(index)}
            >
              <IconBubble 
                Icon={food.icon} 
                color={food.color} 
                size={60} 
                animate={false} 
                isSelected={selectedFood && selectedFood.name === food.name}
              />
            </motion.div>
          ))}
          <motion.div
            className="absolute w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSpin}
          >
            <span className="text-white font-bold">{isSpinning ? "STOP" : "SPIN"}</span>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="lg:w-1/2 lg:pl-8">
        {selectedFood ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 lg:mt-0 p-6 bg-white rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <selectedFood.icon className="mr-2" style={{ color: selectedFood.color }} />
              {selectedFood.name}
            </h3>
            <p className="mb-4"><strong>Benefits:</strong> {selectedFood.benefits}</p>
            <p><strong>Tip for Women's Health:</strong> {selectedFood.tip}</p>
          </motion.div>
        ) : (
          <div className="mt-8 lg:mt-0 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Nutrition Wheel</h3>
            <p>Spin the wheel or click on an icon to learn about different food groups and their benefits for women's health.</p>
          </div>
        )}
      </div>
    </div>
  );
};



const WHome = () => {
  return (
    <div className="overflow-hidden bg-white">
      <WNavbar />
      <WHero />
      <WomenLifecycle />
      <HealthCategories />
      <HealthJourneyAndFacts />
      
      <section className="m-0">
        <LifeStageTimeline />
      </section>
      
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-4xl font-bold mb-10 text-center">Balanced Nutrition</h2>
        <NutritionWheel />
      </section>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Women's Wellness Journey</h3>
          <p className="mb-4">Empowering women to take control of their health at every stage of life.</p>
          <div className="flex justify-center space-x-6 mb-6">
            <IconBubble Icon={FaHeartbeat} color="#8B5D5D" size={32} />
            <IconBubble Icon={GiMeditation} color="#5D8B7D" size={32} />
            <IconBubble Icon={RiPlantLine} color="#5D7A8B" size={32} />
          </div>
          <p>&copy; 2024 Women's Wellness Journey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Updated IconBubble component
const IconBubble = ({ Icon, color, size, animate = false, isSelected }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2' : ''}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        boxShadow: isSelected ? `0 0 10px ${color}` : 'none'
      }}
    >
      <Icon className="text-white" style={{ fontSize: size * 0.5 }} />
    </div>
  );
};

export default WHome;