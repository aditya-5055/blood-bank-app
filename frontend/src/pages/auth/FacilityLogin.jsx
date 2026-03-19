import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaTint, FaEye, FaEyeSlash, FaHospital } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { loginFacility } from "../../services/authService";
import { setToken, setUser, setRole } from "../../slices/authSlice";
import { ROLES } from "../../constants/roles";

const FacilityLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, role } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (token) {
      if (role === ROLES.BLOOD_BANK) navigate("/bloodbank/dashboard", { replace: true });
      else if (role === ROLES.HOSPITAL) navigate("/hospital/dashboard", { replace: true });
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginFacility(formData);
      if (response.success) {
        dispatch(setToken(response.token));
        dispatch(setUser(response.facility));
        dispatch(setRole(response.facility.role));
        toast.success("Login successful!");

        // ✅ Redirect back to original page or default dashboard
        if (from) {
          navigate(from, { replace: true });
        } else if (response.facility.role === ROLES.BLOOD_BANK) {
          navigate("/bloodbank/dashboard");
        } else if (response.facility.role === ROLES.HOSPITAL) {
          navigate("/hospital/dashboard");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-lg">
            <FaHospital className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">BloodConnect</h1>
          <p className="text-gray-500 mt-1">Facility Login</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Login as Hospital or Blood Bank
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/facility/register" className="text-orange-500 font-semibold hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Are you a donor?{" "}
              <Link to="/donor/login" className="text-red-600 font-semibold hover:underline">
                Donor Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FacilityLogin;