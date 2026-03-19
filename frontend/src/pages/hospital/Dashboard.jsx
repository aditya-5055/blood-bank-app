import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTint, FaHospital } from "react-icons/fa";
import {
  MdBloodtype, MdPending, MdCheckCircle,
  MdCancel, MdAccessTime
} from "react-icons/md";
import { getHospitalProfile } from "../../services/hospitalService";
import { getMyRequests } from "../../services/hospitalService";
import Avatar from "../../components/ui/Avatar";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        getHospitalProfile(),
        getMyRequests(),
      ]);
      setProfile(profileRes.hospital);
      setRequests(requestsRes.requests || []);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-600";
      case "confirmed": return "bg-yellow-100 text-yellow-600";
      case "completed": return "bg-green-100 text-green-600";
      case "expired": return "bg-gray-100 text-gray-500";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Critical": return "bg-red-100 text-red-600";
      case "High": return "bg-orange-100 text-orange-600";
      case "Moderate": return "bg-yellow-100 text-yellow-600";
      case "Normal": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Stats
  const active = requests.filter((r) => r.status === "active").length;
  const confirmed = requests.filter((r) => r.status === "confirmed").length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const cancelled = requests.filter((r) => r.status === "cancelled" || r.status === "expired").length;

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {profile?.name}! 🏥
            </h1>
            <p className="text-orange-100 mt-1 text-sm">
              Manage your blood requests and track their status
            </p>
          </div>
          <div className="hidden md:block">
            <Avatar name={profile?.name} size="xl" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdPending className="text-blue-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{active}</p>
          <p className="text-xs text-gray-500 mt-1">Active Requests</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdCheckCircle className="text-yellow-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{confirmed}</p>
          <p className="text-xs text-gray-500 mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdCheckCircle className="text-green-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{completed}</p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdCancel className="text-red-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{cancelled}</p>
          <p className="text-xs text-gray-500 mt-1">Cancelled/Expired</p>
        </div>
      </div>

      {/* Location Warning */}
      {profile?.location?.coordinates?.[0] === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div>
              <h3 className="font-bold text-red-700">Location Not Set!</h3>
              <p className="text-sm text-red-600 mt-1">
                Your location is not set. Blood requests will not work correctly.
              </p>
              <Link
                to="/hospital/profile"
                className="inline-block mt-2 text-xs font-semibold text-red-600 underline"
              >
                Update Location from Profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/hospital/post-request"
          className="bg-red-600 hover:bg-red-700 rounded-2xl p-5 text-white transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <MdBloodtype className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold">Post Blood Request</h3>
              <p className="text-red-100 text-xs mt-0.5">Request blood from nearby banks</p>
            </div>
          </div>
        </Link>
        <Link
          to="/hospital/my-requests"
          className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <FaTint className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">My Requests</h3>
              <p className="text-gray-500 text-xs mt-0.5">Track all blood requests</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Requests</h2>
          <Link to="/hospital/my-requests" className="text-sm text-red-600 font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <FaHospital className="text-gray-300 text-4xl mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700">No requests yet</h3>
            <p className="text-sm text-gray-400 mt-1">Post a blood request to get started</p>
            <Link
              to="/hospital/post-request"
              className="inline-block mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Post Blood Request
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 5).map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTint className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-red-600">{request.bloodGroup}</span>
                    <span className="text-sm text-gray-600">{request.units} units</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                      {request.urgencyLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MdAccessTime />
                    {new Date(request.createdAt).toDateString()}
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
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