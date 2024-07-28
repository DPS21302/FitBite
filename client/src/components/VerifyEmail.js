import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { MdEmail, MdHelp } from "react-icons/md";

const VerifyEmail = () => {
  const { user } = useSelector((state) => state.auth);
  const [showTips, setShowTips] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900 flex items-center justify-center"
          >
            <FaEnvelope className="mr-2 text-indigo-600" />
            Verify Your Email
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            We've sent a verification email to{" "}
            <span className="font-semibold">{user.email}</span>. Please check
            your inbox and click the verification link to activate your account.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5"
          ></motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            After verifying your email, you can{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              log in
            </a>
            .
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <MdHelp className="mr-2 text-indigo-600" />
            Need Help?
          </h3>
          <button
            onClick={() => setShowTips(!showTips)}
            className="mt-2 text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            {showTips ? "Hide Tips" : "Show Tips"}
          </button>
          {showTips && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 list-disc list-inside text-sm text-gray-600"
            >
              <li>Check your spam or junk folder</li>
              <li>Make sure your email address is correct</li>
              <li>Add our email to your safe senders list</li>
              <li>Contact support if you still haven't received the email</li>
            </motion.ul>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <MdEmail className="mr-2 text-indigo-600" />
            What's Next?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Once your email is verified:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
            <li>Complete your profile</li>
            <li>Set your dietary preferences</li>
            <li>Start exploring personalized meal plans</li>
            <li>Connect with our community</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Having trouble?{" "}
            <a
              href="/contact"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
