import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGoogle,
  FaSignOutAlt,
  FaHeartbeat,
  FaWeight,
  FaRunning,
  FaFire,
  FaRulerVertical,
  FaTint,
  FaChartLine,
  FaMedal,
  FaUserCircle,
  FaInfoCircle,
  FaNewspaper,
  FaCalendarAlt,
  FaDumbbell,
  FaAppleAlt,
  FaBed,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { IoMdFitness, IoMdTrendingUp, IoMdNutrition } from "react-icons/io";
import { GiFootprint, GiWeightLiftingUp, GiMeditation } from "react-icons/gi";
import { MdDirectionsBike, MdRestaurant } from "react-icons/md";
import { RiMentalHealthLine, RiZzzFill } from "react-icons/ri";

const CLIENT_ID =
  "193271703266-t0bfa4k574678phcmottkdo9o1n03ee9.apps.googleusercontent.com";
const API_KEY = "AIzaSyDSX0idNMfwwq29vs_2lvJNKevleYSa44Y";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest";

const dataTypes = [
  {
    name: "Activity",
    type: "com.google.activity.segment",
    scope: "https://www.googleapis.com/auth/fitness.activity.read",
    icon: <FaRunning />,
    color: "bg-blue-500",
    defaultValue: "0 mins",
  },
  {
    name: "Steps",
    type: "com.google.step_count.delta",
    scope: "https://www.googleapis.com/auth/fitness.activity.read",
    icon: <GiFootprint />,
    color: "bg-green-500",
    defaultValue: "0 steps",
  },
  {
    name: "Calories",
    type: "com.google.calories.expended",
    scope: "https://www.googleapis.com/auth/fitness.activity.read",
    icon: <FaFire />,
    color: "bg-red-500",
    defaultValue: "0 kcal",
  },
  {
    name: "Heart Rate",
    type: "com.google.heart_rate.bpm",
    scope: "https://www.googleapis.com/auth/fitness.heart_rate.read",
    icon: <FaHeartbeat />,
    color: "bg-pink-500",
    defaultValue: "0 bpm",
  },
  {
    name: "Weight",
    type: "com.google.weight",
    scope: "https://www.googleapis.com/auth/fitness.body.read",
    icon: <FaWeight />,
    color: "bg-yellow-500",
    defaultValue: "0 kg",
  },
  {
    name: "Height",
    type: "com.google.height",
    scope: "https://www.googleapis.com/auth/fitness.body.read",
    icon: <FaRulerVertical />,
    color: "bg-indigo-500",
    defaultValue: "0 cm",
  },
  {
    name: "Blood Pressure",
    type: "com.google.blood_pressure",
    scope: "https://www.googleapis.com/auth/fitness.blood_pressure.read",
    icon: <FaTint />,
    color: "bg-purple-500",
    defaultValue: "0/0 mmHg",
  },
  {
    name: "Blood Glucose",
    type: "com.google.blood_glucose",
    scope: "https://www.googleapis.com/auth/fitness.blood_glucose.read",
    icon: <FaChartLine />,
    color: "bg-teal-500",
    defaultValue: "0 mg/dL",
  },
  //   {
  //     name: "Oxygen Saturation",
  //     type: "com.google.oxygen_saturation",
  //     scope: "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
  //     icon: <FaTint />,
  //     color: "bg-cyan-500",
  //     defaultValue: "0%",
  //   },
  //   {
  //     name: "Body Temperature",
  //     type: "com.google.body.temperature",
  //     scope: "https://www.googleapis.com/auth/fitness.body_temperature.read",
  //     icon: <FaThermometerHalf />,
  //     color: "bg-orange-500",
  //     defaultValue: "0°C",
  //   },
];

const GoogleFitIcon = () => (
  <svg
    enableBackground="new 0 0 236.2 200"
    id="Layer_1"
    version="1.1"
    viewBox="0 0 236.2 200"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="40" // Added width
    height="40" // Added height
  >
    <g>
      <path
        d="M22.6,105.8l11.9,11.9l25.7-25.6L48.4,80.2l0,0L43,74.8c-4.3-4.3-6.6-9.9-6.6-16c0-5.3,1.8-10.1,4.9-13.9   l0,0l0,0l0,0l0,0c4.2-5.3,10.6-8.7,17.8-8.7c6.1,0,11.7,2.4,16.1,6.7l5.3,5.1L92.4,60l25.8-25.6l-12-11.9l-5.4-5.2   C90.1,6.6,75.4,0,59.1,0C26.4,0,0,26.4,0,58.9C0,67,1.6,74.7,4.6,81.8c3,7.1,7.3,13.4,12.7,18.7L22.6,105.8"
        fill="#EA4335"
      />
      <polyline
        fill="#FBBC04"
        points="81.5,122.2 118.2,85.7 92.4,60 60.2,92.1 60.2,92.1 34.5,117.7 48.3,131.6 60.2,143.4 72.6,131"
      />
      <polygon
        fill="#34A853"
        points="143.8,175.6 201.8,117.7 176,92.1 118.1,149.9 85.9,117.8 60.2,143.4 92.4,175.6 92.3,175.7    118.1,200 118.1,200 118.1,200 143.9,175.6 143.9,175.6  "
      />
      <path
        d="M218.9,100.5c12-12,18.9-30.4,17-49c-2.8-28.2-26.2-49.4-54.6-51.3c-17.9-1.2-34.3,5.5-45.9,17.1L92.4,60   l25.7,25.7l43-42.8c5.2-5.1,12.4-7.5,19.8-6.3c9.6,1.5,17.4,9.4,18.7,19c1,7.2-1.4,14.2-6.5,19.3L176,92.1l25.8,25.6L218.9,100.5z"
        fill="#4285F4"
      />
    </g>
  </svg>
);

function FitnessData() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("access_token") !== null;
  });
  const [fitnessData, setFitnessData] = useState(() => {
    const storedData = localStorage.getItem("fitnessData");
    return storedData ? JSON.parse(storedData) : {};
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.oauth2
      ) {
        await initClient();
      } else {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initClient;
        script.onerror = (error) => {
          console.error(
            "Error loading Google Identity Services script:",
            error
          );
        };
        document.body.appendChild(script);
      }
    };

    initializeApp();
  }, []);
  async function initClient() {
    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    ) {
      console.error("Google Identity Services not available");
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: dataTypes.map((dt) => dt.scope).join(" "),
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setIsAuthenticated(true);
            localStorage.setItem("access_token", tokenResponse.access_token);
            fetchAllFitnessData(tokenResponse.access_token);
          }
        },
      });

      window.tokenClient = client;

      const storedAccessToken = localStorage.getItem("access_token");
      if (storedAccessToken) {
        fetchAllFitnessData(storedAccessToken);
      }
    } catch (error) {
      console.error(
        "Error initializing Google Identity Services client",
        error
      );
    }
  }
  function updateSigninStatus(isSignedIn) {
    setIsAuthenticated(isSignedIn);
    if (isSignedIn) {
      fetchAllFitnessData();
    } else {
      setFitnessData({});
    }
  }
  function handleAuthClick() {
    if (!isAuthenticated) {
      if (window.tokenClient) {
        window.tokenClient.requestAccessToken();
      } else {
        console.error("Token client not initialized");
      }
    } else {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.oauth2
      ) {
        window.google.accounts.oauth2.revoke(
          localStorage.getItem("access_token"),
          () => {
            setIsAuthenticated(false);
            setFitnessData({});
            localStorage.removeItem("access_token");
            localStorage.removeItem("fitnessData");
          }
        );
      } else {
        console.error("Google Identity Services not available for sign out");
      }
    }
  }
  async function fetchAllFitnessData(accessToken) {
    setIsLoading(true);
    const newFitnessData = { ...fitnessData };
    for (let dataType of dataTypes) {
      const data = await fetchFitnessData(dataType, accessToken);
      if (data && data.length > 0) {
        newFitnessData[dataType.name] = data;
      }
    }
    setFitnessData(newFitnessData);
    localStorage.setItem("fitnessData", JSON.stringify(newFitnessData));
    setIsLoading(false);
  }
  async function fetchFitnessData(dataType, accessToken) {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const response = await fetch(
        `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregateBy: [{ dataTypeName: dataType.type }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime.getTime(),
            endTimeMillis: now.getTime(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return processResult(result, dataType);
    } catch (error) {
      console.error(`Error fetching ${dataType.name} data:`, error);
      return null;
    }
  }
  function processResult(result, dataType) {
    if (result.bucket && result.bucket.length > 0) {
      return result.bucket
        .map((bucket) => {
          const dataset = bucket.dataset[0];
          if (dataset && dataset.point && dataset.point.length > 0) {
            const point = dataset.point[0];
            if (point.value && point.value.length > 0) {
              const value = point.value[0];
              return {
                startTime: new Date(parseInt(bucket.startTimeMillis)),
                endTime: new Date(parseInt(bucket.endTimeMillis)),
                value:
                  value.intVal !== undefined
                    ? value.intVal
                    : value.fpVal !== undefined
                    ? value.fpVal.toFixed(2)
                    : value.stringVal !== undefined
                    ? value.stringVal
                    : "N/A",
              };
            }
          }
          return null;
        })
        .filter((item) => item !== null);
    }
    return [];
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        isAuthenticated={isAuthenticated}
        handleAuthClick={handleAuthClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <FitnessDashboard
              fitnessData={fitnessData}
              dataTypes={dataTypes}
              itemVariants={itemVariants}
            />
          </motion.div>
        ) : (
          <Welcome
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
      </main>
     
      <AnimatePresence>{isLoading && <LoadingOverlay />}</AnimatePresence>
    </div>
  );
}

function Header({ isAuthenticated, handleAuthClick }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 className="text-2xl sm:text-3xl font-semibold flex items-center">
          <Link to="/">  <GoogleFitIcon /></Link>

            <span className="ml-2 text-gray-700"> FitBite Dashboard</span>
          </motion.h1>
          <motion.div className="flex items-center">
            <motion.button
              onClick={handleAuthClick}
              className={`flex items-center px-4 py-2 rounded-md text-sm sm:text-base ${
                isAuthenticated
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition duration-300 shadow`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAuthenticated ? (
                <>
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </>
              ) : (
                <>
                  <FaGoogle className="mr-2" /> Sign In
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
function FitnessDashboard({ fitnessData, dataTypes, itemVariants }) {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine /> },
    { name: "Activity", icon: <FaRunning /> },
    { name: "Insights", icon: <FaInfoCircle /> },
    { name: "Knowledge", icon: <FaNewspaper /> },
    { name: "Challenges", icon: <FaMedal /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <>
            <DataOverview
              fitnessData={fitnessData}
              dataTypes={dataTypes}
              itemVariants={itemVariants}
            />
            <div className=" mt-8"></div>
            <WeeklyOverview itemVariants={itemVariants} />
          </>
        );
      case "Activity":
        return <ActivityTimeline itemVariants={itemVariants} />;
      case "Insights":
        return <InsightsSection itemVariants={itemVariants} />;
      case "Knowledge":
        return <KnowledgeSection itemVariants={itemVariants} />;
      case "Challenges":
        return <ChallengesSection itemVariants={itemVariants} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden"
      variants={itemVariants}
    >
      {/* Cool Sidebar */}
      <div className="w-1/4 bg-gradient-to-b from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">Fitness Menu</h2>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center space-x-2 cursor-pointer hover:bg-white hover:bg-opacity-20 p-2 rounded transition duration-300 ${
                activeSection === item.name ? "bg-white bg-opacity-20" : ""
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {activeSection}
        </h2>
        {renderContent()}
      </div>
    </motion.div>
  );
}
function DataOverview({ fitnessData, dataTypes, itemVariants }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {dataTypes.map((dataType) => (
        <motion.div
          key={dataType.name}
          className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center mb-2">
            {React.cloneElement(dataType.icon, {
              className: `text-2xl ${dataType.color.replace("bg-", "text-")}`,
            })}
            <h3 className="text-lg font-medium ml-2 text-gray-700">
              {dataType.name}
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {fitnessData[dataType.name] && fitnessData[dataType.name].length > 0
              ? `${
                  fitnessData[dataType.name][
                    fitnessData[dataType.name].length - 1
                  ].value
                } ${dataType.name === "Weight" ? "kg" : ""}`
              : dataType.defaultValue}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
function ActivityTimeline({ itemVariants }) {
  const activities = [
    {
      time: "6:00 AM",
      activity: "Morning Run",
      icon: <FaRunning />,
      color: "text-green-500",
    },
    {
      time: "8:00 AM",
      activity: "Breakfast",
      icon: <MdRestaurant />,
      color: "text-yellow-500",
    },
    {
      time: "10:00 AM",
      activity: "Cycling",
      icon: <MdDirectionsBike />,
      color: "text-blue-500",
    },
    {
      time: "1:00 PM",
      activity: "Lunch",
      icon: <MdRestaurant />,
      color: "text-yellow-500",
    },
    {
      time: "4:00 PM",
      activity: "Gym Workout",
      icon: <GiWeightLiftingUp />,
      color: "text-red-500",
    },
    {
      time: "7:00 PM",
      activity: "Dinner",
      icon: <MdRestaurant />,
      color: "text-yellow-500",
    },
    {
      time: "9:00 PM",
      activity: "Meditation",
      icon: <GiMeditation />,
      color: "text-purple-500",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      variants={itemVariants}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <IoMdTrendingUp className="mr-2" /> Activity Timeline
      </h3>
      <div className="space-y-4">
        {activities.map((item, index) => (
          <motion.div
            key={index}
            className="flex  items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`rounded-full p-2 ${item.color} mr-4`}>
              {React.cloneElement(item.icon, { className: "text-xl" })}
            </div>
            <div className="bg-gray-100 rounded-md p-3 flex-grow">
              <p className="font-medium">{item.time}</p>
              <p className="text-gray-600">{item.activity}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function WeeklyOverview({ itemVariants }) {
  const weekData = [
    { day: "Mon", steps: 8000, calories: 2100 },
    { day: "Tue", steps: 10000, calories: 2300 },
    { day: "Wed", steps: 7500, calories: 2000 },
    { day: "Thu", steps: 9000, calories: 2200 },
    { day: "Fri", steps: 11000, calories: 2400 },
    { day: "Sat", steps: 6000, calories: 1900 },
    { day: "Sun", steps: 8500, calories: 2150 },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      variants={itemVariants}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaChartLine className="mr-2" /> Weekly Overview
      </h3>
      <div className="grid grid-cols-7 gap-4">
        {weekData.map((day, index) => (
          <div key={index} className="text-center">
            <div className="font-medium text-gray-700">{day.day}</div>
            <div className="mt-2 h-32 bg-blue-100 rounded-t-lg relative">
              <div
                className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                style={{ height: `${(day.steps / 12000) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">{day.steps} steps</div>
            <div className="text-xs text-gray-500">{day.calories} cal</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
function InsightsSection({ itemVariants }) {
  const insights = [
    {
      icon: <FaDumbbell />,
      title: "Strength Training",
      description: "You've increased your lifting capacity by 10% this month.",
    },
    {
      icon: <FaAppleAlt />,
      title: "Nutrition",
      description:
        "Your protein intake has improved, leading to better muscle recovery.",
    },
    {
      icon: <FaBed />,
      title: "Sleep Quality",
      description:
        "Your average sleep duration has increased to 7.5 hours per night.",
    },
    {
      icon: <FaRunning />,
      title: "Cardio Performance",
      description:
        "Your resting heart rate has decreased by 5 bpm in the last 30 days.",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      variants={itemVariants}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Fitness Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-4 shadow-md border border-gray-200"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex items-center mb-3">
              {React.cloneElement(insight.icon, {
                className: "text-3xl text-blue-500 mr-3",
              })}
              <h3 className="text-lg font-medium text-gray-700">
                {insight.title}
              </h3>
            </div>
            <p className="text-gray-600">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function KnowledgeSection({ itemVariants }) {
  const articles = [
    {
      title: "The Benefits of High-Intensity Interval Training",
      icon: <FaRunning />,
    },
    {
      title: "Nutrition Basics: Macronutrients Explained",
      icon: <IoMdNutrition />,
    },
    {
      title: "Sleep and Recovery: Why They Matter for Fitness",
      icon: <RiZzzFill />,
    },
    { title: "Understanding Your Heart Rate Zones", icon: <FaHeartbeat /> },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      variants={itemVariants}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Fitness Knowledge Hub
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 rounded-lg p-4 flex items-start"
            whileHover={{ scale: 1.03 }}
          >
            {React.cloneElement(article.icon, {
              className: "text-3xl text-blue-500 mr-3 mt-1",
            })}
            <div>
              <h3 className="text-lg font-medium mb-2">{article.title}</h3>
              <p className="text-gray-600">
                Learn more about this topic and how it can improve your fitness
                journey.
              </p>
              <a
                href="#"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Read more
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function ChallengesSection({ itemVariants }) {
  const challenges = [
    {
      title: "30-Day Plank Challenge",
      icon: <FaMedal />,
      participants: 1234,
      daysLeft: 7,
    },
    {
      title: "10K Steps Daily",
      icon: <GiFootprint />,
      participants: 5678,
      daysLeft: 14,
    },
    {
      title: "Healthy Eating Week",
      icon: <MdRestaurant />,
      participants: 3456,
      daysLeft: 3,
    },
    {
      title: "Mindfulness Marathon",
      icon: <RiMentalHealthLine />,
      participants: 2345,
      daysLeft: 21,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      variants={itemVariants}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Fitness Challenges
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 rounded-lg p-4"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center mb-3">
              {React.cloneElement(challenge.icon, {
                className: "text-3xl text-blue-500 mr-3",
              })}
              <h3 className="text-lg font-medium">{challenge.title}</h3>
            </div>
            <p className="text-gray-600 mb-2">
              {challenge.participants} participants
            </p>
            <p className="text-gray-600 mb-3">{challenge.daysLeft} days left</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
              Join Challenge
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function Welcome({ containerVariants, itemVariants }) {
  return (
    <motion.div
      className="text-center mt-12"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
    
      <h2 className="text-6xl font-semibold text-gray-800 mb-4 flex justify-center ">
      <motion.svg
        enableBackground="new 0 0 236.2 200"
        id="Layer_1"
        version="1.1"
        viewBox="0 0 236.2 200"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="180" 
        height="180"
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <g>
          <motion.path
            d="M22.6,105.8l11.9,11.9l25.7-25.6L48.4,80.2l0,0L43,74.8c-4.3-4.3-6.6-9.9-6.6-16c0-5.3,1.8-10.1,4.9-13.9   l0,0l0,0l0,0l0,0c4.2-5.3,10.6-8.7,17.8-8.7c6.1,0,11.7,2.4,16.1,6.7l5.3,5.1L92.4,60l25.8-25.6l-12-11.9l-5.4-5.2   C90.1,6.6,75.4,0,59.1,0C26.4,0,0,26.4,0,58.9C0,67,1.6,74.7,4.6,81.8c3,7.1,7.3,13.4,12.7,18.7L22.6,105.8"
            fill="#EA4335"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.polyline
            fill="#FBBC04"
            points="81.5,122.2 118.2,85.7 92.4,60 60.2,92.1 60.2,92.1 34.5,117.7 48.3,131.6 60.2,143.4 72.6,131"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.polygon
            fill="#34A853"
            points="143.8,175.6 201.8,117.7 176,92.1 118.1,149.9 85.9,117.8 60.2,143.4 92.4,175.6 92.3,175.7    118.1,200 118.1,200 118.1,200 143.9,175.6 143.9,175.6  "
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          />
          <motion.path
            d="M218.9,100.5c12-12,18.9-30.4,17-49c-2.8-28.2-26.2-49.4-54.6-51.3c-17.9-1.2-34.3,5.5-45.9,17.1L92.4,60   l25.7,25.7l43-42.8c5.2-5.1,12.4-7.5,19.8-6.3c9.6,1.5,17.4,9.4,18.7,19c1,7.2-1.4,14.2-6.5,19.3L176,92.1l25.8,25.6L218.9,100.5z"
            fill="#4285F4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1.5 }}
          />
        </g>
      </motion.svg>
     
      </h2>
      <p className="text-xl text-gray-600 mb-8 font-semibold">
        Sign in to access your personalized fitness dashboard and start your
        journey to a healthier you.
      </p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        variants={containerVariants}
      >
        {[
          {
            icon: <FaChartLine />,
            title: "Track Progress",
            description:
              "Monitor your fitness metrics and see your improvement over time.",
          },
          {
            icon: <FaUserCircle />,
            title: "Personalized Insights",
            description:
              "Get tailored recommendations based on your activity and goals.",
          },
          {
            icon: <FaCalendarAlt />,
            title: "Join Challenges",
            description:
              "Participate in community challenges to stay motivated and engaged.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-6"
            variants={itemVariants}
          >
            {React.cloneElement(item.icon, {
              className: "text-4xl text-blue-500 mb-4 mx-auto",
            })}
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
function LoadingOverlay() {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-8 shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Loading your fitness data...
        </h3>
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </motion.div>
    </motion.div>
  );
}


export default FitnessData;
