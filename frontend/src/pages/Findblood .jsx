import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTint, FaSearch, FaPhone, FaClock, FaMapMarkerAlt, FaHospital } from "react-icons/fa";
import { MdBloodtype, MdLocalHospital, MdFilterList } from "react-icons/md";
import { findBlood } from "../services/Publicservice";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const FindBlood = () => {
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | blood-bank | hospital

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city to search.");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(false);
    try {
      const data = await findBlood(city.trim(), bloodGroup);
      setResults(data.data || []);
      setSearched(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((r) => {
    if (filter === "all") return true;
    return r.facilityType === filter;
  });

  const bloodBankCount = results.filter((r) => r.facilityType === "blood-bank").length;
  const hospitalCount = results.filter((r) => r.facilityType === "hospital").length;

  return (
    <div>

      {/* Hero / Search Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaTint className="text-white" />
            Find Blood Near You
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Search Blood Banks <br />
            <span className="text-yellow-300">&amp; Hospitals</span>
          </h1>
          <p className="text-red-100 mb-10 text-base md:text-lg max-w-xl mx-auto">
            Find verified blood banks and hospitals in your city. No login required.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* City Input */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  City
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Blood Group Select */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Blood Group (Optional)
                </label>
                <div className="relative">
                  <MdBloodtype className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Blood Groups</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaSearch />
                  )}
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>
            )}
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 min-h-[40vh]">
        <div className="max-w-5xl mx-auto">

          {/* Not searched yet */}
          {!searched && !loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <FaSearch className="text-red-400 text-3xl" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Enter a city above to find blood banks &amp; hospitals</p>
              <p className="text-gray-400 text-sm mt-1">Results will appear here</p>
            </div>
          )}

          {/* Results */}
          {searched && (
            <>
              {/* Results Header + Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredResults.length} {filteredResults.length === 1 ? "Result" : "Results"} found
                    <span className="text-gray-400 font-normal text-base"> in {city}</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {bloodBankCount} Blood Banks · {hospitalCount} Hospitals
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                  {[
                    { key: "all", label: "All" },
                    { key: "blood-bank", label: "Blood Banks" },
                    { key: "hospital", label: "Hospitals" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filter === tab.key
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No results */}
              {filteredResults.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FaTint className="text-gray-300 text-2xl" />
                  </div>
                  <p className="text-gray-500 font-medium">No facilities found in <span className="font-bold text-gray-700">{city}</span></p>
                  <p className="text-gray-400 text-sm mt-1">Try a different city name or remove the blood group filter</p>
                </div>
              )}

              {/* Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredResults.map((facility) => (
                  <div
                    key={facility._id}
                    className="bg-white rounded-2xl shadow border border-gray-100 p-5 hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          facility.facilityType === "blood-bank"
                            ? "bg-red-100"
                            : "bg-orange-100"
                        }`}>
                          {facility.facilityType === "blood-bank"
                            ? <MdBloodtype className="text-red-500 text-xl" />
                            : <MdLocalHospital className="text-orange-500 text-xl" />
                          }
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm leading-tight">{facility.name}</h3>
                          <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            facility.facilityType === "blood-bank"
                              ? "bg-red-100 text-red-600"
                              : "bg-orange-100 text-orange-600"
                          }`}>
                            {facility.facilityType === "blood-bank" ? "Blood Bank" : "Hospital"}
                          </span>
                        </div>
                      </div>
                      {facility.facilityCategory && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          {facility.facilityCategory}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-red-400 mt-0.5 flex-shrink-0" />
                        <span>
                          {facility.address?.city}, {facility.address?.state} — {facility.address?.pincode}
                        </span>
                      </div>

                      {facility.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhone className="text-green-400 flex-shrink-0" />
                          <a href={`tel:${facility.phone}`} className="hover:text-green-600 transition-colors">
                            {facility.phone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-blue-400 flex-shrink-0" />
                        {facility.is24x7 ? (
                          <span className="text-green-600 font-semibold">Open 24×7</span>
                        ) : (
                          <span>
                            {facility.operatingHours?.open || "09:00"} – {facility.operatingHours?.close || "18:00"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-red-600 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't find blood nearby?
          </h2>
          <p className="text-red-100 mb-8">
            Register as a donor or post an emergency request. Our network will reach out to nearby donors instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor/register"
              className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg"
            >
              🩸 Become a Donor
            </Link>
            <Link
              to="/facility/login"
              className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 border-2 border-white/30 transition-all"
            >
              🏥 Post Emergency Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FindBlood;