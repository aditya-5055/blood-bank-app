import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTint, FaSignInAlt, FaUserPlus,
  FaChevronDown, FaBars, FaTimes
} from "react-icons/fa";
import { MdDashboard, MdLocalHospital, MdBloodtype, MdVerified } from "react-icons/md";
import { logout } from "../../slices/authSlice";
import { ROLES } from "../../constants/roles";
import Avatar from "../ui/Avatar";
import ConfirmationModal from "./ConfirmationModal";

const PublicNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, user } = useSelector((state) => state.auth);

  const [loginDropdown, setLoginDropdown] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Refs for click outside
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const profileRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginDropdown(false);
      }
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setRegisterDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setLoginDropdown(false);
    setRegisterDropdown(false);
    setProfileDropdown(false);
    setMobileMenu(false);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    closeAll();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (role === ROLES.DONOR) return "/donor/dashboard";
    if (role === ROLES.BLOOD_BANK) return "/bloodbank/dashboard";
    if (role === ROLES.HOSPITAL) return "/hospital/dashboard";
    if (role === ROLES.ADMIN) return "/admin/dashboard";
    return "/";
  };

  const getUserName = () => {
    if (role === ROLES.DONOR) return user?.fullName;
    return user?.name;
  };

  const getRoleLabel = () => {
    if (role === ROLES.DONOR) return "Donor";
    if (role === ROLES.BLOOD_BANK) return "Blood Bank";
    if (role === ROLES.HOSPITAL) return "Hospital";
    if (role === ROLES.ADMIN) return "Admin";
    return "";
  };

  const getRoleBadgeColor = () => {
    if (role === ROLES.DONOR) return "bg-red-100 text-red-600";
    if (role === ROLES.BLOOD_BANK) return "bg-blue-100 text-blue-600";
    if (role === ROLES.HOSPITAL) return "bg-orange-100 text-orange-600";
    if (role === ROLES.ADMIN) return "bg-purple-100 text-purple-600";
    return "";
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
              onClick={closeAll}
            >
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-all shadow-sm">
                <FaTint className="text-white text-xs" />
              </div>
              <span className="text-gray-900 font-bold text-base tracking-tight">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </Link>

            {/* ── Center Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/camps"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`
                }
              >
                Camps
              </NavLink>
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`
                }
              >
                Eligibility
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`
                }
              >
                About Us
              </NavLink>
            </div>

            {/* ── Right Side ── */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">

              {token ? (
                // ── LOGGED IN — Avatar Only ──
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <Avatar name={getUserName()} size="sm" />
                    <FaChevronDown
                      className={`text-xs text-gray-400 transition-transform duration-200 ${profileDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">

                      {/* User Info */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Avatar name={getUserName()} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate leading-none">
                              {getUserName() || "User"}
                            </p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                              {getRoleLabel()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dashboard */}
                      <Link
                        to={getDashboardLink()}
                        onClick={closeAll}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
                      >
                        <MdDashboard className="text-red-500 text-base flex-shrink-0" />
                        Dashboard
                      </Link>

                      {/* Logout */}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            setProfileDropdown(false);
                            setShowLogoutModal(true);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all w-full text-left"
                        >
                          <FaSignInAlt className="text-red-500 text-base flex-shrink-0" />
                          Logout
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              ) : (
                // ── NOT LOGGED IN ──
                <>
                  {/* Login Dropdown */}
                  <div className="relative" ref={loginRef}>
                    <button
                      onClick={() => { setLoginDropdown(!loginDropdown); setRegisterDropdown(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-red-600 font-medium text-sm rounded-lg transition-all hover:bg-gray-50"
                    >
                      Login
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${loginDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {loginDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <p className="px-4 py-2 text-xs text-gray-400 font-semibold uppercase bg-gray-50 border-b border-gray-100">
                          Login As
                        </p>
                        <Link to="/donor/login" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all">
                          <FaTint className="text-red-500 flex-shrink-0" />
                          Donor
                        </Link>
                        <Link to="/facility/login" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all">
                          <MdLocalHospital className="text-orange-500 flex-shrink-0" />
                          Hospital / Blood Bank
                        </Link>
                        <div className="border-t border-gray-100">
                          <Link to="/admin/login" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-400 hover:text-red-600 transition-all">
                            <MdVerified className="text-purple-400 flex-shrink-0" />
                            Admin
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Register Dropdown */}
                  <div className="relative" ref={registerRef}>
                    <button
                      onClick={() => { setRegisterDropdown(!registerDropdown); setLoginDropdown(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
                    >
                      <FaUserPlus className="text-xs" />
                      Donate Now
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${registerDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {registerDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <p className="px-4 py-2 text-xs text-gray-400 font-semibold uppercase bg-gray-50 border-b border-gray-100">
                          Register As
                        </p>
                        <Link to="/donor/register" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all">
                          <FaTint className="text-red-500 flex-shrink-0" />
                          Donor
                        </Link>
                        <Link to="/facility/register" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all">
                          <MdBloodtype className="text-blue-500 flex-shrink-0" />
                          Hospital / Blood Bank
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Mobile Button ── */}
            <button
              className="md:hidden text-gray-600 hover:text-red-600 p-1"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>

          </div>

          {/* ── Mobile Menu ── */}
          {mobileMenu && (
            <div className="md:hidden mt-3 pb-3 border-t border-gray-100 pt-3 space-y-1">
              <Link to="/" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium">Home</Link>
              <Link to="/camps" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium">Camps</Link>
              <Link to="/learn" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium">Eligibility</Link>
              <Link to="/about" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium">About Us</Link>
              <div className="border-t border-gray-100 pt-2 space-y-1">
                {token ? (
                  <>
                    <Link to={getDashboardLink()} onClick={closeAll} className="block px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">
                      Dashboard →
                    </Link>
                    <button
                      onClick={() => { setMobileMenu(false); setShowLogoutModal(true); }}
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/donor/login" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Donor Login</Link>
                    <Link to="/facility/login" onClick={closeAll} className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Facility Login</Link>
                    <Link to="/donor/register" onClick={closeAll} className="block px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">Donate Now →</Link>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </nav>

      {/* Logout Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout from BloodConnect?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default PublicNavbar;