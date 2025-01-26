import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAppleAlt,
  FaCarrot,
  FaLeaf,
  FaWeight,
  FaRunning,
  FaCalendarAlt,
  FaUtensils,
  FaApple,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import { GiWaterBottle, GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import { MdRestaurantMenu, MdOutlineTimer } from "react-icons/md";
import { IoMdNutrition, IoIosWater } from "react-icons/io";
import { RiMentalHealthLine } from "react-icons/ri";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const GEMINI_API_KEY = "AIzaSyAUxRJBtaQZDk9dsoz-zbsPVzjXlLlUZqg";

const Gemini = ({ formData }) => {
  const [dietPlan, setDietPlan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const generatePrompt = () => `
    Based on the following user profile, generate a detailed, personalized diet plan:
    
    Age: ${formData.age}
    Gender: ${formData.gender}
    Height: ${formData.height} cm
    Current Weight: ${formData.currentWeight} kg
    Target Weight: ${formData.targetWeight} kg
    Body Frame: ${formData.bodyFrame}
    Medical Conditions: ${formData.medicalConditions.join(", ")}
    Allergies: ${formData.allergies}
    Medications: ${formData.medications}
    Diet Type: ${formData.dietType}
    Preferred Cuisines: ${formData.preferredCuisines.join(", ")}
    Disliked Foods: ${formData.dislikedFoods}
    Favorite Foods: ${formData.favoriteFoods}
    Current Supplements: ${formData.currentSupplements}
    Willingness to Include Supplements: ${formData.supplementWillingness}

    Please provide a detailed diet plan including:
    1. Daily calorie intake recommendation
  2. Macronutrient breakdown (protein, carbs, fats)
  3. Micronutrient breakdown (vitamins, minerals)
  4. Daily, weekly, and monthly meal suggestions (breakfast, lunch, dinner, snacks)
  5. Specific food recommendations based on preferences and restrictions
  6. Supplement recommendations if applicable
  7. Tips for maintaining the diet and reaching the target weight
  8. Exercise recommendations
  9. Hydration tips
  10. Mental well-being tips for successful weight management
  11. Recipe ideas for meals in the plan

    Format the response using Markdown for better readability.
  `;

  const generateDietPlan = async (additionalFeedback = "") => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt =
        generatePrompt() +
        (additionalFeedback
          ? `\n\nAdditional feedback: ${additionalFeedback}`
          : "");
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setDietPlan(text);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setDietPlan(
        "An error occurred while generating your diet plan. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateDietPlan();
  }, [formData]);

  const handleRegenerateClick = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackModal(false);
    generateDietPlan(feedback);
    setFeedback("");
  };

  const sectionIcons = {
    "Daily Calorie Intake": <IoMdNutrition />,
    "Macronutrient Breakdown": <GiMuscleUp />,
    "Meal Plan": <MdRestaurantMenu />,
    "Food Recommendations": <FaApple />,
    "Supplement Recommendations": <GiWaterBottle />,
    Tips: <FaWeight />,
    "Exercise Recommendations": <FaRunning />,
    "Hydration Tips": <IoIosWater />,
    "Mental Well-being Tips": <RiMentalHealthLine />,
    "Recipe Ideas": <FaUtensils />,
  };

  const renderDietPlan = () => {
    const sections = dietPlan.split("\n## ").filter(Boolean);

    return (
      <div id="diet-plan-content">
        {sections.map((section, index) => {
          const [title, ...content] = section.split("\n");
          const icon = sectionIcons[title.trim()] || <FaLeaf />;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-700">
                <span className="mr-2 text-3xl">{icon}</span>
                {title}
              </h2>
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="text-gray-700 mb-3" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-3" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-3" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                }}
              >
                {content.join("\n")}
              </ReactMarkdown>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("My Personalized Diet Plan");
    const body = encodeURIComponent("Check out my personalized diet plan!");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("diet-plan-content");
    if (!input) {
      console.error("Could not find element to convert to PDF");
      return;
    }
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("diet-plan.pdf");
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-8"
    >
      <h2 className="text-4xl font-bold mb-6 text-indigo-700 flex items-center">
        <IoMdNutrition className="mr-2" /> Your Personalized Diet Plan
      </h2>

      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div id="diet-plan-content">{renderDietPlan()}</div>
      )}

      <RegenerateButton onClick={handleRegenerateClick} />
      <FeedbackModal
        showModal={showFeedbackModal}
        feedback={feedback}
        setFeedback={setFeedback}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />
      <ShareSection
        onEmailShare={handleEmailShare}
        onDownloadPDF={handleDownloadPDF}
      />

      <AdditionalSections />
    </motion.div>
  );
};

const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
    <p className="mt-4 text-indigo-700 font-semibold">
      Cooking up your perfect diet plan...
    </p>
    <div className="flex mt-4">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <FaAppleAlt className="text-red-500 text-2xl mx-2" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
      >
        <FaCarrot className="text-orange-500 text-2xl mx-2" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
      >
        <FaLeaf className="text-green-500 text-2xl mx-2" />
      </motion.div>
    </div>
  </div>
);

const RegenerateButton = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 mx-auto block mt-8"
    onClick={onClick}
  >
    <FaCalendarAlt className="inline-block mr-2" /> Regenerate Diet Plan
  </motion.button>
);

const FeedbackModal = ({
  showModal,
  feedback,
  setFeedback,
  onClose,
  onSubmit,
}) => (
  <AnimatePresence>
    {showModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
        >
          <h3 className="text-2xl font-bold mb-4 text-indigo-700">
            Provide Feedback
          </h3>
          <textarea
            className="w-full h-32 p-2 border rounded mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="What changes would you like to see in your diet plan?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={onSubmit}
            >
              Submit
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AdditionalSections = () => (
  <div className="mt-12">
    <h3 className="text-3xl font-bold mb-6 text-indigo-700">
      Additional Resources
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <InfoCard
        icon={<MdOutlineTimer />}
        title="Meal Prep Tips"
        text="Save time and stay on track with efficient meal preparation strategies."
      />
      <InfoCard
        icon={<GiWeightLiftingUp />}
        title="Workout Planner"
        text="Complement your diet with a personalized exercise routine."
      />
      <InfoCard
        icon={<BsFillCalendarCheckFill />}
        title="Progress Tracker"
        text="Monitor your journey and celebrate milestones along the way."
      />
    </div>
  </div>
);

const InfoCard = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
  >
    <motion.div
      className="text-4xl text-indigo-500 mb-4"
      animate={{ rotateY: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold mb-2 text-indigo-700">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </motion.div>
);

const ShareSection = ({ onEmailShare, onDownloadPDF }) => (
  <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-4 text-indigo-700">
      Share Your Diet Plan
    </h3>
    <div className="flex flex-wrap justify-center gap-4">
      <SocialShareButton
        icon={<FaFacebookF />}
        color="bg-blue-600"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`,
            "_blank"
          )
        }
      >
        Facebook
      </SocialShareButton>
      <SocialShareButton
        icon={<FaTwitter />}
        color="bg-blue-400"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}&text=${encodeURIComponent(
              "Check out my personalized diet plan!"
            )}`,
            "_blank"
          )
        }
      >
        Twitter
      </SocialShareButton>
      <SocialShareButton
        icon={<FaLinkedinIn />}
        color="bg-blue-700"
        onClick={() =>
          window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              window.location.href
            )}&title=${encodeURIComponent("My Personalized Diet Plan")}`,
            "_blank"
          )
        }
      >
        LinkedIn
      </SocialShareButton>
      <SocialShareButton
        icon={<FaWhatsapp />}
        color="bg-green-500"
        onClick={() =>
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
              "Check out my personalized diet plan! " + window.location.href
            )}`,
            "_blank"
          )
        }
      >
        WhatsApp
      </SocialShareButton>
      <SocialShareButton
        icon={<FaEnvelope />}
        color="bg-red-500"
        onClick={onEmailShare}
      >
        Email
      </SocialShareButton>
      <SocialShareButton
        icon={<FaDownload />}
        color="bg-purple-600"
        onClick={onDownloadPDF}
      >
        Download PDF
      </SocialShareButton>
    </div>
  </div>
);

const SocialShareButton = ({ icon, color, children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`${color} text-white px-4 py-2 rounded-full font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-200 focus:ring-white flex items-center`}
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    {children}
  </motion.button>
);
export default Gemini;
