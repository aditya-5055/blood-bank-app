import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaTint } from "react-icons/fa";
import { MdLocalHospital, MdAccessTime } from "react-icons/md";
import { getAllRequests } from "../../services/adminService";

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  const statuses = ["all", "active", "confirmed", "completed", "expired", "cancelled"];
  const urgencies = ["all", "Critical", "High", "Moderate", "Normal"];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let result = requests;
    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }
    if (filterUrgency !== "all") {
      result = result.filter((r) => r.urgencyLevel === filterUrgency);
    }
    if (search) {
      result = result.filter(
        (r) =>
          r.hospitalId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.bloodGroup?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, filterStatus, filterUrgency, requests]);

  const fetchRequests = async () => {
    try {
      const response = await getAllRequests();
      setRequests(response.requests || []);
      setFiltered(response.requests || []);
    } catch (error) {
      toast.error("Failed to load requests");
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">All Blood Requests</h1>
        <p className="text-gray-500 mt-1">Monitor all blood requests in the system</p>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by hospital name or blood group..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />
      </div>

      {/* Status Filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Filter by Status</p>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
                filterStatus === status
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency Filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Filter by Urgency</p>
        <div className="flex gap-2 flex-wrap">
          {urgencies.map((urgency) => (
            <button
              key={urgency}
              onClick={() => setFilterUrgency(urgency)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                filterUrgency === urgency
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {urgency}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {filtered.length} requests found
      </span>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaTint className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No requests found</h3>
          <p className="text-gray-400 text-sm mt-1">Try changing your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border border-gray-50"
            >
              <div className="flex items-start justify-between">

                {/* Left Side */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTint className="text-red-600 text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-lg font-bold text-red-600">{request.bloodGroup}</span>
                      <span className="text-sm text-gray-600 font-medium">{request.units} units</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                        {request.urgencyLevel}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MdLocalHospital className="text-orange-500" />
                      <span>{request.hospitalId?.name || "Unknown Hospital"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <MdAccessTime />
                      <span>Posted: {new Date(request.createdAt).toDateString()}</span>
                      {request.completedAt && (
                        <span>• Completed: {new Date(request.completedAt).toDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">Stage</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    request.stage === "bloodbank"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}>
                    {request.stage}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRequests;