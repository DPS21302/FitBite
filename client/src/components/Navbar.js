import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaAppleAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
const GEMINI_API_KEY = `${process.env.REACT_APP_GOOGLE_API_KEY}`;

const Navbar = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const auth = getAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 100);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    if (!isLoggedIn) {
      // toast.error('You must be signed in to access this Feature');
      navigate('/login');
      return;
    }
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
    setSearchResults("");
  };

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
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-full py-4 z-40 bg-white shadow-lg border-b border-gray-200"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaAppleAlt className="text-4xl text-[#609a33]" />
              </motion.div>
              <span className="text-3xl font-bold text-gray-800">
                Fit<span className="text-[#609a33]">Bite</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {["Home", "Feature", "Process", "FAQs", "Testimonial"].map(
                (item) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-[#609a33] transition-colors duration-300 font-medium"
                    >
                      {item}
                    </a>
                  </motion.div>
                )
              )}
            </nav>

            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSearch}
                className="text-xl text-gray-600 hover:text-[#609a33] transition-colors duration-300 hidden md:flex"
                aria-label="Search"
              >
                <FaSearch />
              </motion.button>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full ring-2 ring-[#609a33] cursor-pointer overflow-hidden hidden md:flex"
                  onClick={toggleDropdown}
                >
                  {user?.photoURL ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user.photoURL}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#609a33] flex items-center justify-center text-white text-lg font-bold">
                      {user?.email ? user.email[0].toUpperCase() : "?"}
                    </div>
                  )}
                </motion.div>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50"
                  >
                    <Link
                      to="/myprofile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/women-segment">
                  <motion.div
                    className="absolute inset-0 bg-pink-500 rounded-full opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="relative z-10 p-2 rounded-full bg-white"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaHandHoldingHeart className="text-3xl text-pink-500" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="md:hidden text-2xl text-gray-600 hover:text-[#609a33] transition-colors duration-300"
                aria-label="Toggle Menu"
              >
                <FaBars />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <nav
        className={`fixed top-[72px] left-0 w-full bg-white shadow-md overflow-hidden md:hidden z-40 transition-all duration-300 ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="py-2">
          {["Home", "About Us", "Shop", "Blog", "Contact Us"].map(
            (item, index) => (
              <li
                key={item}
                className={index !== 4 ? "border-b border-gray-100" : ""}
              >
                <Link
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="block px-4 py-2 text-[#609a33] hover:bg-[#609a33] hover:text-white transition-colors"
                  onClick={toggleMenu}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
        <ul className="py-2">
        <div className="flex items-center space-x-6 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSearch}
                className="text-xl text-gray-600 hover:text-[#609a33] transition-colors duration-300"
                aria-label="Search"
              >
                <FaSearch />
              </motion.button>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full ring-2 ring-[#609a33] cursor-pointer overflow-hidden"
                  onClick={toggleDropdown}
                >
                  {user?.photoURL ? (
                    <img
                      className="w-full h-full object-cover"
                      src={user.photoURL}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#609a33] flex items-center justify-center text-white text-lg font-bold">
                      {user?.email ? user.email[0].toUpperCase() : "?"}
                    </div>
                  )}
                </motion.div>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50"
                  >
                    <Link
                      to="/myprofile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
              
</div>
</ul>
      </nav>

      {/* Search Box */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center px-4 z-50 transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="relative w-full max-w-3xl">
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full text-3xl text-white bg-transparent border-b-2 border-[#609a33] py-4 pr-16 focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl text-[#609a33] hover:text-white transition-colors"
            aria-label="Submit search"
          >
            <FaSearch />
          </button>
        </div>
        <button
          onClick={toggleSearch}
          className="absolute top-4 right-4 text-3xl text-white hover:text-[#609a33] transition-colors cursor-pointer"
          aria-label="Close search"
        >
          <FaTimes />
        </button>
      </div>

      {isLoggedIn && (
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
                      className="w-full text-xl text-gray-800 bg-transparent border-b-2 border-[#609a33] py-2 pr-12 focus:outline-none focus:border-[#4c7a29] transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-[#609a33] hover:text-[#4c7a29] transition-colors"
                      aria-label="Search"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </form>
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#609a33]"></div>
                    </div>
                  ) : (
                    <ReactMarkdown className="prose max-w-none">
                      {displayedText}
                    </ReactMarkdown>
                  )}
                </div>
                <button
                  onClick={toggleSearch}
                  className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-[#609a33] transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <FaTimes />
                </button>
              </motion.div>
              
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Navbar;
