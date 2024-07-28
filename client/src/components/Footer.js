import { motion } from "framer-motion";
import { FaCoffee, FaReact } from "react-icons/fa";

const Footer = () => {
  const iconVariants = {
    hover: { scale: 1.2, rotate: 360, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hover: { scale: 1.1, color: "#60A5FA", transition: { duration: 0.3 } },
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-gray-300 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        <motion.div
          className="flex items-center space-x-2 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            variants={textVariants}
            whileHover="hover"
            className="text-lg font-semibold"
          >
            Made with
          </motion.span>
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            className="text-red-500"
          >
            <FaCoffee />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex space-x-4 mb-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <FaReact className="text-blue-400 text-2xl" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-center"
        >
          © {new Date().getFullYear()} FitBite. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
