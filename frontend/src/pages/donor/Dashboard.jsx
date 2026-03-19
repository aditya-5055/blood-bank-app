import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  MdDashboard, MdLocationOn, MdCampaign,
  MdLocalHospital, MdHistory, MdBloodtype
} from "react-icons/md";
import { FaTint, FaHeart, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { getDonorProfile, getNearbyRequests } from "../../services/donorService";
import Avatar from "../../components/ui/Avatar";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [nearbyRequestsCount, setNearbyRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await getDonorProfile();
      setProfile(profileRes.donor);

      // ✅ Fetch nearby requests count
      try {
        const requestsRes = await getNearbyRequests();
        setNearbyRequestsCount(requestsRes.count || 0);
      } catch {
        setNearbyRequestsCount(0);
      }
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getNextEligibleDate = () => {
    if (!profile?.lastDonationDate) return null;
    const last = new Date(profile.lastDonationDate);
    return new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
  };

  const getDaysUntilEligible = () => {
    const nextDate = getNextEligibleDate();
    if (!nextDate) return null;
    const now = new Date();
    const diff = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const quickActions = [
    {
      title: "Nearby Blood Banks",
      description: "Find blood banks within 10km",
      icon: MdLocationOn,
      path: "/donor/nearby-banks",
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
      badge: 0,
    },
    {
      title: "Nearby Camps",
      description: "Register for donation camps",
      icon: MdCampaign,
      path: "/donor/nearby-camps",
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
      badge: 0,
    },
    {
      title: "Nearby Requests",
      description: "Help hospitals in need",
      icon: MdLocalHospital,
      path: "/donor/nearby-requests",
      color: "bg-red-50 text-red-600",
      iconBg: "bg-red-100",
      badge: nearbyRequestsCount, // ✅ Show count
    },
    {
      title: "Donation History",
      description: "View your past donations",
      icon: MdHistory,
      path: "/donor/donation-history",
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100",
      badge: 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const daysUntilEligible = getDaysUntilEligible();
  const nextEligibleDate = getNextEligibleDate();

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-red-100 mt-1 text-sm">
              {profile?.eligibleToDonate
                ? "You are eligible to donate blood today!"
                : `You can donate again in ${daysUntilEligible} days`}
            </p>
          </div>
          <div className="hidden md:block">
            <Avatar name={profile?.fullName} size="xl" />
          </div>
        </div>
      </div>

      {/* ✅ Urgent Request Alert */}
      {nearbyRequestsCount > 0 && profile?.eligibleToDonate && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <FaTint className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-700">
                  🚨 {nearbyRequestsCount} Urgent Blood Request{nearbyRequestsCount > 1 ? "s" : ""} Nearby!
                </h3>
                <p className="text-sm text-red-600 mt-1">
                  Hospitals near you need your {profile?.bloodGroup} blood. You can save a life today!
                </p>
              </div>
            </div>
            <Link
              to="/donor/nearby-requests"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all flex-shrink-0"
            >
              View Now →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Blood Group */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <MdBloodtype className="text-red-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-red-600">{profile?.bloodGroup}</p>
          <p className="text-xs text-gray-500 mt-1">Blood Group</p>
        </div>

        {/* Total Donations */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <FaTint className="text-green-600 text-lg" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {profile?.donationHistory?.length || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Donations</p>
        </div>

        {/* Last Donation */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <FaCalendarAlt className="text-blue-600 text-lg" />
          </div>
          <p className="text-sm font-bold text-gray-800">
            {profile?.lastDonationDate
              ? new Date(profile.lastDonationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "Never"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Last Donation</p>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            profile?.eligibleToDonate ? "bg-green-100" : "bg-yellow-100"
          }`}>
            <FaCheckCircle className={`text-lg ${
              profile?.eligibleToDonate ? "text-green-600" : "text-yellow-600"
            }`} />
          </div>
          <p className={`text-sm font-bold ${
            profile?.eligibleToDonate ? "text-green-600" : "text-yellow-600"
          }`}>
            {profile?.eligibleToDonate ? "Eligible" : `${daysUntilEligible}d`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {profile?.eligibleToDonate ? "Ready to Donate" : "Days Left"}
          </p>
        </div>

      </div>

      {/* Eligibility Status Card */}
      {!profile?.eligibleToDonate && nextEligibleDate && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-800">Next Eligible Date</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You can donate again on{" "}
                <span className="font-semibold">
                  {nextEligibleDate.toDateString()}
                </span>
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                The 90-day waiting period ensures your health and safety
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Availability Status */}
      <div className={`rounded-2xl p-5 border-2 ${
        profile?.isAvailable
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              profile?.isAvailable ? "bg-green-500" : "bg-gray-400"
            }`}></div>
            <div>
              <p className="font-semibold text-gray-800">
                {profile?.isAvailable ? "You are Available to Donate" : "You are Unavailable"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile?.isAvailable
                  ? "Blood banks and hospitals can contact you"
                  : "You won't receive donation requests"}
              </p>
            </div>
          </div>
          <Link
            to="/donor/profile"
            className="text-xs text-red-600 font-semibold hover:underline"
          >
            Change →
          </Link>
        </div>
      </div>

      {/* Location Warning */}
      {profile?.location?.coordinates?.[0] === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <MdLocationOn className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700">Location Not Set!</h3>
              <p className="text-sm text-red-600 mt-1">
                Your location is not set. Nearby features will not work correctly.
              </p>
              <Link
                to="/donor/profile"
                className="inline-block mt-2 text-xs font-semibold text-red-600 underline"
              >
                Update Location from Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-all relative"
            >
              {/* ✅ Badge for nearby requests */}
              {action.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <div className={`w-10 h-10 ${action.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <action.icon className={`text-xl ${action.color.split(" ")[1]}`} />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Donations</h2>
          <Link to="/donor/donation-history" className="text-sm text-red-600 font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {profile?.donationHistory?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <FaHeart className="text-gray-300 text-4xl mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700">No donations yet</h3>
            <p className="text-sm text-gray-400 mt-1">Start donating to save lives!</p>
            <Link
              to="/donor/nearby-banks"
              className="inline-block mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Find Nearby Blood Banks
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.donationHistory.slice(-3).reverse().map((donation, index) => (
              <div key={index} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTint className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {donation.donatedTo === "blood-bank" ? "Blood Bank Donation" : "Hospital Donation"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(donation.donationDate).toDateString()} • {donation.units} unit • {donation.bloodGroup}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                  Completed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;