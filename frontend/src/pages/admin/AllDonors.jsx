import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaUser } from "react-icons/fa";
import { MdPhone, MdEmail, MdLocationOn, MdBloodtype } from "react-icons/md";
import { getAllDonors } from "../../services/adminService";
import Avatar from "../../components/ui/Avatar";

const AllDonors = () => {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");

  const bloodGroups = ["all", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    let result = donors;
    if (filterBloodGroup !== "all") {
      result = result.filter((d) => d.bloodGroup === filterBloodGroup);
    }
    if (search) {
      result = result.filter(
        (d) =>
          d.fullName.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase()) ||
          d.address?.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, filterBloodGroup, donors]);

  const fetchDonors = async () => {
    try {
      const response = await getAllDonors();
      setDonors(response.donors || []);
      setFiltered(response.donors || []);
    } catch (error) {
      toast.error("Failed to load donors");
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-800">All Donors</h1>
        <p className="text-gray-500 mt-1">View all registered donors</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or city..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
      </div>

      {/* Blood Group Filter */}
      <div className="flex gap-2 flex-wrap">
        {bloodGroups.map((bg) => (
          <button
            key={bg}
            onClick={() => setFilterBloodGroup(bg)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filterBloodGroup === bg
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {bg === "all" ? "All Blood Groups" : bg}
          </button>
        ))}
      </div>

      {/* Count */}
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {filtered.length} donors found
      </span>

      {/* Donors Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaUser className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No donors found</h3>
          <p className="text-gray-400 text-sm mt-1">Try changing your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border border-gray-50"
            >
              {/* Donor Header */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={donor.fullName} size="md" />
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{donor.fullName}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                      {donor.bloodGroup}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      donor.isAvailable
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {donor.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdEmail className="flex-shrink-0 text-gray-400" />
                  <span className="truncate">{donor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdPhone className="flex-shrink-0 text-gray-400" />
                  {donor.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdLocationOn className="flex-shrink-0 text-gray-400" />
                  {donor.address?.city}, {donor.address?.state}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>Age: {donor.age}</span>
                  <span>Gender: {donor.gender}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  donor.eligibleToDonate
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {donor.eligibleToDonate ? "Eligible" : "Not Eligible"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllDonors;