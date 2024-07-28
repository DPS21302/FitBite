import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  FaSearch,
  FaUtensils,
  FaSpinner,
  FaInfoCircle,
  FaClock,
  FaUsers,
  FaListUl,
  FaHeart,
  FaBookOpen,
  FaCarrot,
  FaPepperHot,
  FaLeaf,
  FaGlassWhiskey,
  FaCocktail,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = "aizoaVtBC7EuOV56MRV43Q==4rXDHhdPJP6aYlLy";

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [tip, setTip] = useState("");

  useEffect(() => {
    fetchFeaturedRecipe();
    setRandomTip();
  }, []);

  const fetchFeaturedRecipe = async () => {
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/recipe?query=popular`,
        {
          headers: { "X-Api-Key": API_KEY },
        }
      );
      setFeaturedRecipe(response.data[0]);
    } catch (error) {
      console.error("Error fetching featured recipe:", error);
    }
  };

  const setRandomTip = () => {
    const tips = [
      "Always read the recipe thoroughly before starting.",
      "Prep all ingredients before you begin cooking.",
      "Invest in a good set of kitchen knives.",
      "Don't be afraid to experiment with spices.",
      "Learn to balance flavors: sweet, sour, salty, bitter, and umami.",
    ];
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const fetchRecipes = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/recipe?query=${query}`,
        {
          headers: { "X-Api-Key": API_KEY },
        }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    query: Yup.string().required("Please enter a search term"),
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-5xl font-bold text-center text-indigo-800 mb-6">
            <FaUtensils className="inline-block mr-2" /> Recipe Explorer
          </h1>

          {/* Featured Recipe Section */}
          {featuredRecipe && (
            <motion.div
              className="mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-orange-800">
                <FaHeart className="inline-block mr-2" /> Featured Recipe
              </h2>
              <h3 className="text-xl font-semibold text-orange-700">
                {featuredRecipe.title}
              </h3>
              <p className="mt-2 text-orange-600">
                <FaUsers className="inline-block mr-2" /> Servings:{" "}
                {featuredRecipe.servings}
              </p>
              <button
                onClick={() => setSelectedRecipe(featuredRecipe)}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300"
              >
                View Recipe
              </button>
            </motion.div>
          )}

          {/* Search Form */}
          <Formik
            initialValues={{ query: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => fetchRecipes(values.query)}
          >
            {({ isSubmitting }) => (
              <Form className="mb-8">
                <div className="flex items-center border-b-2 border-indigo-500 py-2">
                  <Field
                    name="query"
                    type="text"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    placeholder="Search for recipes..."
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <FaSpinner className="inline-block mr-2 animate-spin" />
                    ) : (
                      <FaSearch className="inline-block mr-2" />
                    )}
                    {isSubmitting ? "Searching..." : "Search"}
                  </motion.button>
                </div>
                <ErrorMessage
                  name="query"
                  component="div"
                  className="text-red-500 text-xs italic mt-2"
                />
              </Form>
            )}
          </Formik>

          {/* Loading Spinner */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="flex items-center justify-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FaSpinner className="animate-spin text-indigo-500 text-6xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recipe Grid */}
          <AnimatePresence>
            {!loading && recipes.length > 0 && !selectedRecipe && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-md overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2 text-indigo-800">
                        {recipe.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <FaUsers className="mr-2" /> Servings: {recipe.servings}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <FaListUl className="mr-2" /> Ingredients:{" "}
                        {recipe.ingredients.split("|").length}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-600 font-semibold">
                          View Recipe
                        </span>
                        <FaCarrot className="text-orange-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selected Recipe View */}
          <AnimatePresence>
            {selectedRecipe && (
              <motion.div
                className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="p-6">
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    ← Back to results
                  </button>
                  <h2 className="text-3xl font-bold mb-4 text-indigo-800">
                    {selectedRecipe.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaUsers className="mr-2" /> Servings:{" "}
                      {selectedRecipe.servings}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaClock className="mr-2" /> Prep Time: Approx. 30 mins
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaPepperHot className="mr-2" /> Difficulty: Medium
                    </p>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 flex items-center">
                    <FaListUl className="mr-2" /> Ingredients:
                  </h3>
                  <ul className="list-disc list-inside mb-4 grid grid-cols-2 gap-2">
                    {selectedRecipe.ingredients
                      .split("|")
                      .map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-gray-700 flex items-center"
                        >
                          <FaCarrot className="mr-2 text-orange-500" />
                          {ingredient.trim()}
                        </li>
                      ))}
                  </ul>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700 flex items-center">
                    <FaBookOpen className="mr-2" /> Instructions:
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedRecipe.instructions
                      .split("\n")
                      .map((step, index) => (
                        <li key={index} className="text-gray-700">
                          {step.trim()}
                        </li>
                      ))}
                  </ol>
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" /> Chef's Tip
                    </h4>
                    <p className="text-yellow-700">{tip}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!loading && recipes.length === 0 && !selectedRecipe && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaUtensils className="text-6xl text-indigo-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-indigo-800 mb-2">
                Ready to cook something amazing?
              </h2>
              <p className="text-gray-600 mb-4">
                Search for a recipe to get started on your culinary journey!
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <FaCarrot className="text-3xl text-orange-500 mb-2" />
                  <span className="text-sm text-gray-600">
                    Fresh Ingredients
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <FaLeaf className="text-3xl text-green-500 mb-2" />
                  <span className="text-sm text-gray-600">Healthy Options</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaGlassWhiskey className="text-3xl text-yellow-500 mb-2" />
                  <span className="text-sm text-gray-600">
                    Delicious Drinks
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeSearch;
