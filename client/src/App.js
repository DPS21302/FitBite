import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import WTopic from './components/WMenstruation';
import NewRecipe from './components/NewRecipe';
import GoogleFit from './components/GoogleFit';
import WDisease from './components/WDisease';

const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <>
   
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn && user?.emailVerified ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/bmr" element={<BMRCalculator />} />
        <Route path="/bodyFat" element={<BodyFatCalculator />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/dietai" element={<Profile />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/nutrition" element={<NutritionInfo />} />
        <Route path="/menuscanner" element={<MenuScanner />} />
        <Route path="/recipesearch" element={<RecipeSearch />} />
        <Route path="/calorietracker" element={<CalorieTracker />} />
        <Route path="/diets/:dietId" element={<DetailedDiet />} />
        <Route path="/newrecipe" element={<NewRecipe />} />
        <Route path="/googlefit" element={<GoogleFit />} />
        <Route path="/women-segment" element={<WHome />} />
        <Route path="/women-segment/:topic" element={<WTopic />} />
        <Route path="/women-segment/disease/:disease" element={<WDisease />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user" element={<AdminUserDashboard />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        
      </Routes>
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
      </Router>
      </>
  );
};

export default App;