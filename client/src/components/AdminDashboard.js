import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import { FaUsers, FaChartBar } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const DashboardSection = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="flex items-center mb-2">
      <Icon className="text-blue-500 text-2xl mr-3" />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen ml-6">
      <AdminSidebar />
      <div className="flex-1 p-10 pl-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-800 flex items-center">
            <MdDashboard className="mr-4 text-blue-500" />
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mb-8">
            Welcome to the admin dashboard. Here you can manage users, view
            statistics, and configure system settings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardSection
              icon={FaUsers}
              title="User Management"
              description="Manage user accounts, permissions, and roles. View and edit user profiles as needed."
            />
            <DashboardSection
              icon={FaChartBar}
              title="Statistics"
              description="View and analyze system statistics. Generate reports on user activity and system performance."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
