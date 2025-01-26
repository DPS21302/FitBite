import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, CategoryScale } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  FaWeight, FaRulerVertical, FaCalculator, FaInfoCircle, FaHeartbeat, FaAppleAlt,
  FaRunning, FaBed, FaGlassCheers, FaSmoking, FaStethoscope, FaChartLine
} from "react-icons/fa";
import { GiMuscleUp, GiBodyHeight, GiWeightScale } from "react-icons/gi";
import { RiMentalHealthLine } from "react-icons/ri";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, CategoryScale);

const BMICalculatorSchema = Yup.object().shape({
  weight: Yup.number().min(1, "Weight must be greater than zero").required("Weight is required"),
  height: Yup.number().min(1, "Height must be greater than zero").required("Height is required"),
});

const BMICalculator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedBMI, setCalculatedBMI] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false);
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
      if (isLoggedIn) {
        fetchBMIHistory();
      }
    }
  }, [user, isLoggedIn]);

  const fetchBMIHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tool/getBMIHistory/${user.uid}`);
      setBmiHistory(response.data.bmiHistory);
    } catch (error) {
      console.error("Error fetching BMI history:", error);
    }
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3498db", angle: -135 };
    if (bmi < 25) return { category: "Normal", color: "#2ecc71", angle: -45 };
    if (bmi < 30) return { category: "Overweight", color: "#f39c12", angle: 45 };
    return { category: "Obese", color: "#e74c3c", angle: 135 };
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {


    const { weight, height } = values;
    const bmi = calculateBMI(weight, height);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tool/saveBMI`, {
        userId: user.uid,
        weight,
        height,
        bmi,
      });

      setCalculatedBMI(bmi);
      toast.success(response.data.message);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      fetchBMIHistory();
    } catch (error) {
      console.error("Error saving BMI data:", error);
      toast.error("Error saving BMI data");
      setFieldError("general", "Error saving BMI data");
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = {
    labels: ["Underweight", "Normal", "Overweight", "Obese"],
    datasets: [
      {
        data: [18.5, 6.5, 5, 5],
        backgroundColor: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
        hoverBackgroundColor: ["#2980b9", "#27ae60", "#e67e22", "#c0392b"],
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

  const historyChartData = {
    labels: bmiHistory.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'BMI History',
        data: bmiHistory.map(entry => entry.bmi),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const historyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BMI History'
      }
    }
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
              <FaCalculator className="mr-4" /> Ultimate BMI Calculator
            </h1>
            <p className="mb-8 text-xl flex items-center">
              <FaInfoCircle className="mr-2" /> Calculate your Body Mass Index (BMI) and track your health journey.
            </p>
            <Formik
              initialValues={{ weight: "", height: "" }}
              validationSchema={BMICalculatorSchema}
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
                    <FaRulerVertical className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-2xl" />
                    <Field
                      type="number"
                      name="height"
                      placeholder="Height (cm)"
                      className="w-full py-4 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-300 transition text-lg"
                    />
                    <ErrorMessage name="height" component="div" className="text-red-300 text-sm mt-1" />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-xl font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Calculating..." : "Calculate BMI"}
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
              <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
              {calculatedBMI !== null && (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center mt-60">
                    <motion.p
                      className="text-6xl font-bold text-gray-800"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {calculatedBMI}
                    </motion.p>
                    <p className="text-2xl font-semibold text-gray-600 mt-2">
                      {getBMICategory(calculatedBMI).category}
                    </p>
                  </div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-red-500 origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${getBMICategory(calculatedBMI).angle}deg)`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                  />
                </>
              )}
            </div>
            {calculatedBMI === null && (
              <div className="text-center mt-8">
                <FaInfoCircle className="text-6xl text-blue-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  Enter your weight and height to see your BMI
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
            <FaChartLine className="mr-2" /> BMI Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-100 p-6 rounded-lg flex items-center shadow-md">
              <GiMuscleUp className="text-5xl mr-4 text-blue-600" />
              <div>
                <p className="font-semibold text-2xl">Underweight</p>
                <p className="text-lg text-gray-600">&lt; 18.5</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-100 p-6 rounded-lg flex items-center shadow-md">
              <GiBodyHeight className="text-5xl mr-4 text-green-600" />
              <div>
                <p className="font-semibold text-2xl">Normal</p>
                <p className="text-lg text-gray-600">18.5 - 24.9</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-100 p-6 rounded-lg flex items-center shadow-md">
              <GiWeightScale className="text-5xl mr-4 text-yellow-600" />
              <div>
                <p className="font-semibold text-2xl">Overweight</p>
                <p className="text-lg text-gray-600">25 - 29.9</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-red-100 p-6 rounded-lg flex items-center shadow-md">
              <FaHeartbeat className="text-5xl mr-4 text-red-600" />
              <div>
                <p className="font-semibold text-2xl">Obese</p>
                <p className="text-lg text-gray-600">30 or greater</p>
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
            <FaStethoscope className="mr-2" /> Holistic Health Factors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-indigo-50 p-6 rounded-lg shadow-lg">
              <FaRunning className="text-6xl mb-4 text-indigo-600" />
              <h3 className="text-2xl font-semibold mb-2">Physical Activity</h3>
              <p className="text-gray-600">
                Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous aerobic activity a week, combined with strength training.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 p-6 rounded-lg shadow-lg">
              <FaAppleAlt className="text-6xl mb-4 text-green-600" />
              <h3 className="text-2xl font-semibold mb-2">Balanced Nutrition</h3>
              <p className="text-gray-600">
                Consume a variety of nutrient-dense foods, including fruits, vegetables, whole grains, lean proteins, and healthy fats. Practice portion control.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-purple-50 p-6 rounded-lg shadow-lg">
              <RiMentalHealthLine className="text-6xl mb-4 text-purple-600" />
              <h3 className="text-2xl font-semibold mb-2">Mental Wellbeing</h3>
              <p className="text-gray-600">
                Prioritize stress management through techniques like meditation, deep breathing, or yoga. Seek professional help when needed.
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
              <h2 className="text-3xl font-bold mb-6">Advanced Health Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">BMI Limitations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Doesn't distinguish between muscle and fat mass</li>
                    <li>May not be accurate for athletes or elderly individuals</li>
                    <li>Doesn't account for body fat distribution</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Additional Health Metrics</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Waist circumference</li>
                    <li>Body fat percentage</li>
                    <li>Blood pressure and cholesterol levels</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="p-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <FaChartLine className="mr-2" /> Your BMI History
          </h2>
          {bmiHistory.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Line data={historyChartData} options={historyChartOptions} />
            </div>
          ) : (
            <p className="text-xl text-gray-600">No BMI history available. Start tracking your BMI today!</p>
          )}
        </motion.div>

        <motion.div
          className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-b-3xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Take Action for Your Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaBed className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Improve Sleep</h3>
                <p>Aim for 7-9 hours of quality sleep each night</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaGlassCheers className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Stay Hydrated</h3>
                <p>Drink at least 8 glasses of water daily</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaSmoking className="text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Quit Smoking</h3>
                <p>Seek support to quit or reduce smoking</p>
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
          Remember, BMI is just one indicator of health. For a comprehensive understanding of your health status, consult with a healthcare professional.
        </p>
        <p>&copy; 2023 Ultimate BMI Calculator. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
};

export default BMICalculator;