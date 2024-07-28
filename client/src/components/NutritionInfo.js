import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaAppleAlt,
  FaCarrot,
  FaBreadSlice,
  FaHamburger,
  FaPizzaSlice,
  FaEgg,
  FaWeight,
  FaChartPie,
  FaRunning,
  FaBed,
  FaGlassCheers,
} from "react-icons/fa";
import {
  GiMeat,
  GiFruitBowl,
  GiWaterBottle,
  GiCookingPot,
  GiMuscleUp,
} from "react-icons/gi";
import { IoNutrition, IoFastFood, IoRestaurant } from "react-icons/io5";
import { MdLocalDining, MdOutlineHealthAndSafety } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import toast from "react-hot-toast";

const NutritionInfo = () => {
  const [query, setQuery] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchNutritionData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
        {
          headers: { "X-Api-Key": "aizoaVtBC7EuOV56MRV43Q==x69x1glaSbTjXSuD" },
        }
      );
      setNutritionData(response.data.items);
      console.log(response.data.items);
      setError(null);
    } catch (err) {
      setError("Failed to fetch nutrition data");
      toast.error("Error fetching nutrition data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNutritionData();
  };

  const chartData =
    nutritionData && nutritionData[0]
      ? {
          labels: ["Protein", "Carbs", "Fat"],
          datasets: [
            {
              data: [
                nutritionData[0].protein_g,
                nutritionData[0].carbohydrates_total_g,
                nutritionData[0].fat_total_g,
              ],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        }
      : null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <h1 className="text-5xl font-bold mb-6 text-center flex items-center justify-center">
              <IoNutrition className="mr-4" /> Nutrition Information
            </h1>
            <p className="mb-8 text-xl text-center">
              Get detailed nutrition facts for any food item.
            </p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-4 pr-12 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                  placeholder="Enter food items (e.g., 2 slices of pizza and 1 burger)"
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSearch className="text-2xl" />
                </motion.button>
              </div>
            </form>
          </div>

          <AnimatePresence>
            {loading ? (
              <motion.div
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
                />
              </motion.div>
            ) : nutritionData && nutritionData[0] ? (
              <motion.div
                className="p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-center">
                  {nutritionData[0].name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="w-full h-64">
                    <Doughnut
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <NutritionItem
                      icon={<GiWaterBottle />}
                      label="Serving Size"
                      value={`${nutritionData[0].serving_size_g} g`}
                    />
                    <NutritionItem
                      icon={<FaWeight />}
                      label="Calories"
                      value={`${nutritionData[0].calories} kcal`}
                    />
                    <NutritionItem
                      icon={<GiMeat />}
                      label="Protein"
                      value={`${nutritionData[0].protein_g}g`}
                    />
                    <NutritionItem
                      icon={<FaBreadSlice />}
                      label="Carbs"
                      value={`${nutritionData[0].carbohydrates_total_g}g`}
                    />
                    <NutritionItem
                      icon={<GiWaterBottle />}
                      label="Fat"
                      value={`${nutritionData[0].fat_total_g}g`}
                    />
                    <NutritionItem
                      icon={<GiWaterBottle />}
                      label="Pottasium"
                      value={`${nutritionData[0].potassium_mg}mg`}
                    />
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-6 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showDetails ? "Hide Details" : "Show More Details"}
                </motion.button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      <NutritionItem
                        icon={<FaAppleAlt />}
                        label="Sugar"
                        value={`${nutritionData[0].sugar_g}g`}
                      />
                      <NutritionItem
                        icon={<IoRestaurant />}
                        label="Sodium"
                        value={`${nutritionData[0].sodium_mg}mg`}
                      />
                      <NutritionItem
                        icon={<FaCarrot />}
                        label="Fiber"
                        value={`${nutritionData[0].fiber_g}g`}
                      />
                      <NutritionItem
                        icon={<FaChartPie />}
                        label="Cholesterol"
                        value={`${nutritionData[0].cholesterol_mg}mg`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FaAppleAlt className="text-6xl text-blue-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">
                  Enter a food item to see nutrition information
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    FaAppleAlt,
                    FaCarrot,
                    FaBreadSlice,
                    FaHamburger,
                    FaPizzaSlice,
                    FaEgg,
                  ].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="text-4xl text-indigo-400"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Nutritional Balance
            </h2>
            <div className="w-full h-64 mb-8">
              <Bar
                data={{
                  labels: ["Proteins", "Carbs", "Fats", "Vitamins", "Minerals"],
                  datasets: [
                    {
                      label: "Recommended Daily Intake",
                      data: [20, 50, 30, 100, 100],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: "Percentage of Daily Intake",
                      },
                    },
                  },
                }}
              />
            </div>
            <p className="text-center text-gray-600">
              A balanced diet should include a variety of nutrients in the right
              proportions.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Health Factors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HealthFactor
                icon={<FaRunning />}
                title="Physical Activity"
                description="Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous aerobic activity a week."
              />
              <HealthFactor
                icon={<RiMentalHealthLine />}
                title="Mental Wellbeing"
                description="Practice stress-management techniques like meditation, deep breathing, or yoga."
              />
              <HealthFactor
                icon={<FaBed />}
                title="Quality Sleep"
                description="Strive for 7-9 hours of quality sleep each night to support overall health."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const NutritionItem = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-md"
    whileHover={{ scale: 1.05 }}
  >
    <span className="text-blue-500 text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </motion.div>
);

const HealthFactor = ({ icon, title, description }) => (
  <motion.div
    className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-lg shadow-lg"
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-4xl text-indigo-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default NutritionInfo;
