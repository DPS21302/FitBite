import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaApple, FaBrain, FaRunning, FaYinYang, FaLeaf, FaMoon, FaFemale } from 'react-icons/fa';
import { GiMeditation, GiDna1 } from 'react-icons/gi';
import { MdPregnantWoman } from 'react-icons/md';
import { IoIosNutrition } from 'react-icons/io';

const WHero = () => {

  const IconBubble = ({ Icon, top, left, delay }) => (
    <motion.div
      className="absolute z-10 hidden sm:block"
      style={{ top, left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay }}
    >
      <motion.div
        className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.2, rotate: 360 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <Icon className="text-xl sm:text-2xl md:text-3xl text-pink-500" />
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 m-0">
      <div className="absolute inset-0 bg-opacity-50 bg-white backdrop-filter backdrop-blur-sm" />
      
      {/* Main content */}
      <div className="relative z-20 flex flex-col lg:flex-row h-full p-4 sm:p-8 lg:p-40">
        {/* Left side: Text and button */}
        <motion.div 
          className="flex flex-col justify-center items-start lg:w-1/2 mb-8 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 leading-tight">
            Nurture Your<br/>Journey
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600 max-w-md">
            Discover personalized wellness plans for every stage of your life.
          </p>
          <motion.button
            className="px-6 py-2 sm:px-8 sm:py-3 bg-pink-400 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg"
            whileHover={{ scale: 1.05, backgroundColor: '#EC4899' }}
            whileTap={{ scale: 0.95 }}

          >
            Start Your Journey
          </motion.button>
          
        
        </motion.div>

        {/* Right side: Image */}
        <motion.div 
          className="flex justify-center items-center lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <img 
           src="https://i.ibb.co/dKngxQk/woman-removebg-preview.png" 
            alt="Wellness Journey" 
            className="max-w-full max-h-full w-full sm:w-[30rem] sm:h-[30rem] lg:w-[40rem] lg:h-[40rem] object-cover"
          />
        </motion.div>
      </div>

      {/* Floating icons */}
      <IconBubble Icon={FaHeartbeat} top="10%" left="5%" delay={0.2} />
      <IconBubble Icon={FaApple} top="75%" left="80%" delay={0.4} />
      <IconBubble Icon={GiMeditation} top="20%" left="90%" delay={0.6} />
      {/* <IconBubble Icon={MdPregnantWoman} top="80%" left="20%" delay={0.8} /> */}
      <IconBubble Icon={IoIosNutrition} top="40%" left="75%" delay={1} />
      <IconBubble Icon={FaBrain} top="80%" left="25%" delay={1.2} />
      <IconBubble Icon={GiDna1} top="75%" left="50%" delay={1.4} />
      <IconBubble Icon={FaMoon} top="75%" left="5%" delay={1.6} />
      <IconBubble Icon={MdPregnantWoman} top="15%" left="20%" delay={1.8} />
      <IconBubble Icon={FaLeaf} top="10%" left="50%" delay={2} />
      <IconBubble Icon={FaFemale} top="45%" left="45%" delay={2} />

      {/* Background shapes */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-pink-200 rounded-full opacity-50"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-200 rounded-full opacity-50"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default WHero;