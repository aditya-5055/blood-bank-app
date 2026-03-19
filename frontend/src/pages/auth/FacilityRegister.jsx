import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHospital } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { sendFacilityOTP, registerFacility } from "../../services/authService";
import { FACILITY_CATEGORIES, FACILITY_TYPES } from "../../constants/bloodGroups";

const FacilityRegister = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [coordinates, setCoordinates] = useState([0, 0]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    emergencyContact: "",
    registrationNumber: "",
    facilityType: "",
    facilityCategory: "",
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
      const response = await sendFacilityOTP(formData.email);
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

  // ✅ Get GPS location
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
      const response = await registerFacility({
        ...formData,
        // ✅ Send location
        location: {
          type: "Point",
          coordinates,
        },
      });
      if (response.success) {
        toast.success("Registration submitted! Please wait for admin approval.");
        navigate("/facility/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 shadow-lg">
            <FaHospital className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">BloodConnect</h1>
          <p className="text-gray-500 mt-1">Facility Registration</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Register Your Facility 🏥
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Register as Hospital or Blood Bank. Admin will review and approve your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Row 1 — Facility Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter facility name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || otpSent}
                    className="px-3 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Row 3 — Emergency Contact + Registration Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Emergency contact number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Unique registration number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Row 4 — Facility Type + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type</label>
                <select
                  name="facilityType"
                  value={formData.facilityType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="">Select Type</option>
                  {FACILITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === "hospital" ? "Hospital" : "Blood Bank"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Category</label>
                <select
                  name="facilityCategory"
                  value={formData.facilityCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="">Select Category</option>
                  {FACILITY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5 — Address */}
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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

            {/* Info Box */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-700 font-medium">⚠️ Important Note</p>
              <p className="text-xs text-orange-600 mt-1">
                Your registration will be reviewed by our admin team. You will receive an email once approved. This process may take 24-48 hours.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/facility/login" className="text-orange-500 font-semibold hover:underline">
                Login here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Are you a donor?{" "}
              <Link to="/donor/register" className="text-red-600 font-semibold hover:underline">
                Donor Register
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

export default FacilityRegister;