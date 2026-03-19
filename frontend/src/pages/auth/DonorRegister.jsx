import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTint } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { sendDonorOTP, registerDonor } from "../../services/authService";
import { BLOOD_GROUPS } from "../../constants/bloodGroups";

const DonorRegister = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [coordinates, setCoordinates] = useState([0, 0]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    age: "",
    gender: "",
    weight: "",
    address: { city: "", state: "", pincode: "" },
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "state", "pincode"].includes(name)) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter email first");
      return;
    }
    setLoading(true);
    try {
      const response = await sendDonorOTP(formData.email);
      if (response.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get GPS location — separate button click
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates([position.coords.longitude, position.coords.latitude]);
        setLocationCaptured(true);
        toast.success("Location captured successfully!");
      },
      () => {
        toast.error("Location access denied. You can update it later from profile.");
        setLocationCaptured(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      toast.error("Please verify your email first");
      return;
    }
    setLoading(true);
    try {
      const response = await registerDonor({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        // ✅ Use stored coordinates
        location: {
          type: "Point",
          coordinates,
        },
      });
      if (response.success) {
        toast.success("Registered successfully! Please login.");
        navigate("/donor/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4 shadow-lg">
            <FaTint className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">BloodConnect</h1>
          <p className="text-gray-500 mt-1">Donor Registration</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Create Your Account 🩸
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Please capture your location to see nearby blood banks and camps.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1 — Full Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || otpSent}
                    className="px-3 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
                  >
                    {otpSent ? "Sent ✓" : "Send OTP"}
                  </button>
                </div>
              </div>
            </div>

            {/* OTP Field */}
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6 digit OTP from email"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-green-50"
                />
                <p className="text-xs text-green-600 mt-1">✅ OTP sent to {formData.email}</p>
              </div>
            )}

            {/* Row 2 — Password + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
            </div>

            {/* Row 3 — Blood Group + Age + Gender + Weight */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  min={18}
                  max={65}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                  min={45}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
            </div>

            {/* Row 4 — Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
            </div>

            {/* ✅ Get Location Button */}
            <button
              type="button"
              onClick={handleGetLocation}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                locationCaptured
                  ? "bg-green-50 text-green-600 border-green-400"
                  : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              }`}
            >
              <MdMyLocation className="text-lg" />
              {locationCaptured
                ? "✅ Location Captured!"
                : "📍 Get My Location (Required for nearby features)"}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/donor/login" className="text-red-600 font-semibold hover:underline">
                Login here
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

export default DonorRegister;