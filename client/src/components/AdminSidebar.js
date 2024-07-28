import React, { useState, useEffect } from "react";
import { FaUsers, FaChartBar, FaSignOutAlt, FaBars } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { getAuth, signOut } from "firebase/auth";

const SidebarItem = ({ icon: Icon, text, to, onClick }) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mb-4"
  >
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
    >
      <Icon className="mr-3 text-xl" />
      <span>{text}</span>
    </Link>
  </motion.li>
);

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full transition-all duration-300 ${
          isCollapsed ? 'shadow-md hover:bg-gray-700' : 'left-64'
        }`}
      >
        <FaBars />
      </button>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-5 shadow-lg"
          >
            <div className="text-2xl font-bold mb-6 flex items-center mt-8">
              <MdDashboard className="mr-3 text-3xl" />
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            </div>
            <ul>
              <SidebarItem icon={FaUsers} text="Users" to="/admin/user" />
              <SidebarItem icon={FaChartBar} text="Stats" to="/admin/stats" />
              <SidebarItem icon={FaSignOutAlt} text="Logout" onClick={handleLogout} />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;