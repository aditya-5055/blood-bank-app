import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTint, FaHandHoldingHeart, FaPhone } from "react-icons/fa";
import { MdLocationOn, MdAccessTime, MdPhone } from "react-icons/md";
import { getMyDonationRequests } from "../../services/donorService";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const filters = ["all", "pending", "confirmed"];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getMyDonationRequests();
      // ✅ Only show pending and confirmed
      const activeRequests = (response.donationRequests || []).filter(
        (r) => r.status === "pending" || r.status === "confirmed"
      );
      setRequests(activeRequests);
    } catch (error) {
      toast.error("Failed to load donation requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-600";
      case "confirmed": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "confirmed": return "✅";
      default: return "•";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending": return "Waiting for blood bank to confirm your request";
      case "confirmed": return "Blood bank confirmed! Please visit them as soon as possible 🏥";
      default: return "";
    }
  };

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Active Requests</h1>
        <p className="text-gray-500 mt-1">Your pending and confirmed donation requests</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === "pending").length}
          </p>
          <p className="text-xs font-medium text-yellow-600 mt-0.5">⏳ Pending</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {requests.filter((r) => r.status === "confirmed").length}
          </p>
          <p className="text-xs font-medium text-blue-600 mt-0.5">✅ Confirmed</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === f
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {f} ({f === "all" ? requests.length : requests.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-500">
          💡 Completed and declined requests are available in{" "}
          <a href="/donor/donation-history" className="text-red-600 font-semibold underline">
            Donation History
          </a>
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaHandHoldingHeart className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            {filter === "all" ? "No active requests" : `No ${filter} requests`}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all"
              ? "Send a donation request to a nearby blood bank"
              : `You have no ${filter} requests right now`}
          </p>
          
          <a href="/donor/nearby-banks"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            Find Nearby Blood Banks →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((request) => (
            <div
              key={request._id}
              className={`bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border-l-4 ${
                request.status === "pending" ? "border-yellow-400" : "border-blue-400"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTint className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {request.bloodBankId?.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Proactive Donation Request
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)} {request.status}
                </span>
              </div>

              {/* Status Message */}
              <div className={`mb-4 p-3 rounded-xl text-sm border ${
                request.status === "pending"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                {getStatusMessage(request.status)}
              </div>

              {/* Blood Bank Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdPhone className="text-gray-400 flex-shrink-0" />
                  {request.bloodBankId?.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdLocationOn className="text-gray-400 flex-shrink-0" />
                  {request.bloodBankId?.address?.city}, {request.bloodBankId?.address?.state}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdAccessTime className="text-gray-400 flex-shrink-0" />
                  {request.bloodBankId?.operatingHours?.open} - {request.bloodBankId?.operatingHours?.close}
                </div>
              </div>

              {/* Notes */}
              {request.notes && (
                <div className="mb-3 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Your Note:</p>
                  <p className="text-sm text-gray-700 mt-0.5">{request.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Sent: {new Date(request.createdAt).toDateString()}
                </span>
                {/* ✅ Confirmed — show Call button */}
                {request.status === "confirmed" && (
                  
                   <a href={`tel:${request.bloodBankId?.phone}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <FaPhone className="text-xs" />
                    Call Blood Bank
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyRequests;