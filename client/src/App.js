import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from "react-hot-toast";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyEmail from './components/VerifyEmail';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BMICalculator from './components/BMICalculator';
import BMRCalculator from './components/BMRCalculator';
import BodyFatCalculator from './components/BodyFatCalculator';
import Recipe from './components/Recipe';
import Profile from './components/Profile';
import AdminUserDashboard from './components/AdminUserDashboard';
import AdminStats from './components/AdminStats';
import MyProfile from './components/MyProfile';
import NutritionInfo from './components/NutritionInfo';
import MenuScanner from './components/MenuScanner';
import WHome from './components/WHome';
import RecipeSearch from './components/RecipeSearch';
import CalorieTracker from './components/CalorieTracker';
import DetailedDiet from './components/DetailedDiet';
import NewRecipe from './components/NewRecipe';
import GoogleFit from './components/GoogleFit';
import WTopic from './components/WTopic';
import WDisease from './components/WDisease';
import ScreenTime from './components/ScreenTime';
import MentalWellbeing from './components/MentalWellbeing';
import CarbonFootprint from './components/CarbonFootprint';
import PersonalGrowthTracker from './components/PersonalGrowthTracker';
import SkillDevelopment from './components/SkillDevelopment';
import GlobalCultureExplorer from './components/GlobalCultureExplorer';
import WomensHealthTimeCapsule from './components/WHealthTimeCapsule';
import Exercise from './components/Exercise';
import FutureVisionBoard from './components/FutureVisionBoard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<PrivateRoute><VerifyEmail /></PrivateRoute>} />
          <Route path="/bmi" element={<PrivateRoute><BMICalculator /></PrivateRoute>} />
          <Route path="/bmr" element={<PrivateRoute><BMRCalculator /></PrivateRoute>} />
          <Route path="/bodyFat" element={<PrivateRoute><BodyFatCalculator /></PrivateRoute>} />
          <Route path="/recipe" element={<PrivateRoute><Recipe /></PrivateRoute>} />
          <Route path="/dietai" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/myprofile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
          <Route path="/nutrition" element={<PrivateRoute><NutritionInfo /></PrivateRoute>} />
          <Route path="/menuscanner" element={<PrivateRoute><MenuScanner /></PrivateRoute>} />
          <Route path="/recipesearch" element={<PrivateRoute><RecipeSearch /></PrivateRoute>} />
          <Route path="/calorietracker" element={<PrivateRoute><CalorieTracker /></PrivateRoute>} />
          <Route path="/diets/:dietId" element={<PrivateRoute><DetailedDiet /></PrivateRoute>} />
          <Route path="/newrecipe" element={<PrivateRoute><NewRecipe /></PrivateRoute>} />
          <Route path="/googlefit" element={<PrivateRoute><GoogleFit /></PrivateRoute>} />
          <Route path="/women-segment" element={<PrivateRoute><WHome /></PrivateRoute>} />
          <Route path="/women-segment/:topic" element={<PrivateRoute><WTopic /></PrivateRoute>} />
          <Route path="/women-segment/disease/:disease" element={<PrivateRoute><WDisease /></PrivateRoute>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/user" element={<PrivateRoute><AdminUserDashboard /></PrivateRoute>} />
          <Route path="/admin/stats" element={<PrivateRoute><AdminStats /></PrivateRoute>} />
          <Route path="/screentime" element={<PrivateRoute><ScreenTime /></PrivateRoute>} />
          <Route path="/mentalwellbeing" element={<PrivateRoute><MentalWellbeing /></PrivateRoute>} />
          <Route path="/carbonfootprint" element={<PrivateRoute><CarbonFootprint /></PrivateRoute>} />
          <Route path="/personalgrowth" element={<PrivateRoute><PersonalGrowthTracker /></PrivateRoute>} />
          <Route path="/skilldevelopment" element={<PrivateRoute><SkillDevelopment /></PrivateRoute>} />
          <Route path="/globalculture" element={<PrivateRoute><GlobalCultureExplorer /></PrivateRoute>} />
          <Route path="/futurevisionboard" element={<PrivateRoute><FutureVisionBoard /></PrivateRoute>} />
          <Route path="/womens-health-time-capsule" element={<PrivateRoute><WomensHealthTimeCapsule /></PrivateRoute>} />
          <Route path="/exercise" element={<PrivateRoute><Exercise /></PrivateRoute>} />
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{ zIndex: "9999999999" }}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "white",
            color: "black",
            fontSize: "16px",
          },
          success: {
            duration: 3000,
          },
        }}
      />
    </>
  );
};

export default App;