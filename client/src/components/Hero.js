import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
} from "framer-motion";
import {
  FaArrowRight,
  FaHeartbeat,
  FaApple,
  FaBrain,
  FaRunning,
  FaLeaf,
} from "react-icons/fa";
import { GiMeditation, GiDna1 } from "react-icons/gi";
import axios from "axios";
const iconColors = [
  "text-red-500",
  "text-blue-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-orange-500",
  "text-teal-500",
];
const HeroSection = () => {
  const controls = useAnimation();
  const [userCount, setUserCount] = useState(0);
  const fetchUserCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/totalUsers`
      );
      setUserCount(response.data.message ? 0 : response.data.count);
    } catch (error) {
      console.error("Error fetching user count:", error);
      setUserCount(0);
    }
  };

  useEffect(() => {
    fetchUserCount();
    controls.start((i) => ({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2, delay: i * 0.2 },
    }));
  }, [controls]);

  const IconBubble = ({ Icon, top, left, delay, color }) => (
    <motion.div
      className="absolute z-10 hidden sm:block"
      style={{ top, left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", delay }}
    >
      <motion.div
        className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center sm:hidden lg:flex"
        whileHover={{ scale: 1.1}}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Icon className={`text-xl sm:text-2xl md:text-3xl ${color}`} />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-6 text-center lg:text-left"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Revolutionize Your
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Health Journey
              </motion.span>
            </motion.h1>
            <motion.p
              className="mt-6 text-xl lg:text-2xl text-gray-600 z-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Embark on a transformative wellness adventure with AI-driven
              nutrition plans and expert guidance.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <AnimatedButton
                text="Start Your Journey"
                icon={<FaArrowRight className="ml-2" />}
                primary
              />
              <AnimatedButton text="Learn More" />
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-12 lg:mt-0 lg:col-span-6 relative"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.img
              className="relative rounded-lg shadow-2xl items-center justify-center w-full h-full object-cover object-center"
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTc2ZGZwdnFkcGVrMG9tcnFyNmgxa3l4aDA1bXMwaXNkdDM5aGlxaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/05lXpzQa3rmksKJfOn/giphy.gif"
              alt="Healthy Food"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
            <AnimatedCounter count={userCount} />
          </motion.div>
        </div>
      </div>

{/* Floating icons */}
<IconBubble Icon={FaHeartbeat} top="5%" left="5%" delay={0.2} color={iconColors[0]} />
<IconBubble Icon={FaApple} top="75%" left="80%" delay={0.4} color={iconColors[1]} />
<IconBubble Icon={GiMeditation} top="20%" left="90%" delay={0.6} color={iconColors[2]} />
<IconBubble Icon={GiDna1} top="80%" left="20%" delay={0.8} color={iconColors[3]} />
<IconBubble Icon={FaBrain} top="60%" left="40%" delay={1.2} color={iconColors[4]} />
<IconBubble Icon={FaRunning} top="30%" left="30%" delay={1.2} color={iconColors[5]} />
<IconBubble Icon={FaLeaf} top="10%" left="50%" delay={2} color={iconColors[6]} />

      {/* Background shapes */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-green-200 rounded-full opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-200 rounded-full opacity-50"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </motion.section>
  );
};

const AnimatedButton = ({ text, icon, primary }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,128,0)" }}
    whileTap={{ scale: 0.95 }}
    className={` cursor-pointer inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold transition duration-300 z-10 ${
      primary
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:shadow-xl"
        : "bg-white text-gray-800 border-2 border-gray-200 hover:border-green-400"
    }`}
  >
    <motion.span
      initial={{ x: 0 }}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {text}
    </motion.span>
    {icon && (
      <motion.span
        className="ml-2 "
        initial={{ x: 0, opacity: 0 }}
        whileHover={{ x: 5, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.span>
    )}
  </motion.button>
);

const AnimatedCounter = ({ count }) => {
  return (
    <motion.div
      className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-xl"
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
    >
      <motion.p
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {count.toLocaleString()}+
      </motion.p>
      <p className="text-gray-600 font-semibold">Happy Users</p>
    </motion.div>
  );
};

export default HeroSection;
