# FitBite: Your Comprehensive Diet and Wellness Companion

FitBite is a feature-rich web application built using the MERN stack, designed to provide personalized diet recommendations and holistic wellness support. With a wide range of features and integrations, FitBite aims to be your one-stop solution for all things related to nutrition, fitness, and overall well-being.

![FitBite Logo](/client/public/fitbite.png)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
1. **Diet Recommendation System**: Our AI-powered system provides personalized diet plans based on your individual needs and goals.

2. **Health Metrics Calculators**:
   - BMI (Body Mass Index) Calculator
   - BMR (Basal Metabolic Rate) Calculator
   - Body Fat Percentage Calculator

3. **Calorie Tracker**: Keep track of your daily calorie intake with detailed AI insights.

4. **Nutrition Information**: Get comprehensive nutritional details for any food item.

5. **Recipe Generator**: Discover new, healthy recipes tailored to your dietary preferences.

6. **Menu Scanner**: Scan restaurant menus to find the healthiest options with AI assistance.

7. **Google Fitbit Integration**: Sync your health metrics directly from your Fitbit device.

### Additional Wellness Features
8. **Screen Time Analyzer**: Monitor and manage your digital habits for better overall health.

9. **Carbon Footprint Tracker**: Understand and reduce your environmental impact.

10. **Mental Wellbeing**: Tools and resources to support your mental health.

11. **Diet Blogs**: Comprehensive articles covering various diet types and nutrition topics.

### Women's Health Segment
12. **Phase-Based Diet Recommendations**: Tailored nutrition advice for different phases of the menstrual cycle and pregnancy.

13. **Condition-Specific Support**: Dietary recommendations for specific symptoms (e.g., menstrual cramps, bloating).

14. **Menstrual Cycle Education**: Detailed information on each phase of the menstrual cycle and corresponding nutritional needs.

15. **Women's Health Information**: Resources on common health issues like PCOS, breast cancer, and more, including diet and lifestyle recommendations.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **AI Integration**: Gemini API
- **Fitness Data**: Google Fitbit API

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fitbite.git
   ```
2. Navigate to the project directory:
   ```
   cd fitbite
   ```
3. Install dependencies for both frontend and backend:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
4. Set up environment variables (refer to `.env.example` files in both client and server directories).
    .env for client
    ```
    REACT_APP_API_URL = http://localhost:5000
    REACT_APP_GOOGLE_API_KEY = [YOUR_GOOGLE_API_KEY]
    ```
    .env for server
    ```
    FIREBASE_PROJECT_ID=[YOUR_FIREBASE_PROJECT_ID]
    FIREBASE_PRIVATE_KEY=[YOUR_FIREBASE_KEY]
    FIREBASE_CLIENT_EMAIL=[YOUR_FIREBASE_CLIENT_EMAIL]
    MONGODB_URI=[YOUR_MONGODB_URI]
    ```

5. Start the development servers:
   ```
   # In the server directory
   npm run dev
   
   # In the client directory
   npm start
   ```

## Usage
After installation, access the application by navigating to `http://localhost:3000` in your web browser. Create an account or log in to start exploring FitBite's features.

## Contributing
We welcome contributions to FitBite! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the [MIT License](LICENSE.md).

## Contact

Name - Mayank Yadav, Divya Kaurani

Youtube Explanation Link: https://youtu.be/wM0V84Di9RA

```
Final-Project
├─ .vscode
│  └─ settings.json
├─ client
│  ├─ .env
│  ├─ .eslintrc.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ fitbite.png
│  │  ├─ images
│  │  │  └─ veggies.gif
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  └─ src
│     ├─ api
│     │  └─ auth.js
│     ├─ App.css
│     ├─ App.js
│     ├─ App.test.js
│     ├─ components
│     │  ├─ AdminDashboard.js
│     │  ├─ AdminLogin.js
│     │  ├─ AdminSidebar.js
│     │  ├─ AdminStats.js
│     │  ├─ AdminUserDashboard.js
│     │  ├─ BMICalculator.js
│     │  ├─ BMRCalculator.js
│     │  ├─ BodyFatCalculator.js
│     │  ├─ CalorieTracker.js
│     │  ├─ CarbonFootprint.js
│     │  ├─ debug.log
│     │  ├─ DetailedDiet.js
│     │  ├─ DietList.js
│     │  ├─ Exercise.js
│     │  ├─ Footer.js
│     │  ├─ FutureVisionBoard.js
│     │  ├─ Gemini.js
│     │  ├─ GlobalCultureExplorer.js
│     │  ├─ GoogleFit.js
│     │  ├─ Hero.js
│     │  ├─ Home.js
│     │  ├─ Login.js
│     │  ├─ MentalWellbeing.js
│     │  ├─ MenuScanner.js
│     │  ├─ MyProfile.js
│     │  ├─ Navbar.js
│     │  ├─ NewRecipe.js
│     │  ├─ NutritionInfo.js
│     │  ├─ PersonalGrowthTracker.js
│     │  ├─ PrivateRoute.js
│     │  ├─ Profile.js
│     │  ├─ Recipe.js
│     │  ├─ RecipeSearch.js
│     │  ├─ ScreenTime.js
│     │  ├─ Signup.js
│     │  ├─ SkillDevelopment.js
│     │  ├─ VerifyEmail.js
│     │  ├─ WDisease.js
│     │  ├─ WellnessComapnion.js
│     │  ├─ WGemini.js
│     │  ├─ WHealthTimeCapsule.js
│     │  ├─ WHero.js
│     │  ├─ WHome.js
│     │  ├─ WNavbar.js
│     │  └─ WTopic.js
│     ├─ data
│     │  ├─ dietData.json
│     │  ├─ diseaseData.json
│     │  └─ Womendata.json
│     ├─ debug.log
│     ├─ index.css
│     ├─ index.js
│     ├─ logo.svg
│     ├─ redux
│     │  ├─ authSlice.js
│     │  └─ store.js
│     ├─ reportWebVitals.js
│     └─ setupTests.js
├─ Readme.md
└─ server
   ├─ .env
   ├─ config
   │  ├─ database.js
   │  └─ firebase.js
   ├─ controllers
   │  ├─ adminController.js
   │  ├─ authController.js
   │  ├─ bmiController.js
   │  ├─ bmrController.js
   │  ├─ bodyFatController.js
   │  ├─ calorieTrackerController.js
   │  └─ userController.js
   ├─ data
   │  └─ exercises.json
   ├─ index.js
   ├─ middlewares
   │  └─ authMiddleware.js
   ├─ models
   │  ├─ BMI.js
   │  ├─ BMR.js
   │  ├─ BodyFat.js
   │  └─ User.js
   ├─ package-lock.json
   ├─ package.json
   └─ routes
      ├─ adminRoutes.js
      ├─ authRoutes.js
      ├─ bmiRoutes.js
      ├─ calorieTrackerRoutes.js
      ├─ exerciseRoutes.js
      └─ userRoutes.js

```