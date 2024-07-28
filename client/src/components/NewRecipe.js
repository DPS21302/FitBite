import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaUtensils,
  FaClock,
  FaUserFriends,
  FaHeart,
  FaBookmark,
  FaShareAlt,
  FaChevronDown,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { GiCook, GiMeal, GiFruitBowl, GiCookingPot } from "react-icons/gi";
import {
  IoFastFood,
  IoNutrition,
  IoRestaurant,
  IoFitness,
} from "react-icons/io5";

const NewRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes");
  const [mealPlan, setMealPlan] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });
  const [nutritionGoals, setNutritionGoals] = useState({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 65,
  });

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = {
        type: "public",
        q: query,
        app_id: "920355eb",
        app_key: "58bb5edb4207bd41d0c13d14b6ab01d4",
      };

      if (diet) {
        params.diet = diet;
      }

      if (cuisineType) {
        params.cuisineType = cuisineType.toLowerCase().replace(/\s+/g, "-");
      }

      const response = await axios.get(
        "https://api.edamam.com/api/recipes/v2",
        { params }
      );
      setRecipes(response.data.hits);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      fetchRecipes();
    }
  }, [query, diet, cuisineType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleMealPlanChange = (day, meal, value) => {
    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [day]: { ...prevPlan[day], [meal]: value },
    }));
  };

  const handleNutritionGoalChange = (nutrient, value) => {
    setNutritionGoals((prevGoals) => ({
      ...prevGoals,
      [nutrient]: parseInt(value) || 0,
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold text-indigo-800 mb-4">
          <FaUtensils className="inline-block mr-4" />
          Gourmet Explorer
        </h1>
        <p className="text-2xl text-indigo-600">
          Discover culinary delights from around the world
        </p>
      </header>

      <nav className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 mb-12">
        <ul className="flex justify-around">
          {["Recipes", "Meal Planner", "Nutrition Guide", "Cooking Tips"].map(
            (item) => (
              <li
                key={item}
                className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.toLowerCase().replace(/\s+/g, "-")
                    ? "bg-indigo-500 text-white"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
                onClick={() =>
                  setActiveTab(item.toLowerCase().replace(/\s+/g, "-"))
                }
              >
                {item}
              </li>
            )
          )}
        </ul>
      </nav>

      {activeTab === "recipes" && (
        <>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row mb-6">
              <div className="relative flex-1 mb-4 md:mb-0 md:mr-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full p-4 pl-12 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 text-xl" />
              </div>
              <div className="relative mb-4 md:mb-0 md:mr-4">
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="appearance-none w-full p-4 pr-10 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Diets</option>
                  <option value="balanced">Balanced</option>
                  <option value="high-protein">High-Protein</option>
                  <option value="low-carb">Low-Carb</option>
                  <option value="low-fat">Low-Fat</option>
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
              </div>
              <div className="relative mb-4 md:mb-0 md:mr-4">
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="appearance-none w-full p-4 pr-10 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Cuisines</option>
                  <option value="American">American</option>
                  <option value="Asian">Asian</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
              </div>
              <button
                onClick={fetchRecipes}
                className="bg-indigo-500 text-white p-4 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
              >
                <FaFilter className="mr-2" /> Filter
              </button>
            </div>
          </div>

          <AnimatePresence>
            {loading ? (
              <motion.div
                className="flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
              </motion.div>
            ) : recipes.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {recipes.map((hit, index) => (
                  <motion.div
                    key={hit.recipe.uri}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={hit.recipe.image}
                      alt={hit.recipe.label}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
                        {hit.recipe.label}
                      </h2>
                      <div className="flex items-center mb-4">
                        <GiCook className="text-indigo-600 mr-2" />
                        <p className="text-indigo-600">
                          {hit.recipe.cuisineType.join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center mb-4">
                        <GiMeal className="text-indigo-600 mr-2" />
                        <p className="text-indigo-600">
                          {hit.recipe.dietLabels.join(", ") ||
                            "No specific diet"}
                        </p>
                      </div>
                      <div className="flex items-center mb-4">
                        <IoNutrition className="text-indigo-600 mr-2" />
                        <p className="text-indigo-600">
                          Calories: {Math.round(hit.recipe.calories)}
                        </p>
                      </div>
                      <div className="flex items-center mb-6">
                        <FaClock className="text-indigo-600 mr-2" />
                        <p className="text-indigo-600">
                          Time: {hit.recipe.totalTime} mins
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <a
                          href={hit.recipe.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                        >
                          <FaUtensils className="mr-2" /> View Recipe
                        </a>
                        <div className="flex space-x-4">
                          <button className="text-indigo-500 hover:text-red-500 transition-colors">
                            <FaHeart />
                          </button>
                          <button className="text-indigo-500 hover:text-blue-500 transition-colors">
                            <FaBookmark />
                          </button>
                          <button className="text-indigo-500 hover:text-green-500 transition-colors">
                            <FaShareAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GiFruitBowl className="text-8xl text-indigo-400 mx-auto mb-6" />
                <h2 className="text-3xl font-semibold text-indigo-600 mb-4">
                  No recipes found
                </h2>
                <p className="text-xl text-indigo-500">
                  Try searching for a dish or ingredient to discover amazing
                  recipes!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {activeTab === "meal-planner" && (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Meal Planner
          </h2>
          <p className="text-lg text-indigo-600 mb-8">
            Plan your meals for the week and stay on track with your nutrition
            goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {Object.entries(mealPlan).map(([day, meals]) => (
              <div key={day} className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4 capitalize">
                  {day}
                </h3>
                {Object.entries(meals).map(([meal, value]) => (
                  <div key={meal} className="mb-4">
                    <label className="block text-indigo-600 mb-2 capitalize">
                      {meal}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleMealPlanChange(day, meal, e.target.value)
                      }
                      className="w-full p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Add ${meal}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">
              Meal Ideas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">
                  Breakfast
                </h4>
                <ul className="list-disc list-inside text-indigo-600">
                  <li>Oatmeal with fruits and nuts</li>
                  <li>Greek yogurt parfait</li>
                  <li>Avocado toast with eggs</li>
                  <li>Smoothie bowl</li>
                </ul>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">
                  Lunch
                </h4>
                <ul className="list-disc list-inside text-indigo-600">
                  <li>Grilled chicken salad</li>
                  <li>Quinoa and vegetable bowl</li>
                  <li>Turkey and avocado wrap</li>
                  <li>Lentil soup with whole grain bread</li>
                </ul>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">
                  Dinner
                </h4>
                <ul className="list-disc list-inside text-indigo-600">
                  <li>Baked salmon with roasted vegetables</li>
                  <li>Stir-fry tofu with brown rice</li>
                  <li>Lean beef steak with sweet potato</li>
                  <li>Vegetable lasagna</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "nutrition-guide" && (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Nutrition Guide
          </h2>
          <p className="text-lg text-indigo-600 mb-8">
            Learn about nutrition basics and how to maintain a balanced diet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                Macronutrients
              </h3>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    Carbohydrates
                  </h4>
                  <p className="text-indigo-600">
                    Main source of energy for the body. Found in grains, fruits,
                    vegetables, and legumes.
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    Proteins
                  </h4>
                  <p className="text-indigo-600">
                    Essential for building and repairing tissues. Found in meat,
                    fish, eggs, dairy, and plant-based sources like beans and
                    nuts.
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    Fats
                  </h4>
                  <p className="text-indigo-600">
                    Important for hormone production and nutrient absorption.
                    Found in oils, nuts, seeds, and fatty fish.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
                Nutrition Goals
              </h3>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-600 mb-4">
                  Set Your Daily Goals
                </h4>
                <div className="space-y-4">
                  {Object.entries(nutritionGoals).map(([nutrient, value]) => (
                    <div key={nutrient} className="flex items-center">
                      <label className="w-1/3 text-indigo-600 capitalize">
                        {nutrient}:
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          handleNutritionGoalChange(nutrient, e.target.value)
                        }
                        className="w-2/3 p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-indigo-600">
                        {nutrient === "calories" ? "kcal" : "g"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
              Healthy Eating Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                  Balance Your Plate
                </h4>
                <p className="text-indigo-600">
                  Aim for a mix of vegetables, lean proteins, whole grains, and
                  healthy fats in each meal.
                </p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                  Stay Hydrated
                </h4>
                <p className="text-indigo-600">
                  Drink plenty of water throughout the day. Aim for 8 glasses or
                  more, depending on your activity level.
                </p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                  Mind Your Portions
                </h4>
                <p className="text-indigo-600">
                  Use smaller plates and be mindful of portion sizes to avoid
                  overeating.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cooking-tips" && (
        <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Cooking Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <IoFastFood className="text-3xl text-indigo-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  Meal Prep
                </h3>
                <p className="text-indigo-600">
                  Save time by prepping ingredients in advance. Cut vegetables,
                  measure spices, and organize your kitchen for efficient
                  cooking.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaUserFriends className="text-3xl text-indigo-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  Cook with Friends
                </h3>
                <p className="text-indigo-600">
                  Turn cooking into a social activity. Invite friends over for a
                  fun cooking session and enjoy the meal together.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <IoRestaurant className="text-3xl text-indigo-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  Plating Techniques
                </h3>
                <p className="text-indigo-600">
                  Learn basic plating techniques to make your dishes look as
                  good as they taste. Use contrasting colors and textures for
                  visual appeal.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <GiCookingPot className="text-3xl text-indigo-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  Master Basic Techniques
                </h3>
                <p className="text-indigo-600">
                  Focus on mastering basic cooking techniques like sautéing,
                  roasting, and braising. These skills will form the foundation
                  of your culinary expertise.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="max-w-4xl mx-auto text-center mt-12 text-indigo-600">
        <p>&copy; 2024 Gourmet Explorer. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default NewRecipe;
