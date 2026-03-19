import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  MdEdit, MdSave, MdClose, MdPhone,
  MdLocationOn, MdEmail, MdAccessTime, MdMyLocation
} from "react-icons/md";
import { FaHospital } from "react-icons/fa";
import { getHospitalProfile, updateHospitalProfile } from "../../services/hospitalService";
import { setUser } from "../../slices/authSlice";
import Avatar from "../../components/ui/Avatar";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    emergencyContact: "",
    address: { city: "", state: "", pincode: "" },
    operatingHours: { open: "", close: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getHospitalProfile();
      setProfile(response.hospital);
      setFormData({
        phone: response.hospital.phone || "",
        emergencyContact: response.hospital.emergencyContact || "",
        address: {
          city: response.hospital.address?.city || "",
          state: response.hospital.address?.state || "",
          pincode: response.hospital.address?.pincode || "",
        },
        operatingHours: {
          open: response.hospital.operatingHours?.open || "09:00",
          close: response.hospital.operatingHours?.close || "18:00",
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
    } else if (["open", "close"].includes(name)) {
      setFormData({ ...formData, operatingHours: { ...formData.operatingHours, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateHospitalProfile(formData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        fetchProfile();
        dispatch(setUser({ ...user, name: profile.name }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
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
            const response = await updateHospitalProfile({
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
        <h1 className="text-2xl font-bold text-gray-800">Hospital Profile</h1>
        <p className="text-gray-500 mt-1">Manage your hospital information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Top Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar name={profile?.name} size="xl" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{profile?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <MdEmail className="text-gray-400 text-sm" />
                <p className="text-gray-500 text-sm">{profile?.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold">Hospital</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-semibold">{profile?.facilityCategory}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${profile?.is24x7 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {profile?.is24x7 ? "24x7" : "Limited Hours"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all">
                  <MdClose />Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm rounded-xl transition-all">
                  <MdSave />{saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all">
                <MdEdit />Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <FaHospital className="inline mr-1" />Hospital Name
            </label>
            <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
              {profile?.name} (cannot be changed)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Registration Number</label>
            <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
              {profile?.registrationNumber} (cannot be changed)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdPhone className="inline mr-1" />Phone
            </label>
            {editing ? (
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Emergency Contact</label>
            {editing ? (
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.emergencyContact}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdLocationOn className="inline mr-1" />City
            </label>
            {editing ? (
              <input type="text" name="city" value={formData.address.city} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.city}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">State</label>
            {editing ? (
              <input type="text" name="state" value={formData.address.state} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.state}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Pincode</label>
            {editing ? (
              <input type="text" name="pincode" value={formData.address.pincode} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">{profile?.address?.pincode}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
              <MdAccessTime className="inline mr-1" />Operating Hours
            </label>
            {editing ? (
              <div className="flex gap-2">
                <input type="time" name="open" value={formData.operatingHours.open} onChange={handleChange} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                <span className="flex items-center text-gray-400 text-sm">to</span>
                <input type="time" name="close" value={formData.operatingHours.close} onChange={handleChange} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-800 px-4 py-2.5 bg-gray-50 rounded-xl">
                {profile?.is24x7 ? "Open 24x7" : `${profile?.operatingHours?.open} - ${profile?.operatingHours?.close}`}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ✅ Location Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">Hospital Location</h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your location so nearby blood banks and donors can find you
            </p>
            {profile?.location?.coordinates?.[0] !== 0 ? (
              <p className="text-xs text-green-600 mt-1 font-medium">✅ Location is set</p>
            ) : (
              <p className="text-xs text-red-500 mt-1 font-medium">⚠️ Location not set — blood requests may not work</p>
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