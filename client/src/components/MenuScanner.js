import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  FaUpload,
  FaSpinner,
  FaUtensils,
  FaWeight,
  FaChartPie,
  FaInfoCircle,
  FaLightbulb,
  FaMagic,
  FaCarrot,
  FaTable,
  FaArrowLeft,
} from "react-icons/fa";
import { GiMeat, GiWaterBottle, GiFruitBowl } from "react-icons/gi";
import { IoNutrition, IoFastFood } from "react-icons/io5";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import toast from "react-hot-toast";

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('Please select an image')
});

const MenuScanner = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const adjustToStandardServing = (item) => {
    const factor = 100 / item.serving_size_g;
    return {
      ...item,
      calories: item.calories * factor,
      fat_total_g: item.fat_total_g * factor,
      fat_saturated_g: item.fat_saturated_g * factor,
      protein_g: item.protein_g * factor,
      sodium_mg: item.sodium_mg * factor,
      potassium_mg: item.potassium_mg * factor,
      cholesterol_mg: item.cholesterol_mg * factor,
      carbohydrates_total_g: item.carbohydrates_total_g * factor,
      fiber_g: item.fiber_g * factor,
      sugar_g: item.sugar_g * factor,
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', values.file);

    try {
      const response = await axios.post('https://api.calorieninjas.com/v1/imagetextnutrition', formData, {
        headers: {
          'X-Api-Key': 'aizoaVtBC7EuOV56MRV43Q==x69x1glaSbTjXSuD',
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Adjust all items to standard serving size
      const adjustedData = response.data.items.map(adjustToStandardServing);
      
      setNutritionData(adjustedData);
      setSelectedItem(adjustedData[0]);
      toast.success('Nutrition data analyzed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze nutrition data. Please try again.');
    }

    setLoading(false);
    setSubmitting(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div
            className="p-8 bg-blue-600 text-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center">
              <IoNutrition className="mr-2 text-yellow-400" /> Menu Scanner
            </h1>
            <p className="mb-6 flex items-center">
              <FaInfoCircle className="mr-2 text-3xl" /> Upload an image of your meal or menu item to analyze its nutritional content.
            </p>
            <Formik
              initialValues={{ file: null }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="bg-white p-6 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file">
                      Upload Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="mx-auto h-32 w-auto" />
                        ) : (
                          <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file"
                              name="file"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                setFieldValue("file", file);
                                setPreviewImage(URL.createObjectURL(file));
                              }}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {errors.file && touched.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin inline-block mr-2" />
                    ) : (
                      <FaUtensils className="inline-block mr-2" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Nutrition'}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </motion.div>
          
          <motion.div
            className="p-8 flex flex-col items-center justify-center"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {selectedItem ? (
              <NutritionDetails item={selectedItem} onBack={() => setSelectedItem(null)} />
            ) : (
              <InfoSection />
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {nutritionData && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-8 bg-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">
                <FaTable className="inline-block mr-2" /> Analyzed Items
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbs</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fat</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nutritionData.map((item, index) => (
                      <motion.tr
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.calories.toFixed(1)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.protein_g.toFixed(1)}g</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.carbohydrates_total_g.toFixed(1)}g</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fat_total_g.toFixed(1)}g</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <NutritionTips />
      </div>
    </motion.div>
  );
};

const NutritionDetails = ({ item, onBack }) => (
  <motion.div
    key={item.name}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full"
  >
    <button
      onClick={onBack}
      className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
    >
      <FaArrowLeft className="mr-2" /> Back to list
    </button>
    <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">
      {item.name.charAt(0).toUpperCase() + item.name.slice(1)} <FaUtensils className="inline-block ml-2" />
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full h-64">
        <Doughnut
          data={{
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
              data: [
                item.protein_g,
                item.carbohydrates_total_g,
                item.fat_total_g
              ],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NutritionItem
          icon={<GiWaterBottle />}
          label="Serving Size"
          value="100 g"
        />
        <NutritionItem
          icon={<FaWeight />}
          label="Calories"
          value={`${item.calories.toFixed(1)} kcal`}
        />
        <NutritionItem
          icon={<GiMeat />}
          label="Protein"
          value={`${item.protein_g.toFixed(1)}g`}
        />
        <NutritionItem
          icon={<FaChartPie />}
          label="Carbs"
          value={`${item.carbohydrates_total_g.toFixed(1)}g`}
        />
        <NutritionItem
          icon={<GiWaterBottle />}
          label="Fat"
          value={`${item.fat_total_g.toFixed(1)}g`}
        />
        <NutritionItem
          icon={<GiFruitBowl />}
          label="Sugar"
          value={`${item.sugar_g.toFixed(1)}g`}
        />
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 text-indigo-800">Detailed Nutrition Information (per 100g)</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(item).map(([key, value]) => {
            if (key !== 'name' && key !== 'serving_size_g') {
              return (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value.toFixed(1)} </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const InfoSection = () => (
  <div className="text-center">
    <IoNutrition className="text-6xl text-blue-500 mx-auto mb-4" />
    <p className="text-xl text-gray-600">
      Upload an image to analyze its nutritional content
    </p>
  </div>
);

const NutritionTips = () => (
  <motion.div
    className="p-8"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.8 }}
  >
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <FaLightbulb className="mr-2" /> Nutrition Tips
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <FaCarrot className="text-4xl mb-2 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">Balanced Diet</h3>
        <p className="text-gray-600">
          Aim for a variety of foods from all food groups to ensure you're getting all necessary nutrients.
        </p>
      </div>
      <div className="bg-green-50 p-6 rounded-lg">
        <IoFastFood className="text-4xl mb-2 text-green-600" />
        <h3 className="text-xl font-semibold mb-2">Portion Control</h3>
        <p className="text-gray-600">
          Be mindful of portion sizes to maintain a healthy calorie intake.
        </p>
      </div>
      <div className="bg-purple-50 p-6 rounded-lg">
        <FaMagic className="text-4xl mb-2 text-purple-600" />
        <h3 className="text-xl font-semibold mb-2">Nutrient Density</h3>
        <p className="text-gray-600">
          Choose foods that are rich in nutrients but lower in calories for optimal health.
        </p>
      </div>
    </div>
  </motion.div>
);

const NutritionItem = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg shadow"
    whileHover={{ scale: 1.05 }}
  >
    <span className="text-indigo-500 text-xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default MenuScanner;