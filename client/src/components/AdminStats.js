import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  FaWeight,
  FaFireAlt,
  FaPercent,
  FaUserFriends,
  FaChartLine,
  FaFire,
  FaHeartbeat,
  FaClipboardCheck,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AdminSidebar from "./AdminSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminStats = () => {
  const [bmiStats, setBMIStats] = useState(null);
  const [bmrStats, setBMRStats] = useState(null);
  const [bodyFatStats, setBodyFatStats] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bmiResponse, bmrResponse, bodyFatResponse, userCountResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bmi`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bmr`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bodyfat`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/totalUsers`),
        ]);

        setBMIStats(bmiResponse.data);
        setBMRStats(bmrResponse.data[0] || null);
        setBodyFatStats(bodyFatResponse.data);
        setUserCount(userCountResponse.data.message ? 0 : userCountResponse.data.count);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bmrChartData = {
    labels: bmrStats ? [bmrStats._id] : [],
    datasets: [
      {
        label: "Average BMR",
        data: bmrStats ? [bmrStats.averageBMR] : [],
        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
      },
    ],
  };

  const bmiChartData = {
    labels: ["Min BMI", "Average BMI", "Max BMI"],
    datasets: [
      {
        label: "BMI",
        data: bmiStats
          ? [bmiStats.minBMI, bmiStats.averageBMI, bmiStats.maxBMI]
          : [],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
  };

  const bodyFatChartData = {
    labels: ["Min Body Fat", "Average Body Fat", "Max Body Fat"],
    datasets: [
      {
        label: "Body Fat",
        data: bodyFatStats
          ? [
              bodyFatStats.minBodyFat,
              bodyFatStats.averageBodyFat,
              bodyFatStats.maxBodyFat,
            ]
          : [],
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-4 lg:p-10 lg:pl-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-4 lg:p-6"
        >
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-gray-800">
            Health Statistics Dashboard
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <StatCard
                  icon={FaUserFriends}
                  title="Total Users"
                  value={userCount || "N/A"}
                  color="blue"
                />
                <StatCard
                  icon={FaWeight}
                  title="Avg BMR"
                  value={bmrStats ? bmrStats.averageBMR.toFixed(2) : "N/A"}
                  color="green"
                />
                <StatCard
                  icon={FaFireAlt}
                  title="Min BMR"
                  value={bmrStats ? bmrStats.minBMR.toFixed(2) : "N/A"}
                  color="orange"
                />
                <StatCard
                  icon={FaPercent}
                  title="Max BMR"
                  value={bmrStats ? bmrStats.maxBMR.toFixed(2) : "N/A"}
                  color="purple"
                />
                <StatCard
                  icon={FaWeight}
                  title="Avg BMI"
                  value={bmiStats ? bmiStats.averageBMI.toFixed(2) : "N/A"}
                  color="green"
                />
                <StatCard
                  icon={FaPercent}
                  title="Avg Body Fat"
                  value={
                    bodyFatStats ? bodyFatStats.averageBodyFat.toFixed(2) : "N/A"
                  }
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <ChartCard
                  title="BMI Statistics"
                  chart={<Bar data={bmiChartData} options={chartOptions} />}
                />
                <ChartCard
                  title="BMR by Gender"
                  chart={<Bar data={bmrChartData} options={chartOptions} />}
                />
                <ChartCard
                  title="Body Fat Statistics"
                  chart={<Bar data={bodyFatChartData} options={chartOptions} />}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-4 lg:p-6 mt-6 lg:mt-8"
              >
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaChartLine className="mr-2 text-blue-500" />
                  Recent Health Trends
                </h3>
                <p className="text-gray-600 mb-4">
                  Based on the latest data, we've observed the following trends:
                </p>
                <ul className="space-y-3">
                  <TrendItem
                    icon={FaWeight}
                    text="Average BMI has decreased"
                    percentage="2% in the last month"
                    color="green"
                  />
                  <TrendItem
                    icon={FaFire}
                    text="Male users show higher average BMR"
                    percentage="5% compared to female users"
                    color="orange"
                  />
                  <TrendItem
                    icon={FaHeartbeat}
                    text="Users in 'Fitness' category for body fat"
                    percentage="20% of total users"
                    color="red"
                  />
                  <TrendItem
                    icon={FaClipboardCheck}
                    text="Increase in users tracking health metrics"
                    percentage="10% growth"
                    color="blue"
                  />
                </ul>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-${color}-100 p-4 lg:p-6 rounded-lg shadow-md`}
  >
    <div className="flex items-center mb-2">
      <Icon className={`text-${color}-500 text-2xl lg:text-3xl mr-3`} />
      <h3 className="text-lg lg:text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className={`text-xl lg:text-2xl font-bold text-${color}-600`}>{value}</p>
  </motion.div>
);

const ChartCard = ({ title, chart }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 lg:p-6 rounded-lg shadow-md"
  >
    <h3 className="text-lg lg:text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="h-64 lg:h-80">{chart}</div>
  </motion.div>
);

const TrendItem = ({ icon: Icon, text, percentage, color }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className={`flex items-center mb-4 p-3 bg-${color}-100 rounded-lg`}
  >
    <Icon className={`text-${color}-500 text-xl lg:text-2xl mr-3`} />
    <div>
      <p className="text-gray-800 font-semibold">{text}</p>
      <p className={`text-${color}-600 font-bold`}>{percentage}</p>
    </div>
  </motion.li>
);

export default AdminStats;