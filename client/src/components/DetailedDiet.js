import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as AiIcons from "react-icons/ai";
import dietData from "../data/dietData";
import jsPDF from "jspdf";

// Utility function to dynamically import icons
const Icon = ({ name, ...props }) => {
  const IconComponent =
    FaIcons[name] || GiIcons[name] || RiIcons[name] || AiIcons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};

const DetailedDiet = () => {
  const { dietId } = useParams();
  const [diet, setDiet] = useState(null);
  const [showNutritionFacts, setShowNutritionFacts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [buttonColor, setButtonColor] = useState('bg-gradient-to-r from-fuchsia-600 to-pink-600');
  
  const handleButtonClick = () => {
    setShowNutritionFacts(!showNutritionFacts);
    // Toggle button color
    setButtonColor(showNutritionFacts ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600' : 'bg-green-500');
  };
  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    pressed: { scale: 0.95 }
  };

  const foodIcons = [
    "GiApple", "GiBroccoli", "GiCarrot", "GiChickenLeg", "GiFish",
    "GiSlicedBread", "GiWaterBottle", "GiSaltShaker", "GiHoneyJar",
    "GiAvocado", "GiEgg", "GiOlive", "GiTomato", "GiBanana"
  ];


  useEffect(() => {
    // Fetch diet data based on dietId
    const selectedDiet = dietData[dietId];
    if (selectedDiet) {
      setDiet(selectedDiet);
    }
  }, [dietId]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const IconButton = ({ icon, title, onClick }) => (
    <motion.button
      className="text-2xl p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <Icon name={icon} title={title} />
    </motion.button>
  );


  const shareArticle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: diet.title,
          text: `Check out this detailed guide on ${diet.title}!`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      alert(
        "Web Share API is not supported in your browser. You can manually copy the URL to share."
      );
    }
  };

  if (!diet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse animation-delay-400"></div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(diet.title, 10, 10);
    doc.text(diet.introduction, 10, 20);
    // You can add more content here
    doc.save(`${diet.title}.pdf`);
  };

  return (
    <motion.div
      className="bg-gray-100 min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header
        className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white py-24 px-4 relative overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: "auto" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          {foodIcons.map((icon, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 5 + 5,
              }}
            >
              <Icon name={icon} />
            </motion.div>
          ))}
        </motion.div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1
            className="text-6xl font-bold mb-4 text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {diet.title}
          </motion.h1>
          <motion.p
            className="text-xl text-green-100"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {diet.subtitle}
          </motion.p>
          <motion.div
            className="mt-6 flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <IconButton icon="FaShareAlt" title="Share this article" onClick={shareArticle} />
            <IconButton icon="FaPrint" title="Print this article" onClick={handlePrint} />
            <IconButton icon="FaDownload" title="Download as PDF" onClick={handleDownload} />
          </motion.div>
        </div>
      </motion.header>
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-300 z-50">
        <div
          className="h-full bg-green-500"
          style={{ width: `${readingProgress}%` }}></div>
      </div>
      <motion.nav
        className="bg-gradient-to-r from-green-600 to-green-400 shadow-lg sticky top-0 z-40"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-xl font-semibold text-white"
              variants={linkVariants}
            >
              {diet.title} Guide
            </motion.h2>
            <div className="hidden md:flex space-x-4">
              {["principles", "foods", "benefits", "drawbacks"].map((section) => (
                <motion.a
                  key={section}
                  href={`#${section}`}
                  className="text-white hover:text-green-200 transition-colors duration-300"
                  variants={linkVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.a>
              ))}
            </div>
            <motion.button
              className="md:hidden text-white focus:outline-none"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="pressed"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon name={isOpen ? "FaTimes" : "FaBars"} className="text-2xl" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-green-500 absolute w-full z-30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2">
              {["principles", "foods", "benefits", "drawbacks"].map((section) => (
                <motion.a
                  key={section}
                  href={`#${section}`}
                  className="block text-white hover:text-green-200 py-2"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <main className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg mt-8">
        <section className="mb-12">
          <div className="flex flex-wrap items-center text-gray-600 mb-8">
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <Icon name="FaUser" className="mr-2 text-orange-400" />
              <span className="font-medium">
                {diet.author}, {diet.authorTitle}
              </span>
            </div>
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <Icon name="FaClock" className="mr-2 text-orange-400" />
              <span>{diet.readTime}</span>
            </div>
            <div className="flex items-center">
              <Icon name="FaCalendarAlt" className="mr-2 text-orange-400" />
              <span className="font-medium">Updated: {diet.updatedDate}</span>
            </div>
          </div>


          <div className="prose max-w-none">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              {diet.introduction}
            </p>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded mt-8">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Icon
                name="FaLightbulb"
                className="mr-2 text-yellow-500"
              />
              Quick Tip
            </h3>
            <p className="text-gray-700">{diet.quickTip}</p>
          </div>
        </section>

        <section id="principles" className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b-2 border-green-500 pb-2">
            Key Principles of the {diet.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diet.principles.map((principle, index) => (
              <PrincipleCard
                key={index}
                icon={
                  <Icon
                    name={principle.icon}
                    className="text-4xl text-red-500"
                  />
                }
                title={principle.title}
                description={principle.description}
              />
            ))}
          </div>
        </section>

        <section id="foods" className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Foods to Eat and Avoid
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <FoodList
              title="Eat"
              items={diet.foodsToEat}
              icon={
                <Icon
                  name="FaCheckCircle"
                  className="text-green-500"
                />
              }
            />
            <FoodList
              title="Avoid"
              items={diet.foodsToAvoid}
              icon={
                <Icon name="FaBan" className="text-red-500" />
              }
            />
          </div>
        </section>

        <section id="benefits" className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Benefits of the {diet.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diet.benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={
                  <Icon
                    name={benefit.icon}
                    className="text-4xl text-blue-500"
                  />
                }
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </section>

        <section id="drawbacks" className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Potential Drawbacks
          </h2>
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Icon
                name="FaExclamationTriangle"
                className="mr-2 text-red-500"
              />
              Things to Consider
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {diet.drawbacks.map((drawback, index) => (
                <li key={index}>{drawback}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Expert Opinion
          </h2>
          <div className="bg-gray-200 p-6 rounded-lg">
            <Icon
              name="FaQuoteLeft"
              className="text-4xl text-gray-400 mb-4"
            />
            <p className="text-xl text-gray-700 mb-4">
              {diet.expertOpinion.quote}
            </p>
            <p className="text-right font-semibold">
              - {diet.expertOpinion.expert},{" "}
              {diet.expertOpinion.expertTitle}
            </p>
            <Icon
              name="FaQuoteRight"
              className="text-4xl text-gray-400 ml-auto"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Nutrition Facts
          </h2>
          <motion.button
            className={`${buttonColor} text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
          >
            {showNutritionFacts
              ? "Hide Nutrition Facts"
              : "Show Nutrition Facts"}
          </motion.button>
          <AnimatePresence>
            {showNutritionFacts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">
                  Typical Macronutrient Breakdown
                </h3>
                <div className="flex justify-between">
                  <NutritionFact
                    label="Protein"
                    value={diet.nutritionFacts.protein}
                    icon={
                      <Icon
                        name="GiMeat"
                        className="text-2xl text-red-500"
                      />
                    }
                  />
                  <NutritionFact
                    label="Fat"
                    value={diet.nutritionFacts.fat}
                    icon={
                      <Icon
                        name="FaFish"
                        className="text-2xl text-blue-500"
                      />
                    }
                  />
                  <NutritionFact
                    label="Carbs"
                    value={diet.nutritionFacts.carbs}
                    icon={
                      <Icon
                        name="FaAppleAlt"
                        className="text-2xl text-green-500"
                      />
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Getting Started with {diet.title}
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            {diet.gettingStarted.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">
              Sample Meal Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MealCard
                title="Breakfast"
                items={diet.sampleMealPlan.breakfast}
              />
              <MealCard
                title="Lunch"
                items={diet.sampleMealPlan.lunch}
              />
              <MealCard
                title="Dinner"
                items={diet.sampleMealPlan.dinner}
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Frequently Asked Questions
          </h2>
          {diet.faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            {diet.title} Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              icon={
                <Icon
                  name="FaBookmark"
                  className="text-3xl text-green-500"
                />
              }
              title="Recommended Books"
              items={diet.resources.books}
            />
            <ResourceCard
              icon={
                <Icon
                  name="AiOutlineRead"
                  className="text-3xl text-blue-500"
                />
              }
              title="Helpful Websites"
              items={diet.resources.websites}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            User Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diet.testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                age={testimonial.age}
                quote={testimonial.quote}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            {diet.title} Tracker
          </h2>
          <DietTracker />
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Shopping Guide
          </h2>
          <ShoppingGuide items={diet.shoppingList} />
        </section>

        {/* Comments section */}
        <div className="flex items-center justify-between mt-8 border-t pt-8">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-red-600 hover:text-red-800 transition duration-300">
              <Icon name="FaHeart" className="mr-2" /> Like
            </button>
            <button className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300">
              <Icon name="FaShareAlt" className="mr-2" /> Share
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Tags:</span>
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 px-2 py-1 rounded text-base font-medium text-red">
              {diet.title}
            </span>
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 px-2 py-1 rounded text-base font-medium text-red">
              Diet
            </span>
            <span className="bg-gradient-to-r from-amber-200 to-yellow-400 px-2 py-1 rounded text-base font-medium text-red">
              Nutrition
            </span>
          </div>
        </div>
      </main>



      {showScrollTop && (
        <motion.button
          className="fixed bottom-8 right-8 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Icon name="FaArrowUp" />
        </motion.button>
      )}
      {/* </main> */}
    </motion.div>
  );
};



const PrincipleCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-gradient-to-r from-red-100 to-slate-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 "
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}>
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-4">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FoodList = ({ title, items, icon }) => (
  <motion.div
    className="bg-gradient-to-tr from-green-100 to-red-50 p-6 rounded-lg shadow-md flex-1"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {icon}
          <span className="ml-2">{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const BenefitCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}>
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const NutritionFact = ({ label, value, icon }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <h4 className="font-semibold">{label}</h4>
    <p className="text-gray-600">{value}</p>
  </div>
);

const MealCard = ({ title, items }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const FAQItem = ({ question, answer }) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold mb-2 flex items-center">
      <Icon name="FaQuestion" className="mr-2 text-green-500" title="" />
      {question}
    </h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

const ResourceCard = ({ icon, title, items }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold ml-4">{title}</h3>
    </div>
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const TestimonialCard = ({ name, age, quote, rating }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-gray-600 mb-4">"{quote}"</p>
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">
          {name}, {age}
        </p>
      </div>
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Icon name="FaStar" className="text-yellow-400" title="" />
        ))}
      </div>
    </div>
  </div>
);

const DietTracker = () => {
  const [showTracker, setShowTracker] = useState(false);
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState("");

  const addMeal = () => {
    if (newMeal.trim() !== "") {
      setMeals([{ name: newMeal, date: new Date() }, ...meals]);
      setNewMeal("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.button
        onClick={() => setShowTracker(!showTracker)}
        className="w-full bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showTracker ? "Hide" : "Launch"} Diet Tracker
      </motion.button>
      <AnimatePresence>
        {showTracker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-lg border border-white border-opacity-20"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Meal Tracker</h3>
            <div className="flex mb-4">
              <input
                type="text"
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                className="flex-grow p-2 border rounded-l-lg bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter meal..."
              />
              <motion.button
                onClick={addMeal}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Meal
              </motion.button>
            </div>
            <motion.ul className="space-y-2">
              <AnimatePresence>
                {meals.map((meal, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white bg-opacity-40 p-3 rounded-lg shadow-lg flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">{meal.name}</span>
                    <span className="text-sm text-gray-600">
                      {meal.date.toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const ShoppingGuide = ({ items }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md"
    // whileHover={{ scale: 1.05 }}
    // transition={{ duration: 0.3 }}
    >
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <Icon
            name="FaShoppingCart"
            className="text-green-500 mr-2"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);


export default DetailedDiet;
