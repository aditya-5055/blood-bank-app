import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaClock, FaUsers } from "react-icons/fa";
import { MdCampaign, MdMyLocation, MdCalendarToday } from "react-icons/md";
import { getNearbyCamps, registerForCamp } from "../../services/donorService";

const NearbyCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    fetchNearbyCamps();
  }, []);

  const fetchNearbyCamps = async () => {
    setLoading(true);
    try {
      const response = await getNearbyCamps();
      setCamps(response.camps || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch nearby camps");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLoading(true);
        try {
          const response = await getNearbyCamps(
            position.coords.longitude,
            position.coords.latitude
          );
          setCamps(response.camps || []);
          toast.success("Location refreshed!");
        } catch (error) {
          toast.error("Failed to fetch nearby camps");
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location access denied")
    );
  };

  const handleRegister = async (campId) => {
    setRegistering(campId);
    try {
      const response = await registerForCamp(campId);
      if (response.success) {
        toast.success("Registered for camp successfully!");
        fetchNearbyCamps();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to register");
    } finally {
      setRegistering(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-600";
      case "ongoing": return "bg-green-100 text-green-600";
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nearby Camps</h1>
          <p className="text-gray-500 mt-1">Blood donation camps within 10km</p>
        </div>
        <button
          onClick={handleRefreshLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <MdMyLocation />
          Refresh
        </button>
      </div>

      {/* Count */}
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {camps.length} camps found nearby
      </span>

      {/* List */}
      {camps.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <MdCampaign className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No camps nearby</h3>
          <p className="text-gray-400 text-sm mt-1">
            No upcoming donation camps found within 10km
          </p>
          <button
            onClick={handleRefreshLocation}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {camps.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdCampaign className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{camp.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      by {camp.bloodBankId?.name}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(camp.status)}`}>
                  {camp.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdCalendarToday className="text-gray-400 flex-shrink-0" />
                  {new Date(camp.campDate).toDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-gray-400 flex-shrink-0 text-xs" />
                  {camp.startTime} - {camp.endTime}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400 flex-shrink-0 text-xs" />
                  {camp.address?.street}, {camp.address?.city}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaUsers className="text-gray-400 flex-shrink-0 text-xs" />
                  {camp.availableSeats} seats available
                </div>
              </div>

              {/* Description */}
              {camp.description && (
                <p className="text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg p-2">
                  {camp.description}
                </p>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 pt-3">
                {camp.isRegistered ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-xl">
                    <span className="text-green-600 text-sm font-semibold">
                      ✅ Already Registered
                    </span>
                  </div>
                ) : camp.availableSeats <= 0 ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 text-sm font-semibold">
                      Camp is Full
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(camp._id)}
                    disabled={registering === camp._id}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    {registering === camp._id ? "Registering..." : "Register for Camp"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyCamps;