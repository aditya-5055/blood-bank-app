import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  MdEdit, MdSave, MdClose, MdPhone,
  MdLocationOn, MdBloodtype, MdMyLocation
} from "react-icons/md";
import { FaWeight, FaCalendarAlt } from "react-icons/fa";
import { getDonorProfile, updateDonorProfile, toggleAvailability } from "../../services/donorService";
import { setUser } from "../../slices/authSlice";
import Avatar from "../../components/ui/Avatar";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    weight: "",
    address: { city: "", state: "", pincode: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getDonorProfile();
      setProfile(response.donor);
      setFormData({
        fullName: response.donor.fullName || "",
        phone: response.donor.phone || "",
        weight: response.donor.weight || "",
        address: {
          city: response.donor.address?.city || "",
          state: response.donor.address?.state || "",
          pincode: response.donor.address?.pincode || "",
        },
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "state", "pincode"].includes(name)) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateDonorProfile({
        ...formData,
        weight: Number(formData.weight),
      });
      if (response.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        fetchProfile();
        dispatch(setUser({ ...user, fullName: formData.fullName }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const response = await toggleAvailability();
      if (response.success) {
        toast.success(response.message);
        setProfile({ ...profile, isAvailable: response.isAvailable });
      }
    } catch (error) {
      toast.error("Failed to toggle availability");
    } finally {
      setToggling(false);
    }
  };

  // ✅ Update location
  const handleUpdateLocation = async () => {
    setUpdatingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported by your browser");
        setUpdatingLocation(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await updateDonorProfile({
              location: {
                type: "Point",
                coordinates: [
                  position.coords.longitude,
                  position.coords.latitude,
                ],
              },
            });
            if (response.success) {
              toast.success("Location updated successfully!");
              fetchProfile();
            }
          } catch {
            toast.error("Failed to update location");
          } finally {
            setUpdatingLocation(false);
          }
        },
        () => {
          toast.error("Location access denied. Please allow location access.");
          setUpdatingLocation(false);
        }
      );
    } catch {
      toast.error("Failed to update location");
      setUpdatingLocation(false);
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
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Avatar + Name + Actions */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar name={profile?.fullName} size="xl" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{profile?.fullName}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">
                  {profile?.bloodGroup}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                  profile?.isAvailable
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {profile?.isAvailable ? "Available" : "Unavailable"}
                </span>
                {!profile?.eligibleToDonate && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded-full font-semibold">
                    Not Eligible Yet
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit / Save Buttons */}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all"
                >
                  <MdClose />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  <MdSave />
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all"
              >
                <MdEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Name</label>
            {editing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdPhone className="inline mr-1" />Phone
            </label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.phone}</p>
            )}
          </div>

          {/* Blood Group — Read Only */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdBloodtype className="inline mr-1" />Blood Group
            </label>
            <p className="text-sm font-medium text-red-600 px-4 py-2.5 bg-red-50 rounded-xl">
              {profile?.bloodGroup} (cannot be changed)
            </p>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <FaWeight className="inline mr-1" />Weight (kg)
            </label>
            {editing ? (
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min={45}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
                {profile?.weight ? `${profile.weight} kg` : "Not set"}
              </p>
            )}
          </div>

          {/* Age — Read Only */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Age</label>
            <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
              {profile?.age} years (cannot be changed)
            </p>
          </div>

          {/* Gender — Read Only */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Gender</label>
            <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
              {profile?.gender} (cannot be changed)
            </p>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdLocationOn className="inline mr-1" />City
            </label>
            {editing ? (
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">State</label>
            {editing ? (
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.state}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Pincode</label>
            {editing ? (
              <input
                type="text"
                name="pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.pincode}</p>
            )}
          </div>

          {/* Last Donation */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <FaCalendarAlt className="inline mr-1" />Last Donation
            </label>
            <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
              {profile?.lastDonationDate
                ? new Date(profile.lastDonationDate).toDateString()
                : "Never donated"}
            </p>
          </div>

        </div>
      </div>

      {/* Availability Toggle Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">Donation Availability</h3>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.isAvailable
                ? "You are currently available to donate blood"
                : "You are currently unavailable to donate blood"}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={`px-5 py-2.5 font-semibold text-sm rounded-xl transition-all ${
              profile?.isAvailable
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {toggling
              ? "Updating..."
              : profile?.isAvailable
              ? "Set Unavailable"
              : "Set Available"}
          </button>
        </div>
      </div>

      {/* ✅ Location Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">My Location</h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your location to see nearby blood banks and camps
            </p>
            {profile?.location?.coordinates?.[0] !== 0 ? (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✅ Location is set
              </p>
            ) : (
              <p className="text-xs text-red-500 mt-1 font-medium">
                ⚠️ Location not set — nearby features may not work
              </p>
            )}
          </div>
          <button
            onClick={handleUpdateLocation}
            disabled={updatingLocation}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <MdMyLocation />
            {updatingLocation ? "Updating..." : "Update Location"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Profile;