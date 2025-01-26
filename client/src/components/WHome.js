import React, { useState, useReducer, useRef } from 'react';
import { motion, useAnimation, animate, AnimatePresence } from 'framer-motion';
import WNavbar from './WNavbar';
import WHero from './WHero';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHourglassHalf, FaPauseCircle, FaThermometerHalf, FaBacteria, FaHeartbeat, FaFemale, FaInfoCircle, FaAppleAlt, FaChevronDown, FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight, FaOilCan } from 'react-icons/fa';
import { GiMeditation, GiWeightLiftingUp, GiBodySwapping, GiMedicalThermometer, GiMedicines, GiNightSleep, GiDna1, GiFruitBowl, GiMilkCarton } from 'react-icons/gi';
import { IoIosNutrition, IoMdFlower } from 'react-icons/io';
import { MdPregnantWoman, MdTimeline, MdWaterDrop, MdMood } from 'react-icons/md';
import { RiMentalHealthLine, RiHeartPulseLine, RiPlantLine } from 'react-icons/ri';
import { AiOutlineSchedule, AiFillFire, AiOutlineExperiment } from 'react-icons/ai';
import { TbSalad, TbDna } from 'react-icons/tb';
import { GiMoonOrbit } from 'react-icons/gi';
import WellnessCompanion from './WellnessComapnion';


const LifeStageTimeline = () => {
  const [hoveredPhase, setHoveredPhase] = useState(null);

  const phases = [
    { icon: FaFemale, title: "Menstruation", color: "#FF6B6B", description: "Regular menstrual cycle and reproductive health" },
    { icon: MdPregnantWoman, title: "Pregnancy", color: "#4ECDC4", description: "Fetal development and maternal health" },
    { icon: FaHourglassHalf, title: "Perimenopause", color: "#45B7D1", description: "Transition phase before menopause" },
    { icon: GiMoonOrbit, title: "Menopause", color: "#7F63B8", description: "End of menstrual cycle and hormonal changes" },
  ];

  return (
    <div className="bg-gray-50 py-20 px-4" id='lifecycls'>
      <motion.h2
        className="text-4xl font-bold text-center mb-16 text-teal-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Life's Wellness Journey
      </motion.h2>

      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 h-1 top-1/2 bg-gradient-to-r from-red-300 via-teal-300 to-purple-300 rounded-full" />
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-red-300 via-teal-300 to-purple-300 rounded-full" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            {phases.map((phase, index) => (
              <Link to={`/women-segment/${phase.title.toLowerCase()}`} key={index} className="mb-12 md:mb-0">
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredPhase(index)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer z-10 mx-auto
                              shadow-lg transition-all duration-300 ease-in-out"
                    style={{ backgroundColor: phase.color }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <phase.icon className="text-4xl text-white" />
                  </motion.div>
                  
                  <motion.h3 
                    className="mt-4 font-semibold text-center text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {phase.title}
                  </motion.h3>

                  <AnimatePresence>
                    {hoveredPhase === index && (
                      <motion.div
                        className="absolute left-1/2 md:-left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl mt-4 w-64 z-20"
                        style={{ borderTop: `4px solid ${phase.color}` }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-lg font-bold mb-2" style={{ color: phase.color }}>{phase.title}</h4>
                        <p className="text-sm text-gray-700">{phase.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};





const HealthCategories = () => {
  const categories = [
    { icon: RiMentalHealthLine, title: "PCOS", color: "#20B2AA", link: "pcos" },
    { icon: RiHeartPulseLine, title: "Iron Deficiency Anemia", color: "#CD5C5C", link: "ironDeficiencyAnemia" },
    { icon: AiOutlineExperiment, title: "Breast Cancer", color: "#FF69B4", link: "bcancer" },
    { icon: FaThermometerHalf, title: "Thyroid Disorder", color: "#4682B4", link: "thyroidDisorder" },
    { icon: FaBacteria, title: "UTI", color: "#FFD700", link: "uti" },
    { icon: FaInfoCircle, title: "Osteoporosis", color: "#8FBC8F", link: "osteoporosis" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 text-purple-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Health Categories
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={index} to={`/women-segment/disease/${category.link}`}>
              <motion.div
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 flex flex-col items-center" style={{ backgroundColor: `${category.color}20` }}>
                  <category.icon className="text-5xl mb-4" style={{ color: category.color }} />
                  <h3 className="text-xl font-semibold text-center" style={{ color: category.color }}>
                    {category.title}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};



const IconBubble = ({ Icon, color, size, animate, isSelected, rotation }) => {
  return (
    <motion.div
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation}deg)`,
        boxShadow: isSelected ? '0 0 15px rgba(0,0,0,0.3)' : 'none',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon size={size * 0.6} color="white" />
    </motion.div>
  );
};

const NutritionWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const wheelRef = useRef(null);
  const spinningRef = useRef(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const foods = [
    { name: "Fruits", icon: FaAppleAlt, color: "#FF6B6B", benefits: "Rich in vitamins, fiber, and antioxidants. Boost immune system and support heart health.", tip: "Include a variety of colorful fruits in your diet for diverse nutrients." },
    { name: "Vegetables", icon: TbSalad, color: "#4ECDC4", benefits: "Packed with minerals and phytonutrients. Support digestive health and reduce inflammation.", tip: "Aim for at least 5 servings of vegetables daily, including leafy greens." },
    { name: "Proteins", icon: GiDna1, color: "#45B7D1", benefits: "Essential for muscle repair and hormone production. Support bone health and immune function.", tip: "Include lean meats, fish, eggs, and plant-based proteins like beans and nuts." },
    { name: "Grains", icon: IoIosNutrition, color: "#F9DB6D", benefits: "Provide energy and B vitamins. Support brain function and digestive health.", tip: "Choose whole grains over refined grains for more fiber and nutrients." },
    { name: "Dairy", icon: GiMilkCarton, color: "#8A2BE2", benefits: "Good source of calcium and vitamin D. Support bone health and muscle function.", tip: "If lactose intolerant, consider fortified plant-based alternatives." },
    { name: "Healthy Fats", icon: FaOilCan, color: "#FF9A8B", benefits: "Essential for hormone balance and nutrient absorption. Support brain and heart health.", tip: "Include sources like avocados, nuts, seeds, and olive oil in moderation." },
    { name: "Hydration", icon: MdWaterDrop, color: "#82C0CC", benefits: "Crucial for all bodily functions. Supports skin health and detoxification.", tip: "Aim for at least 8 glasses of water daily, more if physically active." },
    { name: "Superfoods", icon: GiFruitBowl, color: "#FFA62B", benefits: "Nutrient-dense foods with potential health-promoting properties.", tip: "Incorporate foods like berries, leafy greens, and fatty fish into your diet." },
  ];

  const handleSpin = () => {
    if (isSpinning) {
      if (spinningRef.current) {
        spinningRef.current.stop();
      }
      setIsSpinning(false);
      const currentRotation = rotation % 360;
      const snapAngle = Math.round(currentRotation / (360 / foods.length)) * (360 / foods.length);
      setRotation(snapAngle);
      const selectedIndex = (foods.length - Math.round(snapAngle / (360 / foods.length))) % foods.length;
      setSelectedFood(foods[selectedIndex]);
    } else {
      setIsSpinning(true);
      setSelectedFood(null);
      spinningRef.current = animate(wheelRef.current, 
        { rotate: rotation + 360 * 10 },
        { 
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          onUpdate: (latest) => {
            setRotation(latest);
            forceUpdate();
          }
        }
      );
    }
  };

  const handleIconClick = (index) => {
    if (!isSpinning) {
      const targetRotation = 270 - (index * (360 / foods.length));
      setRotation(targetRotation);
      setSelectedFood(foods[index]);

      animate(wheelRef.current, { rotate: targetRotation }, {
        duration: 1,
        ease: "easeInOut",
      });
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto lg:flex lg:items-center lg:justify-between">
      <div className="lg:w-1/2">
        <motion.div 
          ref={wheelRef}
          className="w-96 h-96 mx-auto rounded-full flex items-center justify-center relative"
          style={{ 
            rotate: rotation,
            backgroundColor: '#f0f0f0',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }}
        >
          {foods.map((food, index) => (
            <div
              key={index}
              className="absolute cursor-pointer"
              style={{
                transform: `rotate(${index * (360 / foods.length)}deg) translateX(150px)`,
              }}
            >
              <div onClick={() => handleIconClick(index)}>
                <IconBubble 
                  Icon={food.icon} 
                  color={food.color} 
                  size={60} 
                  animate={false} 
                  isSelected={selectedFood && selectedFood.name === food.name}
                  rotation={-rotation - index * (360 / foods.length)}
                />
              </div>
            </div>
          ))}
          <motion.div
            className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSpin}
            style={{
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
            }}
          >
            {isSpinning ? (
              <FaPauseCircle size={40} color="#FF6B6B" />
            ) : (
              <FaUtensils size={40} color="#45B7D1" />
            )}
          </motion.div>
        </motion.div>
      </div>
           
      <div className="lg:w-1/2 lg:pl-8">
        {selectedFood ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 lg:mt-0 p-6 bg-white rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-2 flex items-center">
              <selectedFood.icon className="mr-2" style={{ color: selectedFood.color }} />
              {selectedFood.name}
            </h3>
            <p className="mb-4"><strong>Benefits:</strong> {selectedFood.benefits}</p>
            <p><strong>Tip for Women's Health:</strong> {selectedFood.tip}</p>
          </motion.div>
        ) : (
          <div className="mt-8 lg:mt-0 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Nutrition Wheel</h3>
            <p>Spin the wheel or click on an icon to learn about different food groups and their benefits for women's health.</p>
          </div>
        )}
      </div>
    </div>
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

const WHome = () => {
  return (
    <div className="overflow-hidden bg-white">
<WNavbar />
<WellnessCompanion />
      <WHero />
      <LifeStageTimeline />
      <HealthCategories />
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-4xl font-bold mb-10 text-center">Balanced Nutrition</h2>
        <NutritionWheel />
      </section>
      <FAQSection />
      <TestimonialsSection />

      
    
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">Women's Wellness Journey</h3>
          <p className="mb-4">Empowering women to take control of their health at every stage of life.</p>
          <div className="flex justify-center space-x-6 mb-6">
            <IconBubble Icon={FaHeartbeat} color="#8B5D5D" size={32} />
            <IconBubble Icon={GiMeditation} color="#5D8B7D" size={32} />
            <IconBubble Icon={RiPlantLine} color="#5D7A8B" size={32} />
          </div>
          <p>&copy; 2024 Women's Wellness Journey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};



export default WHome;