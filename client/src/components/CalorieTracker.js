import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaChartBar,
  FaUserCircle,
  FaAppleAlt,
  FaRunning,
  FaBrain,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaFireAlt,
  FaHeart,
  FaLeaf,
  FaSun,
  FaMoon,
  FaUtensils,
  FaClock,
  FaDumbbell,
} from "react-icons/fa";
import { GiWeightScale, GiMuscleUp, GiWaterBottle } from "react-icons/gi";
import { IoMdFitness } from "react-icons/io";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const BMRCalculatorSchema = Yup.object().shape({
  age: Yup.number()
    .min(1, "Age must be greater than zero")
    .required("Age is required"),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Invalid gender"),
  weight: Yup.number()
    .min(1, "Weight must be greater than zero")
    .required("Weight is required"),
  height: Yup.number()
    .min(1, "Height must be greater than zero")
    .required("Height is required"),
  activityLevel: Yup.string().required("Activity level is required"),
});

const CustomFoodSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  calories: Yup.number()
    .min(0, "Calories must be non-negative")
    .required("Calories are required"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
});

const CalorieTracker = () => {
  const [bmr, setBMR] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [mealEntries, setMealEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateEntries, setDateEntries] = useState({});
  const [activityLevel, setActivityLevel] = useState("moderate");

  const user = useSelector((state) => state.auth.user);
  const firebaseUid = user.uid;

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
  });

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      const response = await api.get(
        `/calorie-tracker/meals/${
          selectedDate.toISOString().split("T")[0]
        }?firebaseUid=${firebaseUid}`
      );
      setMealEntries(response.data);
      const totalCalories = response.data.reduce(
        (sum, entry) => sum + entry.calories,
        0
      );
      setConsumedCalories(totalCalories);
    } catch (error) {
      toast.error("Error fetching meals");
    }
  };

  const calculateBMR = (age, gender, weight, height) => {
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr.toFixed(2);
  };

  const calculateDailyCalories = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return (bmr * activityMultipliers[activityLevel]).toFixed(2);
  };

  const handleBMRSubmit = async (values) => {
    try {
      const response = await api.post("/calorie-tracker/calculate-bmr", {
        firebaseUid,
        ...values,
      });
      setBMR(response.data.bmr);
      setDailyCalories(response.data.dailyCalorieNeeds);
      setActivityLevel(values.activityLevel);
      toast.success("BMR and daily calorie needs calculated successfully!");
    } catch (error) {
      toast.error("Error calculating BMR");
    }
  };

  const handleFoodSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.calorieninjas.com/v1/nutrition?query=${searchQuery}`,
        {
          headers: { "X-Api-Key": "aizoaVtBC7EuOV56MRV43Q==x69x1glaSbTjXSuD" },
        }
      );
      setSearchResults(response.data.items);
    } catch (error) {
      toast.error("Error fetching nutrition data");
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setQuantity(1);
  };




  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddMeal = async () => {
    if (selectedFood) {
      try {
        const mealData = {
          firebaseUid,
          name: selectedFood.name,
          calories: selectedFood.calories * quantity,
          quantity: quantity,
          date: selectedDate.toISOString(),
        };
        const response = await api.post("/calorie-tracker/add-meal", mealData);
        setMealEntries([...mealEntries, response.data]);
        setSelectedFood(null);
        setQuantity(1);
        setSearchQuery("");
        setSearchResults([]);
        toast.success("Meal added successfully!");
        fetchMeals();
      } catch (error) {
        toast.error("Error adding meal");
      }
    }
  };

  const handleRemoveMeal = async (id) => {
    try {
      await api.delete(
        `/calorie-tracker/delete-meal/${id}?firebaseUid=${firebaseUid}`
      );
      setMealEntries(mealEntries.filter((entry) => entry.id !== id));
      toast.success("Meal removed successfully!");
      fetchMeals();
    } catch (error) {
      toast.error("Error removing meal");
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const mealToUpdate = mealEntries.find((entry) => entry.id === id);
      const updatedMeal = {
        ...mealToUpdate,
        quantity: newQuantity,
        calories: (mealToUpdate.calories / mealToUpdate.quantity) * newQuantity,
      };
      await api.put(`/calorie-tracker/update-meal/${id}`, {
        firebaseUid,
        ...updatedMeal,
      });
      setMealEntries(
        mealEntries.map((entry) => (entry.id === id ? updatedMeal : entry))
      );
      toast.success("Quantity updated successfully!");
      fetchMeals();
    } catch (error) {
      toast.error("Error updating meal quantity");
    }
  };

  const handleAddCustomFood = async (values, { resetForm }) => {
    try {
      const customFoodData = {
        firebaseUid,
        name: values.name,
        calories: values.calories * values.quantity,
        quantity: values.quantity,
        date: selectedDate.toISOString(),
      };
      const response = await api.post(
        "/calorie-tracker/add-meal",
        customFoodData
      );
      setMealEntries([...mealEntries, response.data]);
      resetForm();
      setShowCustomFoodForm(false);
      toast.success("Custom food added successfully!");
      fetchMeals();
    } catch (error) {
      toast.error("Error adding custom food");
    }
  };

  const remainingCalories = dailyCalories
    ? dailyCalories - consumedCalories
    : 0;

  useEffect(() => {
    const fetchCalorieSummary = async () => {
      try {
        const response = await api.get(
          `/calorie-tracker/summary/${
            selectedDate.toISOString().split("T")[0]
          }?firebaseUid=${firebaseUid}`
        );
        setDailyCalories(response.data.dailyGoal);
        setConsumedCalories(response.data.consumed);
      } catch (error) {
        toast.error("Error fetching calorie summary");
      }
    };

    if (firebaseUid) {
      fetchCalorieSummary();
    }
  }, [firebaseUid, selectedDate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (firebaseUid) {
        try {
          const response = await api.get(`/calorie-tracker/user-data?firebaseUid=${firebaseUid}`);
          setBMR(response.data.bmr);
          setDailyCalories(response.data.dailyCalorieNeeds);
          setActivityLevel(response.data.activityLevel);
        } catch (error) {
          toast.error("Error fetching user data");
        }
      }
    };
  
    fetchUserData();
  }, [firebaseUid]);

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
              <GiMuscleUp className="mr-4" /> Calorie Tracker
            </h1>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">
              Calculate Your Daily Calorie Needs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Formik
                initialValues={{
                  age: "",
                  gender: "male",
                  weight: "",
                  height: "",
                  activityLevel: "moderate",
                }}
                validationSchema={BMRCalculatorSchema}
                onSubmit={handleBMRSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Age
                        </label>
                        <Field
                          type="number"
                          name="age"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="age"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Gender
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Weight (kg)
                        </label>
                        <Field
                          type="number"
                          name="weight"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="weight"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Height (cm)
                        </label>
                        <Field
                          type="number"
                          name="height"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <ErrorMessage
                          name="height"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="activityLevel"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Activity Level
                      </label>
                      <Field
                        as="select"
                        name="activityLevel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="sedentary">
                          Sedentary (little to no exercise)
                        </option>
                        <option value="light">
                          Light (light exercise 1-3 days/week)
                        </option>
                        <option value="moderate">
                          Moderate (moderate exercise 3-5 days/week)
                        </option>
                        <option value="active">
                          Active (hard exercise 6-7 days/week)
                        </option>
                        <option value="veryActive">
                          Very Active (very hard exercise & physical job)
                        </option>
                      </Field>
                      <ErrorMessage
                        name="activityLevel"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFireAlt className="mr-2" /> Calculate
                    </motion.button>
                  </Form>
                )}
              </Formik>

              {dailyCalories && (
                <motion.div
                  className="bg-gray-100 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Your Daily Calorie Needs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <CalorieInfoCard
                      icon={<FaFireAlt className="text-orange-500" />}
                      title="BMR"
                      value={`${bmr} cal`}
                      color="blue"
                    />
                    <CalorieInfoCard
                      icon={<FaUtensils className="text-green-500" />}
                      title="Daily Needs"
                      value={`${dailyCalories} cal`}
                      color="green"
                    />
                    <CalorieInfoCard
                      icon={<FaHeart className="text-red-500" />}
                      title="Remaining"
                      value={`${remainingCalories.toFixed(2)} cal`}
                      color="purple"
                    />
                    <CalorieInfoCard
                      icon={<FaDumbbell className="text-gray-500" />}
                      title="Activity Level"
                      value={activityLevel}
                      color="gray"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Track Your Meals</h2>
                <motion.button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaCalendarAlt className="mr-2" />
                  {showCalendar ? "Hide Calendar" : "Show Calendar"}
                  {showCalendar ? (
                    <FaChevronUp className="ml-2" />
                  ) : (
                    <FaChevronDown className="ml-2" />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                      className="rounded-lg shadow-md"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-lg mb-4">
                Selected Date:{" "}
                <span className="font-semibold">
                  {selectedDate.toDateString()}
                </span>
              </p>
              <div className="mb-4">
                <label
                  htmlFor="foodSearch"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search for a food
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="foodSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter a food item"
                  />
                  <motion.button
                    onClick={handleFoodSearch}
                    className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSearch />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      Search Results
                    </h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {searchResults.map((food) => (
                        <motion.li
                          key={food.name}
                          className="bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300"
                          onClick={() => handleFoodSelect(food)}
                          whileHover={{ scale: 1.02 }}
                        >
                          {food.name} - {food.calories} calories per{" "}
                          {food.serving_size_g}g
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedFood && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-2">Selected Food</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="font-semibold">{selectedFood.name}</p>
                    <p>Calories: {selectedFood.calories * quantity}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        <FaMinus />
                      </button>
                      <span className="mx-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="bg-green-500 text-white p-2 rounded-md"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <motion.button
                      onClick={handleAddMeal}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add to Meals
                    </motion.button>
                  </div>
                </motion.div>
              )}

              <motion.button
                onClick={() => setShowCustomFoodForm(!showCustomFoodForm)}
                className="mb-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showCustomFoodForm
                  ? "Hide Custom Food Form"
                  : "Add Custom Food"}
              </motion.button>

              <AnimatePresence>
                {showCustomFoodForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Formik
                      initialValues={{ name: "", calories: "", quantity: 1 }}
                      validationSchema={CustomFoodSchema}
                      onSubmit={handleAddCustomFood}
                    >
                      {({ isSubmitting }) => (
                        <Form className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Food Name
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="calories"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Calories (per serving)
                            </label>
                            <Field
                              type="number"
                              name="calories"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <ErrorMessage
                              name="calories"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quantity
                            </label>
                            <Field
                              type="number"
                              name="quantity"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <ErrorMessage
                              name="quantity"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add Custom Food
                          </motion.button>
                        </Form>
                      )}
                    </Formik>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Today's Meals</h3>
                {mealEntries.length === 0 ? (
                  <p className="text-gray-500">
                    No meals added yet. Start by searching for a food item
                    above.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {mealEntries.map((entry) => (
                      <motion.li
                        key={entry.id}
                        className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <p className="font-semibold">{entry.name}</p>
                          <p className="text-sm text-gray-600">
                            Calories: {entry.calories.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  entry.id,
                                  Math.max(1, entry.quantity - 1)
                                )
                              }
                              className="bg-red-500 text-white p-1 rounded-md text-xs"
                            >
                              <FaMinus />
                            </button>
                            <span className="mx-2">{entry.quantity}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  entry.id,
                                  entry.quantity + 1
                                )
                              }
                              className="bg-green-500 text-white p-1 rounded-md text-xs"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveMeal(entry.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash />
                        </motion.button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6">Calorie Summary</h2>
              <div className="mb-8">
                <Doughnut
                  data={{
                    labels: ["Consumed", "Remaining"],
                    datasets: [
                      {
                        data: [
                          consumedCalories,
                          Math.max(0, dailyCalories - consumedCalories),
                        ],
                        backgroundColor: ["#4CAF50", "#2196F3"],
                        hoverBackgroundColor: ["#45a049", "#1e88e5"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Calorie Breakdown
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Daily Goal:</span>
                    <span className="font-semibold">
                      {dailyCalories} calories
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Consumed:</span>
                    <span className="font-semibold text-green-600">
                      {consumedCalories.toFixed(2)} calories
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-semibold text-blue-600">
                      {remainingCalories.toFixed(2)} calories
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Nutrition Knowledge Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NutritionTip
                icon={<FaAppleAlt className="text-red-500" />}
                title="Balanced Diet"
                description="Aim for a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats in your daily meals."
              />
              <NutritionTip
                icon={<FaRunning className="text-blue-500" />}
                title="Regular Exercise"
                description="Combine a healthy diet with regular physical activity for optimal health and weight management."
              />
              <NutritionTip
                icon={<GiWaterBottle className="text-blue-300" />}
                title="Stay Hydrated"
                description="Drink plenty of water throughout the day to support your body's functions and overall health."
              />
              <NutritionTip
                icon={<FaBrain className="text-purple-500" />}
                title="Mindful Eating"
                description="Pay attention to your food, eat slowly, and listen to your body's hunger and fullness cues."
              />
              <NutritionTip
                icon={<GiMuscleUp className="text-orange-500" />}
                title="Protein Power"
                description="Include adequate protein in your diet to support muscle growth, repair, and overall body function."
              />
              <NutritionTip
                icon={<FaChartBar className="text-green-500" />}
                title="Track Progress"
                description="Regularly monitor your food intake and progress to stay motivated and make informed decisions."
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">
              Nutrition Facts and Myths
            </h2>
            <div className="space-y-6">
              <NutritionFactMyth
                title="Fact: Eating late doesn't automatically lead to weight gain"
                description="It's the total calories consumed throughout the day that matters, not the time you eat them."
                isFact={true}
              />
              <NutritionFactMyth
                title="Myth: All fats are bad for you"
                description="Healthy fats, like those found in avocados, nuts, and olive oil, are essential for your body."
                isFact={false}
              />
              <NutritionFactMyth
                title="Fact: Drinking water can help with weight loss"
                description="Water can increase feelings of fullness and boost metabolism, aiding in weight management."
                isFact={true}
              />
              <NutritionFactMyth
                title="Myth: Detox diets are necessary to cleanse your body"
                description="Your body has its own detoxification system. A balanced diet supports these natural processes."
                isFact={false}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const NutritionTip = ({ icon, title, description }) => (
  <motion.div
    className="bg-gray-100 p-6 rounded-lg shadow-md"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const NutritionFactMyth = ({ title, description, isFact }) => (
  <motion.div
    className={`p-6 rounded-lg shadow-md ${
      isFact ? "bg-green-100" : "bg-red-100"
    }`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-semibold mb-2 flex items-center">
      {isFact ? (
        <FaCheckCircle className="text-green-500 mr-2" />
      ) : (
        <FaTimesCircle className="text-red-500 mr-2" />
      )}
      {title}
    </h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const CalorieInfoCard = ({ icon, title, value, color }) => (
  <motion.div
    className={`${color} p-4 rounded-lg shadow-md`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  </motion.div>
);

export default CalorieTracker;
