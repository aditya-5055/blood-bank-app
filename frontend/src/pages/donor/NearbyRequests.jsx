import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint, FaHospital } from "react-icons/fa";
import { MdLocationOn, MdMyLocation, MdAccessTime } from "react-icons/md";
import { getNearbyRequests, acceptBloodRequest, declineBloodRequest } from "../../services/donorService";

const NearbyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchNearbyRequests();
  }, []);

  const fetchNearbyRequests = async () => {
    setLoading(true);
    try {
      const response = await getNearbyRequests();
      setRequests(response.requests || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch nearby requests");
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
          const response = await getNearbyRequests(
            position.coords.longitude,
            position.coords.latitude
          );
          setRequests(response.requests || []);
          toast.success("Location refreshed!");
        } catch (error) {
          toast.error("Failed to fetch nearby requests");
        } finally {
          setLoading(false);
        }
      },
      () => toast.error("Location access denied")
    );
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId + "_accept");
    try {
      const response = await acceptBloodRequest(requestId);
      if (response.success) {
        toast.success("Request accepted! Please visit the hospital.");
        fetchNearbyRequests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (requestId) => {
    setActionLoading(requestId + "_decline");
    try {
      const response = await declineBloodRequest(requestId);
      if (response.success) {
        toast.success("Request declined");
        // Remove from list
        setRequests(requests.filter((r) => r._id !== requestId));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to decline request");
    } finally {
      setActionLoading(null);
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

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const diff = new Date(deadline) - now;
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
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
          <h1 className="text-2xl font-bold text-gray-800">Nearby Requests</h1>
          <p className="text-gray-500 mt-1">Blood requests from hospitals within 10km</p>
        </div>
        <button
          onClick={handleRefreshLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <MdMyLocation />
          Refresh
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          🩸 These are urgent blood requests from hospitals matching your blood group <span className="font-bold">within 10km</span> of your location.
        </p>
      </div>

      {/* Count */}
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {requests.length} requests found nearby
      </span>

      {/* List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No requests nearby</h3>
          <p className="text-gray-400 text-sm mt-1">
            No active blood requests matching your blood group within 10km
          </p>
          <button
            onClick={handleRefreshLocation}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border border-gray-50"
            >
              <div className="flex items-start justify-between mb-4">

                {/* Left */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTint className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-red-600">{request.bloodGroup}</span>
                      <span className="text-gray-600 font-medium">{request.units} unit(s)</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                        {request.urgencyLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <FaHospital className="text-orange-500 flex-shrink-0" />
                      <span className="font-medium">{request.hospitalId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <MdLocationOn className="flex-shrink-0" />
                      {request.hospitalId?.address?.city}, {request.hospitalId?.address?.state}
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                    <MdAccessTime />
                    {getTimeRemaining(request.deadline)}
                  </div>
                </div>

              </div>

              {/* Hospital Phone */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Hospital Contact</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{request.hospitalId?.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDecline(request._id)}
                  disabled={actionLoading === request._id + "_decline"}
                  className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {actionLoading === request._id + "_decline" ? "..." : "Decline"}
                </button>
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={actionLoading === request._id + "_accept"}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  {actionLoading === request._id + "_accept" ? "Accepting..." : "Accept & Donate"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default NearbyRequests;