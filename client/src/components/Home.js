import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAppleAlt,
  FaUser,
  FaChartLine,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaQrcode,
  FaPercentage,
  FaHeartbeat,
  FaKeyboard,
  FaBalanceScale,
  FaLeaf,
  FaClock,
  FaBrain,
  FaRunning,
} from "react-icons/fa";
import { GiMeal, GiMuscleUp, GiBodyHeight, GiWeight } from "react-icons/gi";
import HeroSection from "./Hero";
import DietList from "./DietList";
import React, { useState } from 'react';

const GoogleFitIcon = () => (
  <svg
    enableBackground="new 0 0 236.2 200"
    id="Layer_1"
    version="1.1"
    viewBox="0 0 236.2 200"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
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
const Home = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // if (!isLoggedIn || !user.emailVerified) {
  //   navigate("/login");
  //   return null;
  // }

  return (
    <div className="overflow-x-hidden"
    id="home">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DietList />
      <HowItWorksSection />
      <FAQSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icons: [
        {
          icon: GiBodyHeight,
          label: "BMI",
          link: "/bmi",
          color: "text-blue-600",
        },
        { icon: GiWeight, label: "BMR", link: "/bmr", color: "text-green-600" },
        {
          icon: FaPercentage,
          label: "Body Fat",
          link: "/bodyfat",
          color: "text-red-600",
        },
      ],
      text: "Calculators",
      description: "BMI, BMR, and Body Fat calculators",
    },
    {
      icon: FaHeartbeat,
      text: "Diet Recommendation",
      color: "text-purple-600",
      link: "/dietai",
      description: "Personalized diet plans",
    },
    {
      icon: GiMeal,
      text: "Recipe Search",
      color: "text-indigo-600",
      link: "/recipe",
      description: "Find healthy recipes",
    },
    {
      icons: [
        {
          icon: FaKeyboard,
          label: "Type",
          link: "/nutrition",
          color: "text-orange-600",
        },
        {
          icon: FaQrcode,
          label: "Scan",
          link: "/menuscanner",
          color: "text-teal-600",
        },
      ],
      text: "Nutrition Info",
      description: "Detailed nutritional information",
    },

    {
      icon: FaBalanceScale,
      text: "Calorie Tracker",
      color: "text-yellow-600",
      link: "/calorietracker",
      description: "Track your daily intake calories",
    },
    {
      icon: GoogleFitIcon,
      text: "Google Fit",
      color: "text-pink-600",
      link: "/googlefit",
      description: "Connect with Google Fit",
    },
    {
      icon: FaClock,
      text: "Screen Time",
      color: "text-yellow-800",
      link: "/screentime",
      description: "Screen Time Analyzer",
    },
    {
      icon: FaBrain,
      text: "Mental Wellbeing",
      color: "text-pink-600",
      link: "/mentalwellbeing",
      description: "Mental Wellbeing Tracker",
    },
    {
      icon: FaLeaf,
      text: "Carbon Footprint",
      color: "text-green-600",
      link: "/carbonfootprint",
      description: "Carbon Footprint Calculator",
    },
    {
      icon: FaRunning,
      text: "Exercise",
      color: "text-red-600",
      description: "Personalized Exercise suggestions",
      link: "/exercise",
    },
  ];

  return (
    <motion.section
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      id="feature"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 text-center mb-12"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Our Features
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.icons ? (
                <div className="flex justify-center space-x-4 mb-6">
                  {item.icons.map((subItem, subIndex) => (
                    <Link to={subItem.link} key={subIndex}>
                      <div className="flex flex-col items-center">
                        <subItem.icon
                          className={`text-4xl mb-2 ${subItem.color}`}
                          whileHover={{ scale: 1.03 }}
                        />
                        <span className="text-sm">{subItem.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link to={item.link}>
                  <motion.div
                    className={`text-5xl mb-6 ${item.color}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {typeof item.icon === "function" ? (
                      <item.icon />
                    ) : (
                      <item.icon className="text-5xl" />
                    )}
                  </motion.div>
                </Link>
              )}
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                {item.text}
              </h3>
              <p className="text-gray-600 flex-grow">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: FaUser,
      title: "Create Your Profile",
      description:
        "Tell us about your health goals, dietary preferences, and lifestyle.",
      color: "#FF6B6B",
    },
    {
      icon: FaAppleAlt,
      title: "Get Your Plan",
      description:
        "Our AI generates a personalized diet plan tailored to your needs.",
      color: "#4ECDC4",
    },
    {
      icon: FaChartLine,
      title: "Start Your Journey",
      description:
        "Follow your meal plan and track your progress with our easy-to-use app.",
      color: "#45B7D1",
    },
    {
      icon: GiMuscleUp,
      title: "Achieve Your Goals",
      description:
        "Watch as you progress towards your health and fitness goals.",
      color: "#FF8C42",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-b from-gray-50 to-white py-24"
      id="process"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-5xl font-extrabold text-center text-gray-900 mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          Your Journey to a Healthier You
        </motion.h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#FF6B6B] via-[#4ECDC4] to-[#FF8C42]" />
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex items-center mb-24"
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                delay: 0.4 + index * 0.2,
              }}
            >
              <div
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } w-full`}
              >
                <motion.div
                  className="flex-shrink-0 w-32 h-32 rounded-full flex items-center justify-center shadow-lg z-10"
                  style={{ backgroundColor: step.color }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div
                  className={`${
                    index % 2 === 0 ? "ml-8" : "mr-8"
                  } bg-white p-8 rounded-xl shadow-md w-2/3`}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-xl text-gray-600">{step.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah L.",
      quote:
        "This app has completely transformed my relationship with food. I've never felt healthier!",
      avatar: "👩‍🦰",
      rating: 5,
      profession: "Fitness Enthusiast",
      achievement: "Lost 30 lbs in 3 months",
    },
    {
      name: "Mike R.",
      quote:
        "The personalized meal plans are fantastic. I'm losing weight without feeling deprived.",
      avatar: "👨‍🦲",
      rating: 5,
      profession: "Software Engineer",
      achievement: "Gained 10 lbs of muscle",
    },
    {
      name: "Emily T.",
      quote:
        "I love how easy it is to track my progress. It keeps me motivated to stick to my goals.",
      avatar: "👩‍🦱",
      rating: 4,
      profession: "Teacher",
      achievement: "Improved energy levels",
    },
    {
      name: "John S.",
      quote:
        "Using this app helped me understand nutrition better. I feel more confident in my food choices now.",
      avatar: "👨",
      rating: 5,
      profession: "Marketing Manager",
      achievement: "Lowered cholesterol by 15%",
    },
    {
      name: "Sophie M.",
      quote:
        "The support from the community in this app is incredible. It's like having a personal cheerleading squad!",
      avatar: "👩",
      rating: 5,
      profession: "Graphic Designer",
      achievement: "Completed first marathon",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-24 overflow-hidden"
      id="testimonial"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.h2
          className="text-5xl font-extrabold text-center text-white mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          Success Stories
        </motion.h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center"
            >
              <div className="mb-8 md:mb-0 md:mr-12 flex-shrink-0">
                <motion.div
                  className="text-8xl md:text-9xl"
                  initial={{ scale: 0.5, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  {testimonials[currentIndex].avatar}
                </motion.div>
              </div>
              <div className="flex-grow">
                <motion.div
                  className="text-4xl text-indigo-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaQuoteLeft />
                </motion.div>
                <motion.p
                  className="text-2xl md:text-3xl text-gray-700 italic mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {testimonials[currentIndex].quote}
                </motion.p>
                <motion.div
                  className="text-4xl text-indigo-600 text-right mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FaQuoteRight />
                </motion.div>
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {testimonials[currentIndex].profession}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-2xl" />
                      )
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className="mt-4 bg-indigo-100 rounded-full px-4 py-2 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-indigo-800 font-semibold">
                    {testimonials[currentIndex].achievement}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-4 shadow-lg focus:outline-none"
          >
            <FaChevronLeft className="text-2xl text-indigo-600" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-4 shadow-lg focus:outline-none"
          >
            <FaChevronRight className="text-2xl text-indigo-600" />
          </button>
        </div>

        <div className="mt-12 flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the personalized meal plan work?",
      answer:
        "Our AI analyzes your health goals, dietary preferences, and lifestyle to create a tailored meal plan just for you.",
    },
    {
      question: "Can I change my meal plan?",
      answer:
        "Absolutely! You can customize your meal plan at any time to fit your changing needs and preferences.",
    },
    {
      question: "Is the app suitable for people with dietary restrictions?",
      answer:
        "Yes, our app caters to various dietary needs including vegetarian, vegan, gluten-free, and more.",
    },
    {
      question: "How often should I update my progress?",
      answer:
        "We recommend updating your progress weekly for the best results and most accurate adjustments to your plan.",
    },
    {
      question: "What is BMI (Body Mass Index)?",
      answer:
        "BMI is a measurement that indicates whether you are underweight, normal weight, overweight, or obese based on your height and weight.",
    },
    {
      question: "How can I improve my BMI?",
      answer:
        "You can improve your BMI by maintaining a balanced diet, exercising regularly, and monitoring your weight consistently.",
    },
    {
      question: "What is BMR (Basal Metabolic Rate)?",
      answer:
        "BMR is the number of calories your body needs to maintain basic physiological functions while at rest.",
    },
    {
      question: "How can I calculate my BMR?",
      answer:
        "You can use online BMR calculators that consider factors like age, gender, weight, and height to estimate your BMR.",
    },
    {
      question: "Why is BMR important?",
      answer:
        "BMR helps determine your daily calorie needs, which is crucial for weight management and maintaining a healthy metabolism.",
    },
    {
      question: "What is body fat percentage?",
      answer:
        "Body fat percentage is the proportion of fat tissue to lean tissue in your body. It is an important indicator of overall health and fitness.",
    },
    {
      question: "How can I reduce body fat percentage?",
      answer:
        "Reducing body fat percentage involves a combination of regular exercise, a balanced diet, and maintaining a calorie deficit.",
    },
    {
      question: "What is considered a healthy body fat percentage?",
      answer:
        "Healthy body fat percentage ranges vary by age and gender, but generally, lower body fat percentages are associated with better health outcomes.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-b from-white to-gray-50 py-24"
      id="faqs"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-5xl font-extrabold text-center text-gray-900 mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="mt-20 space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                delay: 0.4 + index * 0.1,
              }}
            >
              <motion.button
                className="w-full text-left p-6 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-2xl text-indigo-500" />
                  </motion.div>
                </div>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-600 text-lg p-6 pt-0">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Home;
