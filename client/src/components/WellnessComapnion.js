import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaPaperPlane, FaComments } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyCl1TuHfx8HGdGCj6D-ZSTQSdCKEjX_IYg";

const WellnessCompanion = () => {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    const newConversation = [...conversation, { role: "user", content: userInput }];
    setConversation(newConversation);
    setUserInput("");

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `
        Act as a supportive and empathetic listener for a woman who wants to share her thoughts or feelings. 
        Your role is to provide a safe space for expression, offer gentle encouragement, and provide 
        uplifting perspectives when appropriate. Respond to the following input in a caring, 
        non-judgmental manner:

        User: ${userInput}

        Remember to:
        1. Acknowledge her feelings
        2. Offer empathy and understanding
        3. Provide gentle encouragement if needed
        4. Suggest positive perspectives or coping strategies if appropriate
        5. Remind her of her strength and resilience
        6. Keep the response concise but warm (about 2-3 sentences)
      `;

      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();

      setConversation([...newConversation, { role: "assistant", content: text }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setConversation([
        ...newConversation,
        { role: "assistant", content: "I'm sorry, I'm having trouble responding right now. Can we try again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 bg-pink-500 text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 bg-pink-50 p-4 rounded-lg shadow-lg w-80 z-40"
          >
            <h2 className="text-xl font-bold mb-4 text-pink-600 flex items-center">
              <FaHeart className="mr-2" /> Wellness Companion
            </h2>

            <div className="bg-white p-2 rounded-lg shadow-md mb-4 h-60 overflow-y-auto">
              {conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-2 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg text-sm ${
                      message.role === "user"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {message.content}
                  </span>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-grow p-2 rounded-l-lg border-2 border-pink-300 focus:outline-none focus:border-pink-500 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-pink-500 text-white p-2 rounded-r-lg"
                disabled={isLoading}
              >
                <FaPaperPlane />
              </motion.button>
            </form>

            {isLoading && (
              <div className="flex justify-center items-center mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WellnessCompanion;