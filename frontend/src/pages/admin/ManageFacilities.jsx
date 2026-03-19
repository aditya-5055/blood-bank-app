import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaHospital, FaTint, FaSearch } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail, MdVerified } from "react-icons/md";
import { getAllFacilities } from "../../services/adminService";

const ManageFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    let result = facilities;
    if (filterType !== "all") {
      result = result.filter((f) => f.facilityType === filterType);
    }
    if (search) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.email.toLowerCase().includes(search.toLowerCase()) ||
          f.address?.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, filterType, facilities]);

  const fetchFacilities = async () => {
    try {
      const response = await getAllFacilities();
      setFacilities(response.facilities || []);
      setFiltered(response.facilities || []);
    } catch (error) {
      toast.error("Failed to load facilities");
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Facilities</h1>
        <p className="text-gray-500 mt-1">All approved hospitals and blood banks</p>
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
        <div className="flex gap-2">
          {["all", "hospital", "blood-bank"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filterType === type
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {type === "all" ? "All" : type === "hospital" ? "Hospitals" : "Blood Banks"}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
          {filtered.length} facilities found
        </span>
      </div>

      {/* Facilities Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <FaHospital className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No facilities found</h3>
          <p className="text-gray-400 text-sm mt-1">Try changing your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((facility) => (
            <div
              key={facility._id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-all border border-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    facility.facilityType === "hospital" ? "bg-orange-100" : "bg-blue-100"
                  }`}>
                    {facility.facilityType === "hospital"
                      ? <FaHospital className="text-orange-600" />
                      : <FaTint className="text-blue-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{facility.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      facility.facilityType === "hospital"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {facility.facilityType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <MdVerified className="text-lg" />
                  <span className="text-xs font-medium">Approved</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdEmail className="flex-shrink-0" />
                  {facility.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdPhone className="flex-shrink-0" />
                  {facility.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MdLocationOn className="flex-shrink-0" />
                  {facility.address?.city}, {facility.address?.state}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Reg: {facility.registrationNumber}
                </span>
                <span className="text-xs text-gray-400">
                  {facility.facilityCategory}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFacilities;