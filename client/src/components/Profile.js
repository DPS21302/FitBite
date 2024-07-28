import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHeartbeat,
  FaUtensils,
  FaBriefcaseMedical,
  FaCarrot,
  FaTablets,
  FaWeight,
  FaRulerVertical,
  FaVenusMars,
  FaBirthdayCake,
  FaBalanceScale,
  FaAllergies,
  FaPills,
  FaGlobeAmericas,
  FaBan,
  FaStar,
  FaVial,
  FaCheckCircle,
  FaChartLine,
  FaClock,
  FaInfoCircle,
  FaLightbulb,
  FaForward,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Gemini from "./Gemini";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [showDietRecommendation, setShowDietRecommendation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Adjusted to relevant steps

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    bodyFrame: "",
    medicalConditions: [],
    allergies: "",
    medications: "",
    dietType: "",
    preferredCuisines: [],
    dislikedFoods: "",
    favoriteFoods: "",
    currentSupplements: "",
    supplementWillingness: "",
  });

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserProfile();
    }
  }, [isLoggedIn, user]);

  const fetchUserProfile = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/profile/myprofile/${user.uid}`
      );
      if (response.data && response.data.user && response.data.user.profile) {
        setFormData(response.data.user.profile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: prevData[name].includes(value)
        ? prevData[name].filter((item) => item !== value)
        : [...prevData[name], value],
    }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to submit your profile data.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile/myprofile/${user.uid}`,
        { profile: formData }
      );

      if (response.status === 200) {
        toast.success("Profile saved successfully");
        setShowDietRecommendation(true);
      } else {
        toast.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving profile data");
    }
  };

  const skipProfileUpdate = () => {
    setShowDietRecommendation(true);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-indigo-800 flex items-center">
              <FaUser className="mr-4 text-indigo-600" />
              Personal Information
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaBirthdayCake className="text-indigo-500 text-2xl mr-4" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaVenusMars className="text-indigo-500 text-2xl mr-4" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field w-full text-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaRulerVertical className="text-indigo-500 text-2xl mr-4" />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Height (cm)"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaWeight className="text-indigo-500 text-2xl mr-4" />
                <input
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  placeholder="Current Weight (kg)"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaBalanceScale className="text-indigo-500 text-2xl mr-4" />
                <input
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  placeholder="Target Weight (kg)"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaUser className="text-indigo-500 text-2xl mr-4" />
                <select
                  name="bodyFrame"
                  value={formData.bodyFrame}
                  onChange={handleInputChange}
                  className="input-field w-full text-lg"
                >
                  <option value="">Body Frame Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-blue-800 flex items-center">
              <FaHeartbeat className="mr-4 text-blue-600" />
              Health Metrics
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  <FaBriefcaseMedical className="inline mr-2 text-blue-500" />
                  Existing medical conditions:
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Diabetes", "Hypertension", "Heart Disease", "None"].map(
                    (condition) => (
                      <motion.button
                        key={condition}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleMultiSelect("medicalConditions", condition)
                        }
                        className={`px-4 py-2 rounded-full text-lg ${
                          formData.medicalConditions.includes(condition)
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-700 border border-blue-300"
                        }`}
                      >
                        {condition}
                      </motion.button>
                    )
                  )}
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaAllergies className="text-blue-500 text-2xl mr-4" />
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Allergies and food intolerances"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaPills className="text-blue-500 text-2xl mr-4" />
                <input
                  type="text"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="Medications affecting diet or metabolism"
                  className="input-field w-full text-lg"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-yellow-800 flex items-center">
              <FaCarrot className="mr-4 text-yellow-600" />
              Dietary Preferences
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaUtensils className="text-yellow-500 text-2xl mr-4" />
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleInputChange}
                  className="input-field w-full text-lg"
                >
                  <option value="">Select Diet Type</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  <FaGlobeAmericas className="inline mr-2 text-yellow-500" />
                  Preferred cuisines:
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Italian",
                    "Indian",
                    "Mexican",
                    "Chinese",
                    "Japanese",
                    "Mediterranean",
                  ].map((cuisine) => (
                    <motion.button
                      key={cuisine}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleMultiSelect("preferredCuisines", cuisine)
                      }
                      className={`px-4 py-2 rounded-full text-lg ${
                        formData.preferredCuisines.includes(cuisine)
                          ? "bg-yellow-500 text-white"
                          : "bg-white text-yellow-700 border border-yellow-300"
                      }`}
                    >
                      {cuisine}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaBan className="text-yellow-500 text-2xl mr-4" />
                <input
                  type="text"
                  name="dislikedFoods"
                  value={formData.dislikedFoods}
                  onChange={handleInputChange}
                  placeholder="Foods you dislike or avoid"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaStar className="text-yellow-500 text-2xl mr-4" />
                <input
                  type="text"
                  name="favoriteFoods"
                  value={formData.favoriteFoods}
                  onChange={handleInputChange}
                  placeholder="Favorite foods or ingredients"
                  className="input-field w-full text-lg"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-purple-800 flex items-center">
              <FaTablets className="mr-4 text-purple-600" />
              Supplementation
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaVial className="text-purple-500 text-2xl mr-4" />
                <input
                  type="text"
                  name="currentSupplements"
                  value={formData.currentSupplements}
                  onChange={handleInputChange}
                  placeholder="Current supplements being taken"
                  className="input-field w-full text-lg"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center bg-white p-4 rounded-lg shadow"
              >
                <FaCheckCircle className="text-purple-500 text-2xl mr-4" />
                <select
                  name="supplementWillingness"
                  value={formData.supplementWillingness}
                  onChange={handleInputChange}
                  className="input-field w-full text-lg"
                >
                  <option value="">
                    Willingness to include supplements in diet plan
                  </option>
                  <option value="willing">Willing</option>
                  <option value="hesitant">Hesitant</option>
                  <option value="not_willing">Not Willing</option>
                </select>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-green-800 flex items-center">
              <FaBriefcaseMedical className="mr-4 text-green-600" />
              Summary & Submission
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold mb-4 text-green-700">
                  Personal Information
                </h3>
                <p>
                  <strong>Age:</strong> {formData.age}
                </p>
                <p>
                  <strong>Gender:</strong> {formData.gender}
                </p>
                <p>
                  <strong>Height:</strong> {formData.height} cm
                </p>
                <p>
                  <strong>Current Weight:</strong> {formData.currentWeight} kg
                </p>
                <p>
                  <strong>Target Weight:</strong> {formData.targetWeight} kg
                </p>
                <p>
                  <strong>Body Frame:</strong> {formData.bodyFrame}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold mb-4 text-green-700">
                  Health Metrics
                </h3>
                <p>
                  <strong>Medical Conditions:</strong>{" "}
                  {formData.medicalConditions.join(", ") || "None"}
                </p>
                <p>
                  <strong>Allergies:</strong> {formData.allergies || "None"}
                </p>
                <p>
                  <strong>Medications:</strong> {formData.medications || "None"}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold mb-4 text-green-700">
                  Dietary Preferences
                </h3>
                <p>
                  <strong>Diet Type:</strong> {formData.dietType}
                </p>
                <p>
                  <strong>Preferred Cuisines:</strong>{" "}
                  {formData.preferredCuisines.join(", ") || "None specified"}
                </p>
                <p>
                  <strong>Disliked Foods:</strong>{" "}
                  {formData.dislikedFoods || "None specified"}
                </p>
                <p>
                  <strong>Favorite Foods:</strong>{" "}
                  {formData.favoriteFoods || "None specified"}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold mb-4 text-green-700">
                  Supplementation
                </h3>
                <p>
                  <strong>Current Supplements:</strong>{" "}
                  {formData.currentSupplements || "None"}
                </p>
                <p>
                  <strong>Willingness to Include Supplements:</strong>{" "}
                  {formData.supplementWillingness}
                </p>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-700"
              >
                Please review your details above and submit the form to complete
                your profile setup.
              </motion.p>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full py-4 text-xl bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Submit Profile
              </motion.button>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {!showDietRecommendation ? (
        <>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
                Create Your Profile
              </h1>
              <p className="text-xl text-gray-600">
                Let's get to know you better to personalize your experience.
              </p>
            </motion.div>

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-64"
              >
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white shadow-xl rounded-lg overflow-hidden mb-8"
                >
                  <div className="bg-indigo-600 p-4">
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <motion.div
                          key={step}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            currentStep >= step
                              ? "bg-white text-indigo-600"
                              : "bg-indigo-400 text-white"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {renderStep()}
                </motion.div>
                <div className="flex justify-between mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-3 rounded-lg text-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChartLine className="mr-2" />
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    disabled={currentStep === totalSteps}
                    className="px-6 py-3 rounded-lg text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaClock className="ml-2" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={skipProfileUpdate}
                    className="px-6 py-3 rounded-lg text-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-300 ease-in-out flex items-center"
                  >
                    Skip
                    <FaForward className="ml-2" />
                  </motion.button>
                </div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 bg-white p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                <FaInfoCircle className="mr-2" />
                Why This Information Matters
              </h3>
              <p className="text-gray-600 mb-4">
                The details you provide help us create a personalized plan that
                fits your unique needs and goals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FaLightbulb className="text-yellow-500 mt-1 mr-2" />
                  <p className="text-sm text-gray-500">
                    Your age and gender help determine nutritional needs.
                  </p>
                </div>
                <div className="flex items-start">
                  <FaHeartbeat className="text-red-500 mt-1 mr-2" />
                  <p className="text-sm text-gray-500">
                    Health conditions influence dietary recommendations.
                  </p>
                </div>
                <div className="flex items-start">
                  <FaUtensils className="text-green-500 mt-1 mr-2" />
                  <p className="text-sm text-gray-500">
                    Dietary preferences ensure you enjoy your meal plans.
                  </p>
                </div>
                <div className="flex items-start">
                  <FaTablets className="text-blue-500 mt-1 mr-2" />
                  <p className="text-sm text-gray-500">
                    Supplement info helps optimize your nutrition.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                Need help?{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Contact Support
                </a>
              </p>
            </motion.div>
          </div>
        </>
      ) : (
        <Gemini formData={formData} />
      )}
    </div>
  );
};

export default Profile;
