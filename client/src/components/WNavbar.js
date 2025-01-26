import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUser, FaLightbulb, FaAppleAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // Assuming you're using React Router
const GEMINI_API_KEY = `${process.env.REACT_APP_GOOGLE_API_KEY}`;
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSelector, useDispatch } from "react-redux";

const WNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [dailyTip, setDailyTip] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const navItems = [
    { name: "Home", path: "/women-segment" },
    { name: "Lifecycle", path: "/women-segment" },
    { name: "Disease", path: "/women-segment" },
    { name: "FAQs", path: "/women-segment" },
  ];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const tips = [
    "Drink an extra glass of water today!",
    "Try a 5-minute meditation session.",
    "Incorporate more leafy pinks in your meals.",
    "Take a short walk to boost your mood.",
    "Practice deep breathing for stress relief.",
  ];
  const typeText = (text, speed = 30) => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
    setSearchResults("");
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSearchResults("");
    setDisplayedText("");

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([searchQuery]);
      const response = await result.response;
      const text = await response.text();
      setSearchResults(text);
      setIsLoading(false);
      typeText(text);
    } catch (error) {
      console.error("Error generating search results:", error);
      setIsLoading(false);
      typeText("An error occurred while searching. Please try again.");
    }
  };
  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaAppleAlt className="text-4xl text-pink-500" />
              </motion.div>
              <span className="text-3xl font-bold text-gray-800">
                Fit<span className="text-pink-500">Bite</span>
              </span>
            </Link>

         

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
             {/* Navigation Items */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-lg font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSearch}
                className="text-xl text-gray-600 hover:text-pink-500 transition-colors duration-300 hidden md:flex"
                aria-label="Search"
              >
                <FaSearch />
              </motion.button>
              <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center px-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-6"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Ask me anything..."
                  className="w-full text-xl text-gray-800 bg-transparent border-b-2 border-pink-500 py-2 pr-12 focus:outline-none focus:border-pink-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-pink-500 hover:text-pink-600 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <div className="prose max-w-none">{displayedText}</div>
              )}
            </div>
            <button
              onClick={toggleSearch}
              className="absolute top-2 right-2 text-4xl text-gray-600 hover:text-gray-800 transition-colors cursor-pointer -mt-3"
              aria-label="Close search"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <div className="relative">
              

               
              </div>
                        <div
              className="relative hidden md:flex"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              <FaLightbulb className="text-gray-600 hover:text-pink-600 cursor-pointer text-2xl " />
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 w-48 p-2 mt-3 text-sm text-white bg-pink-400 rounded-md shadow-lg lg:-right-[100px]"
                  >
                    <p>Daily Tip: {dailyTip}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full ring-2 ring-pink-600 cursor-pointer overflow-hidden"
                >
                  {user?.photoURL ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user.photoURL}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="w-full h-full bg-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {user?.email ? user.email[0].toUpperCase() : "?"}
                    </div>
                  )}
                </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
            
          </div>
         
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:bg-pink-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSearch}
                className="text-xl text-gray-600 hover:text-pink-500 transition-colors duration-300 ml-4 mb-2"
                aria-label="Search"
              >
                <FaSearch />
              </motion.button>
              <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center px-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-6"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Ask me anything..."
                  className="w-full text-xl text-gray-800 bg-transparent border-b-2 border-pink-500 py-2 pr-12 focus:outline-none focus:border-pink-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-pink-500 hover:text-pink-600 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </form>
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <div className="prose max-w-none">{displayedText}</div>
              )}
            </div>
            <button
              onClick={toggleSearch}
              className="absolute top-2 right-2 text-4xl text-gray-600 hover:text-gray-800 transition-colors cursor-pointer -mt-3"
              aria-label="Close search"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
            <div
              className="relative"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
            >
              
              <FaLightbulb className="text-gray-600 hover:text-pink-600 cursor-pointer text-2xl ml-4" />
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-30 w-full p-2  text-sm text-white bg-pink-400 rounded-md shadow-lg lg:-right-[100px]"
                  >
                    <p>Daily Tip: {dailyTip}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    
    </motion.nav>
  );
};

export default WNavbar;