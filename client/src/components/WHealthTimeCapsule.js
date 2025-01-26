import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSend, FiShare2, FiAlertTriangle } from 'react-icons/fi';
import { RiCapsuleLine, RiMentalHealthLine } from 'react-icons/ri';

const WomensHealthTimeCapsule = () => {
  const [message, setMessage] = useState('');
  const [futureDate, setFutureDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to store the message for future delivery
    console.log('Message saved:', message, 'Delivery date:', futureDate);
    setMessage('');
    setFutureDate('');
  };

  const shareHealthReport = () => {
    // Logic to generate and share health report
    const reportUrl = 'https://yourhealthapp.com/report/123456';
    if (navigator.share) {
      navigator.share({
        title: 'My Health Report',
        text: 'Check out my latest health report!',
        url: reportUrl,
      });
    } else {
      window.open(`https://wa.me/?text=Check out my latest health report: ${reportUrl}`, '_blank');
    }
  };

  const sendEmergencyAlert = () => {
    // Logic to send emergency alert
    alert('Emergency alert sent to your designated contacts!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-6">Women's Health Time Capsule</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-purple-50 p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
                <FiClock className="mr-2" /> Send a Message to Your Future Self
              </h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition"
                  rows="4"
                  placeholder="Write a message to your future self..."
                />
                <input
                  type="date"
                  value={futureDate}
                  onChange={(e) => setFutureDate(e.target.value)}
                  className="w-full mt-4 p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full"
                  type="submit"
                >
                  <FiSend className="mr-2" /> Send to Future
                </motion.button>
              </form>
            </motion.div>
            
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-pink-50 p-6 rounded-2xl"
              >
                <h2 className="text-2xl font-semibold text-pink-700 mb-4 flex items-center">
                  <FiShare2 className="mr-2" /> Share Health Report
                </h2>
                <p className="mb-4">Easily share your health report with doctors or loved ones.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareHealthReport}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full"
                >
                  <FiShare2 className="mr-2" /> Share Report
                </motion.button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-red-50 p-6 rounded-2xl"
              >
                <h2 className="text-2xl font-semibold text-red-700 mb-4 flex items-center">
                  <FiAlertTriangle className="mr-2" /> Emergency Alert
                </h2>
                <p className="mb-4">Quickly send an alert to your emergency contacts.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendEmergencyAlert}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full"
                >
                  <FiAlertTriangle className="mr-2" /> Send Emergency Alert
                </motion.button>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
                <RiCapsuleLine className="mr-2" /> Medication Reminders
              </h2>
              <p>Set up reminders for your medications and supplements.</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-blue-50 p-6 rounded-2xl"
            >
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <RiMentalHealthLine className="mr-2" /> Wellness Check-In
              </h2>
              <p>Regular check-ins to track your mental and emotional wellbeing.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WomensHealthTimeCapsule;