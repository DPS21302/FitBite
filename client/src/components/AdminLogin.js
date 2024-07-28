import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleAdminLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const response = await axios.post(
       ` ${process.env.REACT_APP_API_URL}/api/auth/checkAdmin`,
        { uid: user.uid }
      );

      if (response.data.isAdmin) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          })
        );
        toast.success("Logged in successfully");
        navigate("/admin/dashboard");
      } else {
        setFieldError("general", "You are not authorized to access this page.");
        toast.error("You are not authorized to access this page.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setFieldError("general", error.message);
      toast.error(
        "Error logging in. Please check your credentials and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg m-4"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Admin Login
        </motion.h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={AdminLoginSchema}
          onSubmit={handleAdminLogin}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              {errors.general && (
                <div className="text-red-500 text-sm">{errors.general}</div>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={isSubmitting}
              >
                <FiLogIn className="mr-2" />
                {isSubmitting ? "Logging in..." : "Login"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
