import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUsers,
  FaUserPlus,
  FaUserEdit,
  FaTrash,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaWeight,
  FaRunning,
  FaAppleAlt,
} from "react-icons/fa";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userGrowth, setUserGrowth] = useState([]);
  const [genderDistribution, setGenderDistribution] = useState({});
  const [averageAge, setAverageAge] = useState(0);
  const [activeusers, setActiveUsers] = useState(0);
  const [averageCalories, setAverageCalories] = useState(0);

  useEffect(() => {
    fetchUsers();
    fetchUserCount();
    fetchUserGrowth();
    fetchGenderDistribution();
    fetchAverageAge();
    fetchActiveUsers();
    fetchAverageCalories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/totalUsers`
      );
      setUserCount(response.data.count);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const createUser = async (values, { resetForm }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        values
      );
      fetchUsers();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (values) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/users/${selectedUser._id}`,
        values
      );
      fetchUsers();
      setSelectedUser(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/admin/users/${id}`
        );
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const fetchUserGrowth = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/userGrowth`
      );
      setUserGrowth(response.data);
    } catch (error) {
      console.error("Error fetching user growth:", error);
    }
  };

  const fetchGenderDistribution = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/genderDistribution`
      );
      setGenderDistribution(response.data);
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
    }
  };

  const fetchAverageAge = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/averageAge`
      );
      setAverageAge(response.data.averageAge);
    } catch (error) {
      console.error("Error fetching average age:", error);
    }
  };
  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/activeUsers`
      );
      setActiveUsers(response.data.activePercentage);
    } catch (error) {
      console.error("Error fetching average age:", error);
    }
  };
  const fetchAverageCalories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/averageCalories`
      );
      setAverageCalories(response.data.averageCalories);
    } catch (error) {
      console.error("Error fetching average age:", error);
    }
  };

  const userSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    displayName: Yup.string().required("Required"),
    isAdmin: Yup.boolean(),
    profile: Yup.object().shape({
      age: Yup.number()
        .positive("Must be positive")
        .integer("Must be an integer"),
      gender: Yup.string(),
      height: Yup.number().positive("Must be positive"),
      currentWeight: Yup.number().positive("Must be positive"),
      targetWeight: Yup.number().positive("Must be positive"),
    }),
  });

  const filteredUsers = users.filter(
    (user) =>
      (user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterAdmin || user?.isAdmin)
  );

  const userGrowthData = {
    labels: userGrowth.map((data) => data.date),
    datasets: [
      {
        label: "New Users",
        data: userGrowth.map((data) => data.count),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const genderDistributionData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
    <AdminSidebar />
    <div className="flex-1 p-4 lg:ml-64">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-800">
        Admin User Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
              <FaUsers className="mr-2 text-blue-500" /> Total Users
            </h2>
            <p className="text-4xl font-bold text-blue-600">{userCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
              <FaWeight className="mr-2 text-green-500" /> Average Age
            </h2>
            <p className="text-4xl font-bold text-green-600">
              {averageAge.toFixed(1)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
              <FaRunning className="mr-2 text-purple-500" /> Active Users
            </h2>
            <p className="text-4xl font-bold text-purple-600">
              {activeusers} %
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
              <FaAppleAlt className="mr-2 text-red-500" /> Avg. Calories
            </h2>
            <p className="text-4xl font-bold text-red-600">
              {averageCalories.toFixed(2)}
            </p>
          </motion.div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2 sm:mb-0">
              User Management
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setSelectedUser(null);
              }}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <FaUserPlus className="mr-2" /> Add New User
            </button>
          </div>

          <div className="flex flex-col sm:flex-row mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setFilterAdmin(!filterAdmin)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                filterAdmin
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <FaFilter className="mr-2" /> Admin Only
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Display Name</th>
                  <th className="px-4 py-2 text-left">Admin</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Gender</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.displayName}</td>
                    <td className="px-4 py-2">{user.isAdmin ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{user.profile?.age}</td>
                    <td className="px-4 py-2">{user.profile?.gender}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
              User Growth
            </h2>
            <Line data={userGrowthData} options={{ responsive: true }} />
          </div>

          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
              Gender Distribution
            </h2>
            <Doughnut
              data={genderDistributionData}
              options={{ responsive: true }}
            />
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedUser ? "Edit User" : "Create User"}
                </h2>
                <Formik
                  initialValues={
                    selectedUser || {
                      email: "",
                      displayName: "",
                      isAdmin: false,
                      profile: {
                        age: "",
                        gender: "",
                        height: "",
                        currentWeight: "",
                        targetWeight: "",
                      },
                    }
                  }
                  validationSchema={userSchema}
                  onSubmit={(values, formikBag) => {
                    if (selectedUser) {
                      updateUser(values);
                    } else {
                      createUser(values, formikBag);
                    }
                  }}
                  enableReinitialize
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Email"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          name="displayName"
                          placeholder="Display Name"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="displayName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="isAdmin"
                            className="mr-2"
                          />
                          Is Admin
                        </label>
                      </div>
                      <div>
                        <Field
                          name="profile.age"
                          type="number"
                          placeholder="Age"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="profile.age"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          name="profile.gender"
                          as="select"
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Field>
                      </div>
                      <div>
                        <Field
                          name="profile.height"
                          type="number"
                          placeholder="Height (cm)"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="profile.height"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          name="profile.currentWeight"
                          type="number"
                          placeholder="Current Weight (kg)"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="profile.currentWeight"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          name="profile.targetWeight"
                          type="number"
                          placeholder="Target Weight (kg)"
                          className="w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="profile.targetWeight"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                          {selectedUser ? "Update User" : "Create User"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminUserDashboard;
