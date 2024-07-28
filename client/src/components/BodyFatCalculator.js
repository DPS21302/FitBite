import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  FaWeight, FaRulerVertical, FaCalculator, FaInfoCircle, FaHeartbeat,
  FaRunning, FaBed, FaGlassCheers, FaSmoking, FaStethoscope
} from "react-icons/fa";
import { GiMuscleUp, GiNecklace } from "react-icons/gi";
import { TbRulerMeasure } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

const BodyFatCalculatorSchema = Yup.object().shape({
  weight: Yup.number().min(1, "Weight must be greater than zero").required("Weight is required"),
  waist: Yup.number().min(1, "Waist must be greater than zero").required("Waist is required"),
  hip: Yup.number().min(1, "Hip must be greater than zero").required("Hip is required"),
  neck: Yup.number().min(1, "Neck must be greater than zero").required("Neck is required"),
});

const BodyFatCalculator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedBodyFat, setCalculatedBodyFat] = useState(null);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  const calculateBodyFat = (weight, waist, hip, neck) => {
    // This is a simplified formula. You might want to use a more accurate one.
    return (86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(weight) + 36.76).toFixed(2);
  };

  const getBodyFatCategory = (bodyFat) => {
    if (bodyFat < 6) return { category: "Essential Fat", color: "#3498db", angle: -135 };
    if (bodyFat < 14) return { category: "Athletes", color: "#2ecc71", angle: -45 };
    if (bodyFat < 18) return { category: "Fitness", color: "#f1c40f", angle: 45 };
    if (bodyFat < 25) return { category: "Average", color: "#e67e22", angle: 135 };
    return { category: "Obese", color: "#e74c3c", angle: 180 };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to submit your body fat data.");
      setSubmitting(false);
      navigate("/login");
      return;
    }

    const { weight, waist, hip, neck } = values;
    const bodyFat = calculateBodyFat(weight, waist, hip, neck);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tool/saveBodyFat`, {
        userId: user.uid,
        weight,
        waist,
        hip,
        neck,
        bodyFat,
      });

      setCalculatedBodyFat(bodyFat);
      toast.success(response.data.message);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error("Error saving body fat data:", error);
      toast.error("Error saving body fat data");
      setFieldError("general", "Error saving body fat data");
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = {
    labels: ["Essential Fat", "Athletes", "Fitness", "Average", "Obese"],
    datasets: [
      {
        data: [6, 8, 4, 7, 10],
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"],
        hoverBackgroundColor: ["#2980b9", "#27ae60", "#f39c12", "#d35400", "#c0392b"],
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    rotation: -90,
    circumference: 180,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-400 to-purple-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCalculator className="text-6xl text-white animate-bounce" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold mb-6 flex items-center">
              <FaCalculator className="mr-4" /> Body Fat Calculator
            </h1>
            <p className="mb-8 text-xl flex items-center">
              <FaInfoCircle className="mr-2" /> Calculate your body fat percentage and track your fitness journey.
            </p>
            <Formik
              initialValues={{ weight: "", waist: "", hip: "", neck: "" }}
              validationSchema={BodyFatCalculatorSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-8">
                  <div className="relative">
                    <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />
                    <Field
                      type="number"
                      name="weight"
                      placeholder="Weight (kg)"
                      className="w-full py-4 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                    />
                    <ErrorMessage name="weight" component="div" className="text-red-300 text-sm mt-1" />
                  </div>
                  <div className="relative">
                    <TbRulerMeasure className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />
                    <Field
                      type="number"
                      name="waist"
                      placeholder="Waist (cm)"
                      className="w-full py-4 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                    />
                    <ErrorMessage name="waist" component="div" className="text-red-300 text-sm mt-1" />
                  </div>
                  <div className="relative">
                    <FaRulerVertical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />
                    <Field
                      type="number"
                      name="hip"
                      placeholder="Hip (cm)"
                      className="w-full py-4 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                    />
                    <ErrorMessage name="hip" component="div" className="text-red-300 text-sm mt-1" />
                  </div>
                  <div className="relative">
                    <GiNecklace className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />
                    <Field
                      type="number"
                      name="neck"
                      placeholder="Neck (cm)"
                      className="w-full py-4 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                    />
                    <ErrorMessage name="neck" component="div" className="text-red-300 text-sm mt-1" />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-xl font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Calculating..." : "Calculate Body Fat"}
                  </motion.button>
                  <ErrorMessage name="general" component="div" className="text-red-300 text-sm mt-1" />
                </Form>
              )}
            </Formik>
          </motion.div>
          <motion.div
            className="p-8 flex flex-col items-center justify-center bg-gray-50"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-80 h-80 relative">
              <Doughnut data={chartData} options={chartOptions} />
              {calculatedBodyFat !== null && (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center mt-60">
                    <motion.p
                      className="text-6xl font-bold text-gray-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {calculatedBodyFat}%
                    </motion.p>
                    <p className="text-2xl font-semibold text-gray-600 mt-2">
                      {getBodyFatCategory(calculatedBodyFat).category}
                    </p>
                  </div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-red-500 origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${getBodyFatCategory(calculatedBodyFat).angle}deg)`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                  />
                </>
              )}
            </div>
            {calculatedBodyFat === null && (
              <div className="text-center mt-8">
                <FaInfoCircle className="text-6xl text-blue-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  Enter your measurements to see your body fat percentage
                </p>
              </div>
            )}
          </motion.div>
        </div>
        <motion.div
          className="p-8 bg-gray-100"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <FaStethoscope className="mr-2" /> Body Fat Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-100 p-6 rounded-lg flex items-center shadow-md">
              <GiMuscleUp className="text-5xl mr-4 text-blue-600" />
              <div>
                <p className="font-semibold text-2xl">Essential Fat</p>
                <p className="text-lg text-gray-600">2-5%</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-100 p-6 rounded-lg flex items-center shadow-md">
              <FaRunning className="text-5xl mr-4 text-green-600" />
              <div>
                <p className="font-semibold text-2xl">Athletes</p>
                <p className="text-lg text-gray-600">6-13%</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-100 p-6 rounded-lg flex items-center shadow-md">
              <FaHeartbeat className="text-5xl mr-4 text-yellow-600" />
              <div>
                <p className="font-semibold text-2xl">Fitness</p>
                <p className="text-lg text-gray-600">14-17%</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-orange-100 p-6 rounded-lg flex items-center shadow-md">
              <FaWeight className="text-5xl mr-4 text-orange-600" />
              <div>
                <p className="font-semibold text-2xl">Average</p>
                <p className="text-lg text-gray-600">18-24%</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-red-100 p-6 rounded-lg flex items-center shadow-md">
              <FaWeight className="text-5xl mr-4 text-red-600" />
              <div>
                <p className="font-semibold text-2xl">Obese</p>
                <p className="text-lg text-gray-600">25%+</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="p-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <FaStethoscope className="mr-2" /> Factors Affecting Body Fat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-indigo-50 p-6 rounded-lg shadow-lg">
              <FaRunning className="text-6xl mb-4 text-indigo-600" />
              <h3 className="text-2xl font-semibold mb-2">Physical Activity</h3>
              <p className="text-gray-600">
                Regular exercise, especially strength training, can help reduce body fat and increase muscle mass.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 p-6 rounded-lg shadow-lg">
              <FaGlassCheers className="text-6xl mb-4 text-green-600" />
              <h3 className="text-2xl font-semibold mb-2">Diet</h3>
              <p className="text-gray-600">
                A balanced diet rich in protein, healthy fats, and complex carbohydrates can help manage body fat levels.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-purple-50 p-6 rounded-lg shadow-lg">
              <FaBed className="text-6xl mb-4 text-purple-600" />
              <h3 className="text-2xl font-semibold mb-2">Sleep and Stress</h3>
              <p className="text-gray-600">
                Adequate sleep and stress management can help regulate hormones that affect body fat storage.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showAdvancedInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-gray-50"
            >
              <h2 className="text-3xl font-bold mb-6">Advanced Body Fat Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Body Fat Measurement Methods</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Skinfold Calipers</li>
                    <li>Bioelectrical Impedance</li>
                    <li>Hydrostatic Weighing</li>
                    <li>DEXA Scan</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Health Implications</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Cardiovascular health</li>
                    <li>Hormone balance</li>
                    <li>Joint stress</li>
                    <li>Metabolic rate</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-b-3xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Take Action for Your Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaRunning className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Regular Exercise</h3>
                <p>Aim for at least 150 minutes of moderate activity per week</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaGlassCheers className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Balanced Nutrition</h3>
                <p>Focus on whole foods, lean proteins, and plenty of vegetables</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaSmoking className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Healthy Lifestyle</h3>
                <p>Avoid smoking and limit alcohol consumption</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <button
          onClick={() => setShowAdvancedInfo(!showAdvancedInfo)}
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition duration-300 shadow-md"
        >
          {showAdvancedInfo ? "Hide Advanced Info" : "Show Advanced Info"}
        </button>
      </motion.div>

      <motion.footer
        className="mt-12 text-center text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <p className="text-lg mb-2">
          Remember, body fat percentage is just one indicator of health. For a comprehensive understanding of your health status, consult with a healthcare professional.
        </p>
        <p>&copy; 2023 Body Fat Calculator. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
};

export default BodyFatCalculator;