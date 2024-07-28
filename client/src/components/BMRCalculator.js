import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  AiOutlineCalculator,
  AiOutlineInfoCircle,
  AiFillFire,
  AiOutlineBarChart,
} from "react-icons/ai";
import { FiUser, FiActivity, FiTrendingUp, FiHeart } from "react-icons/fi";
import {
  GiWeightScale,
  GiMuscleUp,
  GiRunningShoe,
  GiHeartBeats,
} from "react-icons/gi";
import { IoMdNutrition, IoMdFitness } from "react-icons/io";
import { FaMars, FaVenus, FaAppleAlt } from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

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
});

const BMRCalculator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedBMR, setCalculatedBMR] = useState(null);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AiOutlineCalculator className="text-6xl text-blue-600 animate-spin" />
      </motion.div>
    );
  }

  const calculateBMR = (age, gender, weight, height) => {
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return bmr.toFixed(2);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to submit your BMR data.");
      setSubmitting(false);
      navigate("/login");
      return;
    }

    const { age, gender, weight, height } = values;
    const bmr = calculateBMR(age, gender, weight, height);

    try {
      const response = await axios.post(
       ` ${process.env.REACT_APP_API_URL}/api/tool/saveBMR`,
        {
          userId: user.uid,
          age,
          gender,
          weight,
          height,
          bmr,
        }
      );

      setCalculatedBMR(bmr);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving BMR data:", error);
      toast.error("Error saving BMR data");
      setFieldError("general", "Error saving BMR data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div
            className="p-8 bg-blue-600 text-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center">
              <AiFillFire className="mr-2 text-yellow-400" /> BMR Calculator
            </h1>
            <p className="mb-6 flex items-center">
              <AiOutlineInfoCircle className="mr-2 text-3xl" /> Calculate your
              Basal Metabolic Rate (BMR) to understand your body's calorie needs
              at rest.
            </p>
            <Formik
              initialValues={{
                age: "",
                gender: "male",
                weight: "",
                height: "",
              }}
              validationSchema={BMRCalculatorSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl" />
                    <Field
                      type="number"
                      name="age"
                      placeholder="Age"
                      className="w-full py-3 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-red-300 text-sm mt-1"
                    />
                  </div>
                  <div className="relative">
                    <Field name="gender">
                      {({ field }) => (
                        <div className="flex">
                          <label className="flex items-center mr-4">
                            <input
                              type="radio"
                              {...field}
                              value="male"
                              checked={field.value === "male"}
                              className="mr-2"
                            />
                            <FaMars className="mr-1" /> Male
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="female"
                              checked={field.value === "female"}
                              className="mr-2"
                            />
                            <FaVenus className="mr-1" /> Female
                          </label>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-300 text-sm mt-1"
                    />
                  </div>
                  <div className="relative">
                    <GiWeightScale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl" />
                    <Field
                      type="number"
                      name="weight"
                      placeholder="Weight (kg)"
                      className="w-full py-3 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                    />
                    <ErrorMessage
                      name="weight"
                      component="div"
                      className="text-red-300 text-sm mt-1"
                    />
                  </div>
                  <div className="relative">
                    <GiMuscleUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl" />
                    <Field
                      type="number"
                      name="height"
                      placeholder="Height (cm)"
                      className="w-full py-3 pl-12 pr-3 bg-white text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                    />
                    <ErrorMessage
                      name="height"
                      component="div"
                      className="text-red-300 text-sm mt-1"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Calculating..." : "Calculate BMR"}
                  </motion.button>
                  <ErrorMessage
                    name="general"
                    component="div"
                    className="text-red-300 text-sm mt-1"
                  />
                </Form>
              )}
            </Formik>
          </motion.div>
          <motion.div
            className="p-8 flex flex-col items-center justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {calculatedBMR !== null ? (
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <GiHeartBeats className="text-6xl text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Your BMR</h3>
                <p className="text-5xl font-bold text-blue-600 mb-4">
                  {calculatedBMR}
                </p>
                <p className="text-xl text-gray-600">calories/day</p>
              </motion.div>
            ) : (
              <div className="text-center">
                <AiOutlineInfoCircle className="text-6xl text-blue-500 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  Enter your details to calculate your BMR
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
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <AiOutlineBarChart className="mr-2" /> What is BMR?
          </h2>
          <p className="text-gray-700 mb-4">
            Basal Metabolic Rate (BMR) is the number of calories your body burns
            while at rest. It represents the minimum amount of energy needed to
            keep your body functioning, including breathing and keeping your
            heart beating.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FiActivity className="text-4xl mb-2 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Physical Activity</h3>
              <p className="text-gray-600">
                Your total daily calorie needs are higher than your BMR due to
                physical activity and digestion.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <IoMdNutrition className="text-4xl mb-2 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Nutrition</h3>
              <p className="text-gray-600">
                Knowing your BMR helps in planning your diet and understanding
                your body's calorie needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FiTrendingUp className="text-4xl mb-2 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Weight Management</h3>
              <p className="text-gray-600">
                BMR is crucial for setting realistic goals for weight loss or
                gain.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="p-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <IoMdFitness className="mr-2" /> Tips for a Healthy Metabolism
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <GiRunningShoe className="text-4xl mb-2 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Regular Exercise</h3>
              <p className="text-gray-600">
                Incorporate both cardio and strength training to boost your
                metabolism.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <FaAppleAlt className="text-4xl mb-2 text-green-600" />
              <h3 className="text-xl font-semibold mb-2">Balanced Diet</h3>
              <p className="text-gray-600">
                Eat a variety of nutrient-dense foods and don't skip meals,
                especially breakfast.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <RiMentalHealthFill className="text-4xl mb-2 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">Adequate Sleep</h3>
              <p className="text-gray-600">
                Aim for 7-9 hours of quality sleep per night to support your
                metabolism.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="mt-8 text-center text-sm text-gray-600"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <p className="flex items-center justify-center">
          <FiHeart className="text-red-500 mr-1" />
          Remember, BMR is just one aspect of your overall health. Consult with
          a healthcare professional for personalized advice.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BMRCalculator;
