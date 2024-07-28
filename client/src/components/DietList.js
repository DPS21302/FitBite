import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLeaf, FaCarrot, FaAppleAlt, FaDrumstickBite, FaFish,
  FaEgg, FaCheese, FaPizzaSlice, FaWineGlassAlt, FaBreadSlice,
  FaSeedling, FaGlassWhiskey
} from "react-icons/fa";
import { GiHeartBeats } from "react-icons/gi";

const diets = [
  { name: "Paleo", icon: FaLeaf, color: "#3B82F6", description: "Focuses on whole foods, lean proteins, and healthy fats." },
  { name: "Vegan", icon: FaCarrot, color: "#10B981", description: "Eliminates all animal products and emphasizes plant-based foods." },
  { name: "LowCarb", icon: FaAppleAlt, color: "#EF4444", description: "Limits carbohydrate intake to promote weight loss and health." },
  { name: "Dukan", icon: FaDrumstickBite, color: "#F59E0B", description: "High-protein, low-carb diet with specific eating phases." },
  { name: "UltraLowFat", icon: FaFish, color: "#8B5CF6", description: "Significantly restricts fat intake to improve heart health." },
  { name: "Atkins", icon: FaEgg, color: "#F97316", description: "Low-carb diet focusing on protein and fat to reduce weight." },
  { name: "UCG", icon: FaCheese, color: "#EC4899", description: "Focus on carbohydrate management for health and weight goals." },
  { name: "Zone", icon: FaPizzaSlice, color: "#6366F1", description: "Balances macronutrients to control hormones and inflammation." },
  { name: "IntermittentFasting", icon: FaWineGlassAlt, color: "#14B8A6", description: "Cycles between periods of fasting and eating." },
  { name: "Mediterranean", icon: FaBreadSlice, color: "#4B5563", description: "Emphasizes plant-based foods, healthy fats, and moderate protein intake." }
  // { name: "DASH", icon: FaSeedling, color: "#059669", description: "Designed to lower blood pressure through a balanced nutrient approach." },
  // { name: "Flexitarian", icon: FaGlassWhiskey, color: "#7C3AED", description: "Primarily vegetarian with occasional meat consumption." }
];

const DietWheel = () => {
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const controls = useAnimation();
  const wheelRef = useRef(null);

  useEffect(() => {
    controls.start({ rotate: wheelRotation, transition: { duration: 1, type: "spring" } });
  }, [wheelRotation, controls]);

  const handleDietClick = (diet, index) => {
    setSelectedDiet(diet);
    if (index !== -1) {
      setWheelRotation(-index * (360 / diets.length));
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('path/to/nutrition-bg.jpg')] bg-cover bg-center opacity-10"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-green-300 to-blue-300 opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["50%", "30%", "50%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-red-300 opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
          borderRadius: ["30%", "50%", "30%"],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      <motion.div
        ref={wheelRef}
        className="relative w-[80vw] h-[80vw] max-w-[600px] max-h-[600px]"
        animate={controls}
      >
        {/* Outer diet circles */}
        {diets.map((diet, index) => {
          const angle = (index / diets.length) * 360;
          const radius = 42; // percentage of wheel radius
          return (
            <motion.div
              key={diet.name}
              className="absolute w-20 h-20 -ml-10 -mt-10 flex items-center justify-center cursor-pointer"
              style={{
                top: `${50 + radius * Math.sin(angle * Math.PI / 180)}%`,
                left: `${50 + radius * Math.cos(angle * Math.PI / 180)}%`,
                transform: `rotate(${-wheelRotation}deg)`,
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              onClick={() => handleDietClick(diet, index)}
            >
              <motion.div 
                className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden"
                whileHover={{
                  boxShadow: "0px 0px 20px rgba(0,0,0,0.2)",
                }}
              >
                <diet.icon className="text-3xl" style={{ color: diet.color }} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="absolute top-1/2 left-1/2 w-32 h-32 -ml-16 -mt-16 flex items-center justify-center cursor-pointer">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-pink-600 shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          onClick={() =>
            handleDietClick(
              {
                name: 'BalancedDiet',
                description:
                  'A well-rounded diet incorporating elements from various dietary approaches.',
              },
              -1
            )
          }
        >
          <GiHeartBeats className="text-5xl text-white" />
        </motion.div>
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full rounded-full border-2 border-red-400"
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Diet details modal */}
      <AnimatePresence>
        {selectedDiet && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md m-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{selectedDiet.name}</h2>
              <p className="mb-6 text-gray-600">{selectedDiet.description}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/diets/${selectedDiet.name.toLowerCase()}`}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full inline-block transition-all hover:bg-indigo-700 hover:shadow-lg"
                >
                  Learn More
                </Link>
                <button
                  onClick={() => setSelectedDiet(null)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NutritionHarmonyWheel = () => {
  return (
    <div className="min-h-screen  overflow-hidden">
      <motion.h1
        className="text-6xl font-extrabold pt-16 mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Diet Wheel
      </motion.h1>
      <motion.p
        className="text-xl text-center text-gray-600 mb-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore different diets tailored to various health needs and lifestyles
      </motion.p>

      <DietWheel />
    </div>
  );
};

export default NutritionHarmonyWheel;
