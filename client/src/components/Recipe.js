import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaHeart,
  FaClock,
  FaUtensils,
  FaFire,
  FaLeaf,
  FaCarrot,
  FaDrumstickBite,
  FaCheese,
  FaBreadSlice,
  FaEgg,
  FaFish,
  FaAppleAlt,
  FaLemon,
  FaPepperHot,
  FaCoffee,
  FaWineGlassAlt,
  FaCookieBite,
  FaBirthdayCake,
  FaPizzaSlice,
  FaHamburger,
  FaSeedling,
  FaBacon,
  FaIceCream,
  FaGlassWhiskey,
  FaMugHot,
  FaCandyCane,
  FaBookOpen,
  FaStar,
  FaUserFriends,
  FaAward,
  FaClipboardList,
  FaUsers,
  FaComments,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import {
  GiTomato,
  GiAvocado,
  GiChocolateBar,
  GiMushroomGills,
  GiPineapple,
  GiGrapes,
  GiPeach,
  GiStrawberry,
  GiNoodles,
  GiOrangeSlice,
  GiBroccoli,
  GiCookingGlove,
  GiSushis,
  GiTacos,
  GiCook,
  GiMeal,
  GiCupcake,
  GiHotSpices,
  GiFruitBowl,
  GiWineBottle,
  GiCookingPot,
  GiForkKnifeSpoon,
  GiCoolSpices,
  GiWaterBottle,
} from "react-icons/gi";

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const resultsPerPage = 20;

  const searchRecipes = async (page = 0) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.edamam.com/api/recipes/v2",
        {
          params: {
            type: "public",
            q: query,
            app_id: "920355eb",
            app_key: "58bb5edb4207bd41d0c13d14b6ab01d4",
            from: page * resultsPerPage,
            to: (page + 1) * resultsPerPage,
          },
        }
      );
      setRecipes(response.data.hits);
      setTotalResults(response.data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      searchRecipes();
    }
  }, [query]);

  const getIngredientIcon = (ingredient) => {
    const lowerIngredient = ingredient.toLowerCase();
    if (lowerIngredient.includes("chicken") || lowerIngredient.includes("beef"))
      return <FaDrumstickBite className="text-red-600" />;
    if (lowerIngredient.includes("cheese"))
      return <FaCheese className="text-yellow-400" />;
    if (lowerIngredient.includes("bread"))
      return <FaBreadSlice className="text-yellow-700" />;
    if (lowerIngredient.includes("egg"))
      return <FaEgg className="text-yellow-200" />;
    if (lowerIngredient.includes("fish"))
      return <FaFish className="text-blue-400" />;
    if (lowerIngredient.includes("apple"))
      return <FaAppleAlt className="text-red-500" />;
    if (lowerIngredient.includes("lemon"))
      return <FaLemon className="text-yellow-400" />;
    if (lowerIngredient.includes("pepper"))
      return <FaPepperHot className="text-red-500" />;
    if (lowerIngredient.includes("coffee"))
      return <FaCoffee className="text-brown-700" />;
    if (lowerIngredient.includes("wine"))
      return <FaWineGlassAlt className="text-purple-600" />;
    if (lowerIngredient.includes("cookie"))
      return <FaCookieBite className="text-yellow-800" />;
    if (lowerIngredient.includes("cake"))
      return <FaBirthdayCake className="text-pink-400" />;
    if (lowerIngredient.includes("pizza"))
      return <FaPizzaSlice className="text-red-500" />;
    if (lowerIngredient.includes("burger"))
      return <FaHamburger className="text-yellow-700" />;
    if (lowerIngredient.includes("salad"))
      return <FaSeedling className="text-green-500" />;
    if (lowerIngredient.includes("bacon"))
      return <FaBacon className="text-red-700" />;
    if (lowerIngredient.includes("ice cream"))
      return <FaIceCream className="text-blue-200" />;
    if (lowerIngredient.includes("whiskey"))
      return <FaGlassWhiskey className="text-amber-700" />;
    if (lowerIngredient.includes("tea"))
      return <FaMugHot className="text-green-700" />;
    if (lowerIngredient.includes("candy"))
      return <FaCandyCane className="text-red-500" />;
    if (lowerIngredient.includes("tomato"))
      return <GiTomato className="text-red-600" />;
    if (lowerIngredient.includes("avocado"))
      return <GiAvocado className="text-green-700" />;
    if (lowerIngredient.includes("chocolate"))
      return <GiChocolateBar className="text-brown-600" />;
    if (lowerIngredient.includes("noodle"))
      return <GiNoodles className="text-yellow-200" />;
    if (lowerIngredient.includes("sushi"))
      return <GiSushis className="text-green-700" />;
    if (lowerIngredient.includes("taco"))
      return <GiTacos className="text-yellow-600" />;
    return <FaCarrot className="text-orange-500" />;
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      className="bg-white rounded-xl h-[30rem] shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.label}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 rounded-bl-lg">
          <FaStar className="inline-block mr-1" />
          {(Math.random() * (5 - 3.5) + 3.5).toFixed(1)}
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 text-indigo-800 line-clamp-1">
          {recipe.label}
        </h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <FaClock className="text-indigo-500 mr-2" />
            <span>{recipe.totalTime} mins</span>
          </div>
          <div className="flex items-center">
            <FaUtensils className="text-green-500 mr-2" />
            <span>{recipe.yield} servings</span>
          </div>
          <div className="flex items-center">
            <FaFire className="text-red-500 mr-2" />
            <span>{Math.round(recipe.calories)} cal</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 h-6">
          {recipe.dietLabels.map((label, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full"
            >
              <FaLeaf className="inline-block mr-1 text-green-600" />
              {label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.ingredientLines.slice(0, 5).map((ingredient, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full flex items-center"
            >
              {getIngredientIcon(ingredient)}
              <span className="ml-1">{ingredient.split(" ")[0]}</span>
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition duration-300"
          >
            View Recipe
          </a>
          <button className="text-red-500 hover:text-red-700 transition duration-300">
            <FaHeart size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const FeaturedSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-[#f0f4f8] to-[#d1e3f6] text-gray-800 py-16 px-8 rounded-xl shadow-lg mb-12 overflow-hidden relative"
    >
      {/* ... (SVG pattern remains unchanged) ... */}

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Cooking Tips & Tricks
          </motion.span>
        </h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <GiCook className="text-4xl mr-4 text-indigo-500" />
            <div>
              <h3 className="text-lg font-semibold mb-1 text-indigo-700">
                Chef's Specials
              </h3>
              <p className="text-sm text-gray-600">
                Discover unique recipes from top chefs.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-4xl mr-4 text-green-500"
            >
              <GiMeal />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-green-700">
                Meal Planner
              </h3>
              <p className="text-sm text-gray-600">
                Plan your weekly meals with ease.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <FaUserFriends className="text-4xl mr-4 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold mb-1 text-blue-700">
                Community Favorites
              </h3>
              <p className="text-sm text-gray-600">
                Try the most loved community recipes.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-4xl mr-4 text-red-500"
            >
              <GiCookingPot />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-red-700">
                One-Pot Wonders
              </h3>
              <p className="text-sm text-gray-600">
                Delicious meals with minimal cleanup.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <GiCookingGlove className="text-4xl mr-4 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold mb-1 text-yellow-700">
                Cooking Techniques
              </h3>
              <p className="text-sm text-gray-600">
                Master essential cooking skills.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center bg-white bg-opacity-30 rounded-lg p-4 shadow-md"
            whileHover={{ scale: 1.03 }}
          >
            <GiFruitBowl className="text-4xl mr-4 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold mb-1 text-purple-700">
                Healthy Options
              </h3>
              <p className="text-sm text-gray-600">
                Nutritious and delicious recipes.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <GiCook className="text-8xl text-indigo-400 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Ready to cook something amazing?
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Search for a recipe or ingredient to get started!
      </p>
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <FaBookOpen className="text-4xl text-indigo-500 mx-auto mb-2" />
          <p className="text-gray-700">Browse Recipes</p>
        </div>
        <div className="text-center">
          <FaUtensils className="text-4xl text-indigo-500 mx-auto mb-2" />
          <p className="text-gray-700">Meal Ideas</p>
        </div>
        <div className="text-center">
          <FaLeaf className="text-4xl text-indigo-500 mx-auto mb-2" />
          <p className="text-gray-700">Dietary Options</p>
        </div>
      </div>
    </motion.div>
  );

  const PopularRecipes = () => (
    <section className="mb-16">
      <h2 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Popular this week
        </motion.span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Creamy Garlic Pasta",
            icon: <GiNoodles />,
            rating: 4.8,
            color: "#ff6b6b",
          },
          {
            name: "Spicy Chicken Tacos",
            icon: <GiTacos />,
            rating: 4.7,
            color: "#feca57",
          },
          {
            name: "Chocolate Lava Cake",
            icon: <GiCupcake />,
            rating: 4.9,
            color: "#48dbfb",
          },
        ].map((recipe) => (
          <motion.div
            key={recipe.name}
            className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: recipe.color }}
            />
            <motion.div
              className="text-6xl mb-4"
              style={{ color: recipe.color }}
              whileHover={{ rotate: [-1, 1, -1, 1, 0] }}
              transition={{ duration: 0.3 }}
            >
              {recipe.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < Math.floor(recipe.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } mr-1`}
                />
              ))}
              <span className="ml-2 font-semibold">{recipe.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const CookingTips = () => (
    <section className="mb-16">
      <h2 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Cooking Tips & Tricks
        </motion.span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            tip: "Perfect Your Knife Skills",
            icon: <GiForkKnifeSpoon />,
            color: "#54a0ff",
          },
          {
            tip: "Master the Art of Seasoning",
            icon: <GiHotSpices />,
            color: "#5f27cd",
          },
          {
            tip: "Meal Prep Like a Pro",
            icon: <FaClipboardList />,
            color: "#ff6b6b",
          },
          {
            tip: "Elevate Your Plating Game",
            icon: <GiFruitBowl />,
            color: "#ff9ff3",
          },
          {
            tip: "Understand Cooking Methods",
            icon: <GiCookingPot />,
            color: "#feca57",
          },
          {
            tip: "Learn to Pair Flavors",
            icon: <GiWineBottle />,
            color: "#48dbfb",
          },
        ].map((item) => (
          <motion.div
            key={item.tip}
            className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: item.color }}
            />
            <motion.div
              className="text-6xl mb-4"
              style={{ color: item.color }}
              whileHover={{ rotate: [-1, 1, -1, 1, 0] }}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
            </motion.div>
            <h3 className="text-xl font-semibold">{item.tip}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );

  const NutritionSection = () => (
    <section className="mb-16">
      <h2 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Nutrition Corner
        </motion.span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-blue-500" />
          <h3 className="text-2xl font-semibold mb-4">
            Balanced Diet Essentials
          </h3>
          <ul className="space-y-4">
            {[
              {
                icon: FaCarrot,
                text: "Fruits and Vegetables",
                color: "text-orange-500",
              },
              {
                icon: FaBreadSlice,
                text: "Whole Grains",
                color: "text-yellow-700",
              },
              { icon: FaFish, text: "Lean Proteins", color: "text-blue-500" },
              {
                icon: FaCheese,
                text: "Low-fat Dairy",
                color: "text-yellow-400",
              },
              {
                icon: GiWaterBottle,
                text: "Stay Hydrated",
                color: "text-blue-400",
              },
              {
                icon: GiAvocado,
                text: "Healthy Fats",
                color: "text-green-600",
              },
            ].map((item, index) => (
              <motion.li
                key={item.text}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`text-2xl ${item.color} mr-3`}
                  whileHover={{ rotate: [-5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon />
                </motion.div>
                <span className="text-gray-700">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-red-500" />
          <h3 className="text-2xl font-semibold mb-4">
            Nutrient Spotlight: Vitamin C
          </h3>
          <p className="mb-4 text-gray-600">
            Vitamin C is essential for immune function, skin health, and acts as
            a powerful antioxidant. Rich sources include:
          </p>
          <ul className="space-y-4">
            {[
              {
                icon: GiOrangeSlice,
                text: "Citrus Fruits",
                color: "text-orange-400",
              },
              { icon: GiTomato, text: "Tomatoes", color: "text-red-500" },
              {
                icon: FaPepperHot,
                text: "Bell Peppers",
                color: "text-green-500",
              },
              { icon: GiBroccoli, text: "Broccoli", color: "text-green-600" },
              { icon: FaLemon, text: "Kiwi", color: "text-yellow-400" },
            ].map((item, index) => (
              <motion.li
                key={item.text}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`text-2xl ${item.color} mr-3`}
                  whileHover={{ rotate: [-5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon />
                </motion.div>
                <span className="text-gray-700">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );

  const CommunitySection = () => (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Join Our Cooking Community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaUsers className="text-4xl mb-4 text-indigo-500" />
          <h3 className="text-xl font-semibold mb-2">Recipe Sharing</h3>
          <p>
            Share your favorite recipes and discover new ones from fellow food
            enthusiasts.
          </p>
        </motion.div>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaComments className="text-4xl mb-4 text-indigo-500" />
          <h3 className="text-xl font-semibold mb-2">Discussion Forums</h3>
          <p>
            Engage in lively discussions about cooking techniques, ingredients,
            and culinary trends.
          </p>
        </motion.div>
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <FaAward className="text-4xl mb-4 text-indigo-500" />
          <h3 className="text-xl font-semibold mb-2">Monthly Challenges</h3>
          <p>
            Participate in our monthly cooking challenges and showcase your
            culinary skills.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );


  const SeasonalIngredients = () => (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-24 px-4"
    >
      <h2 className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Seasonal Ingredients
        </motion.span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          {
            name: "Asparagus",
            icon: <GiCoolSpices className="text-green-500" />,
          },
          {
            name: "Strawberries",
            icon: <GiStrawberry className="text-red-500" />,
          },
          { name: "Rhubarb", icon: <GiFruitBowl className="text-pink-500" /> },
          { name: "Peas", icon: <FaCarrot className="text-green-400" /> },
          {
            name: "Artichokes",
            icon: <GiAvocado className="text-green-600" />,
          },
          { name: "Radishes", icon: <GiTomato className="text-red-600" /> },
          { name: "Fava Beans", icon: <FaLeaf className="text-green-500" /> },
          {
            name: "Morel Mushrooms",
            icon: <GiMushroomGills className="text-yellow-700" />,
          },
          {
            name: "Pineapple",
            icon: <GiPineapple className="text-yellow-400" />,
          },
          { name: "Grapes", icon: <GiGrapes className="text-purple-600" /> },
          {
            name: "Orange",
            icon: <GiOrangeSlice className="text-orange-500" />,
          },
          { name: "Peach", icon: <GiPeach className="text-orange-300" /> },
        ].map((ingredient, index) => (
          <motion.div
            key={ingredient.name}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-6 flex flex-col items-center">
              <motion.div
                className="text-6xl mb-4"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                {ingredient.icon}
              </motion.div>
              <h3 className="font-semibold text-lg text-gray-800">
                {ingredient.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );

  const SocialMediaSection = () => (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Follow Us</h2>
      <div className="flex justify-center space-x-8">
        {[
          {
            platform: "Instagram",
            icon: <FaInstagram />,
            color: "text-pink-500",
          },
          {
            platform: "Pinterest",
            icon: <FaPinterest />,
            color: "text-red-600",
          },
          { platform: "YouTube", icon: <FaYoutube />, color: "text-red-500" },
        ].map((social) => (
          <motion.a
            key={social.platform}
            href="#"
            className={`text-4xl ${social.color} hover:opacity-80 transition-opacity`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center mb-12 text-indigo-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Recipe Explorer
        </motion.h1>

        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes or ingredients..."
              className="w-full px-6 py-4 text-lg focus:outline-none"
            />
            <button
              onClick={searchRecipes}
              className="bg-indigo-600 text-white px-6 py-6 hover:bg-indigo-700 transition duration-300"
            >
              <FaSearch size={24} />
            </button>
          </div>
        </motion.div>

        {!query && (
          <>
            <FeaturedSection />
            <PopularRecipes />
            <CookingTips />
            <NutritionSection />
            <CommunitySection />
            <SeasonalIngredients />
            <SocialMediaSection />
          </>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-3xl text-gray-600 py-12"
          >
            Searching for delicious recipes...
          </motion.div>
        ) : recipes.length > 0 ? (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recipes.map((hit, index) => (
                <motion.div
                  key={hit.recipe.uri}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RecipeCard recipe={hit.recipe} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Recipe;
