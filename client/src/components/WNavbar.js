import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaApple, FaHeartbeat, FaFemale, FaBaby, FaSpa } from "react-icons/fa";
import { MdPregnantWoman, MdMood } from "react-icons/md";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";

const WNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [dailyTip, setDailyTip] = useState("");
  const [mood, setMood] = useState("neutral");

  const navItems = [
    { name: "Home", icon: <FaHeartbeat /> },
    { name: "Menstruation", icon: <FaFemale /> },
    { name: "Pregnancy", icon: <MdPregnantWoman /> },
    { name: "Postpartum", icon: <FaBaby /> },
    { name: "Recipes", icon: <FaApple /> },
  ];

  const moodEmojis = {
    happy: "😊",
    neutral: "😐",
    sad: "😔",
    energetic: "⚡",
    tired: "😴",
  };

  const tips = [
    "Drink an extra glass of water today!",
    "Try a 5-minute meditation session.",
    "Incorporate more leafy greens in your meals.",
    "Take a short walk to boost your mood.",
    "Practice deep breathing for stress relief.",
  ];

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);



  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=
       "bg-pink-100 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 flex items-center"
          >
            <img
              className="h-10 w-10"
              src="/path-to-your-logo.svg"
              alt="Women's Health Logo"
            />
            <span
              className="ml-2 text-2xl font-bold text-pink-600"
            >
              NourishHer
            </span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                whileHover={{ scale: 1.1, color: "#D53F8C" }}
                href="#"
                className="text-gray-700 hover:bg-pink-200
                     px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </motion.a>
            ))}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              <FaSpa
                className="text-2xl text-pink-500 cursor-pointer"
              />
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-pink-500 rounded-md shadow-lg"
                  >
                    <p>Daily Tip: {dailyTip}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <MdMood
                className = "text-2xl text-pink-500 cursor-pointer"
                onClick={() =>
                  setMood(
                    Object.keys(moodEmojis)[
                      (Object.keys(moodEmojis).indexOf(mood) + 1) %
                        Object.keys(moodEmojis).length
                    ]
                  )
                }
              />
              <span className="absolute -top-2 -right-2 text-lg">
                {moodEmojis[mood]}
              </span>
            </motion.div>
            
          </div>
          <div className="-mr-2 flex md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md
               text-gray-700 hover:text-white hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  whileHover={{ scale: 1.05, backgroundColor: "#FED7E2" }}
                  href="#"
                  className="text-gray-700 hover:bg-pink-200 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </motion.a>
              ))}
              <div className="flex justify-between items-center px-3 py-2">
                <div className="flex items-center space-x-2">
                  <FaSpa
                    className="text-xl text-pink-500 cursor-pointer"
                    onClick={() => setShowTip(!showTip)}
                  />
                  <MdMood
                    className="text-xl text-pink-500 cursor-pointer"
                    onClick={() =>
                      setMood(
                        Object.keys(moodEmojis)[
                          (Object.keys(moodEmojis).indexOf(mood) + 1) %
                            Object.keys(moodEmojis).length
                        ]
                      )
                    }
                  />
                  <span className="text-lg">{moodEmojis[mood]}</span>
                </div>
               
              </div>
            </div>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4 py-2 text-sm text-white bg-pink-500"
              >
                <p>Daily Tip: {dailyTip}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default WNavbar;