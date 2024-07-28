import { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaUser, FaEnvelope, FaBirthdayCake, FaVenusMars, FaRulerVertical, FaWeight, FaBullseye,
  FaUserNinja, FaAllergies, FaPills, FaUtensils, FaGlobeAmericas, FaBan, FaHeart,
  FaSupple, FaCheckSquare, FaRunning, FaFireAlt, FaAppleAlt, FaChartLine,FaMoon,FaUserMd,FaDumbbell
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const firebaseUid = user.uid;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/myprofile/${firebaseUid}`);
        setUserProfile(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.uid]);

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required("Display Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    profile: Yup.object().shape({
      age: Yup.number().positive("Age must be positive").integer("Age must be an integer").required("Age is required"),
      gender: Yup.string().required("Gender is required"),
      height: Yup.number().positive("Height must be positive").required("Height is required"),
      currentWeight: Yup.number().positive("Weight must be positive").required("Current weight is required"),
      targetWeight: Yup.number().positive("Target weight must be positive").required("Target weight is required"),
      bodyFrame: Yup.string().required("Body frame is required"),
      medicalConditions: Yup.array().of(Yup.string()),
      allergies: Yup.string(),
      medications: Yup.string(),
      dietType: Yup.string().required("Diet type is required"),
      preferredCuisines: Yup.array().of(Yup.string()),
      dislikedFoods: Yup.string(),
      favoriteFoods: Yup.string(),
      currentSupplements: Yup.string(),
      supplementWillingness: Yup.string(),
    }),
    calorieTracking: Yup.object().shape({
      bmr: Yup.number().positive("BMR must be positive"),
      dailyCalorieNeeds: Yup.number().positive("Daily calorie needs must be positive"),
      activityLevel: Yup.string().required("Activity level is required"),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const firebaseUid = user.uid;
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/myprofile/${firebaseUid}`, values);
      setUserProfile(response.data.user);
      setUpdateSuccess(true);
      setShowConfetti(true);
      toast.success("Profile Updated Successfully");
      setTimeout(() => {
        setUpdateSuccess(false);
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <motion.div
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-white"
        />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center text-red-500 text-xl mt-8">
        Error fetching profile data.
      </div>
    );
  }

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Weight',
        data: [userProfile.profile.currentWeight, userProfile.profile.currentWeight - 1, userProfile.profile.currentWeight - 2, userProfile.profile.currentWeight - 3, userProfile.profile.currentWeight - 4, userProfile.profile.targetWeight],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-extrabold text-white sm:text-6xl sm:tracking-tight lg:text-7xl">
            My Profile
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-white">
            Manage your personal information and preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl overflow-hidden sm:rounded-3xl"
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl leading-6 font-bold text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Update your profile details below.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.2,  }}
                whileTap={{ scale: 0.9 }}
                className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg"
              >
                <img
                  src={userProfile?.photoURL || "https://via.placeholder.com/128"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </div>
          </div>

          <Formik
            initialValues={{
              displayName: userProfile.displayName || "",
              email: userProfile.email || "",
              profile: {
                age: userProfile.profile?.age || "",
                gender: userProfile.profile?.gender || "",
                height: userProfile.profile?.height || "",
                currentWeight: userProfile.profile?.currentWeight || "",
                targetWeight: userProfile.profile?.targetWeight || "",
                bodyFrame: userProfile.profile?.bodyFrame || "",
                medicalConditions: userProfile.profile?.medicalConditions || [],
                allergies: userProfile.profile?.allergies || "",
                medications: userProfile.profile?.medications || "",
                dietType: userProfile.profile?.dietType || "",
                preferredCuisines: userProfile.profile?.preferredCuisines || [],
                dislikedFoods: userProfile.profile?.dislikedFoods || "",
                favoriteFoods: userProfile.profile?.favoriteFoods || "",
                currentSupplements: userProfile.profile?.currentSupplements || "",
                supplementWillingness: userProfile.profile?.supplementWillingness || "",
              },
              calorieTracking: {
                bmr: userProfile.calorieTracking?.bmr || "",
                dailyCalorieNeeds: userProfile.calorieTracking?.dailyCalorieNeeds || "",
                activityLevel: userProfile.calorieTracking?.activityLevel || "",
              },
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="border-t border-gray-200">
                <dl>
                  <FormField icon={<FaUser className="text-blue-500" />} label="Display Name" name="displayName" type="text" />
                  <FormField icon={<FaEnvelope className="text-green-500" />} label="Email" name="email" type="email" />
                  <FormField icon={<FaBirthdayCake className="text-pink-500" />} label="Age" name="profile.age" type="number" />
                  <FormField icon={<FaVenusMars className="text-purple-500" />} label="Gender" name="profile.gender" type="text" />
                  <FormField icon={<FaRulerVertical className="text-indigo-500" />} label="Height (cm)" name="profile.height" type="number" />
                  <FormField icon={<FaWeight className="text-yellow-500" />} label="Current Weight (kg)" name="profile.currentWeight" type="number" />
                  <FormField icon={<FaBullseye className="text-red-500" />} label="Target Weight (kg)" name="profile.targetWeight" type="number" />
                  <FormField icon={<FaUserNinja className="text-gray-500" />} label="Body Frame" name="profile.bodyFrame" type="text" />
                  <FormField icon={<FaAllergies className="text-orange-500" />} label="Allergies" name="profile.allergies" type="text" />
                  <FormField icon={<FaPills className="text-blue-400" />} label="Medications" name="profile.medications" type="text" />
                  <FormField icon={<FaUtensils className="text-green-600" />} label="Diet Type" name="profile.dietType" type="text" />
                  <FormField icon={<FaGlobeAmericas className="text-teal-500" />} label="Preferred Cuisines" name="profile.preferredCuisines" type="text" />
                  <FormField icon={<FaBan className="text-red-400" />} label="Disliked Foods" name="profile.dislikedFoods" type="text" />
                  <FormField icon={<FaHeart className="text-pink-400" />} label="Favorite Foods" name="profile.favoriteFoods" type="text" />
                  <FormField icon={<FaSupple className="text-purple-400" />} label="Current Supplements" name="profile.currentSupplements" type="text" />
                  <FormField icon={<FaCheckSquare className="text-green-500" />} label="Supplement Willingness" name="profile.supplementWillingness" type="text" />
                  <FormField icon={<FaFireAlt className="text-orange-500" />} label="BMR" name="calorieTracking.bmr" type="number" />
                  <FormField icon={<FaAppleAlt className="text-red-500" />} label="Daily Calorie Needs" name="calorieTracking.dailyCalorieNeeds" type="number" />
                  <FormField icon={<FaRunning className="text-blue-500" />} label="Activity Level" name="calorieTracking.activityLevel" type="text" />
                </dl>

                <div className="px-4 py-5 sm:px-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>

        <AnimatePresence>
          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 text-center rounded-md"
            >
              Profile updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white shadow-2xl overflow-hidden sm:rounded-3xl"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-3xl leading-6 font-bold text-gray-900">
              Health & Fitness Summary
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your current health and fitness statistics.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
            <StatItem icon={<FaWeight className="text-yellow-500" />} label="Current Weight" value={`${userProfile.profile.currentWeight} kg`} />
              <StatItem icon={<FaBullseye className="text-red-500" />} label="Target Weight" value={`${userProfile.profile.targetWeight} kg`} />
              <StatItem icon={<FaRulerVertical className="text-indigo-500" />} label="Height" value={`${userProfile.profile.height} cm`} />
              <StatItem icon={<FaFireAlt className="text-orange-500" />} label="BMR" value={`${userProfile.calorieTracking.bmr} kcal`} />
              <StatItem icon={<FaAppleAlt className="text-red-500" />} label="Daily Calorie Needs" value={`${userProfile.calorieTracking.dailyCalorieNeeds} kcal`} />
              <StatItem icon={<FaRunning className="text-blue-500" />} label="Activity Level" value={userProfile.calorieTracking.activityLevel} />
            </dl>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-white shadow-2xl overflow-hidden sm:rounded-3xl"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-3xl leading-6 font-bold text-gray-900">
              Weight Progress
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your weight journey towards your goal.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <Line data={weightData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 bg-white shadow-2xl overflow-hidden sm:rounded-3xl"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-3xl leading-6 font-bold text-gray-900">
              Dietary Preferences
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your food preferences and restrictions.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <StatItem icon={<FaUtensils className="text-green-600" />} label="Diet Type" value={userProfile.profile.dietType} />
              <StatItem icon={<FaGlobeAmericas className="text-teal-500" />} label="Preferred Cuisines" value={userProfile.profile.preferredCuisines.join(", ")} />
              <StatItem icon={<FaBan className="text-red-400" />} label="Disliked Foods" value={userProfile.profile.dislikedFoods} />
              <StatItem icon={<FaHeart className="text-pink-400" />} label="Favorite Foods" value={userProfile.profile.favoriteFoods} />
              <StatItem icon={<FaAllergies className="text-orange-500" />} label="Allergies" value={userProfile.profile.allergies} />
            </dl>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-12 bg-white shadow-2xl overflow-hidden sm:rounded-3xl"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-3xl leading-6 font-bold text-gray-900">
              Health Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your medical conditions and supplements.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <StatItem icon={<FaUserMd className="text-blue-500" />} label="Medical Conditions" value={userProfile.profile.medicalConditions.join(", ")} />
              <StatItem icon={<FaPills className="text-blue-400" />} label="Medications" value={userProfile.profile.medications} />
              <StatItem icon={<FaSupple className="text-purple-400" />} label="Current Supplements" value={userProfile.profile.currentSupplements} />
              <StatItem icon={<FaCheckSquare className="text-green-500" />} label="Supplement Willingness" value={userProfile.profile.supplementWillingness} />
            </dl>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-blue-500 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-16 text-center text-white"
      >
        <p className="text-lg">Stay healthy, stay fit!</p>
        <div className="mt-4 flex justify-center space-x-4">
          {[FaHeart, FaRunning, FaAppleAlt, FaMoon, FaDumbbell].map((Icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.8 }}
            >
              <Icon className="text-2xl" />
            </motion.div>
          ))}
        </div>
      </motion.footer>
    </motion.div>
  );
};

const FormField = ({ icon, label, name, type }) => (
  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      <span className="mr-2">{icon}</span>
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      <Field
        name={name}
        type={type}
        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md transition duration-150 ease-in-out"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </dd>
  </div>
);

const StatItem = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
  >
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      <span className="mr-2">{icon}</span>
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value}
    </dd>
  </motion.div>
);

export default MyProfile;