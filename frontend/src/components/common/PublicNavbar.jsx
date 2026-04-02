 

// import { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   FaTint, FaSignInAlt, FaUserPlus, FaHeartbeat,
//   FaChevronDown, FaBars, FaTimes, FaUserCircle,
//   FaCalendarAlt, FaBookOpen, FaInfoCircle, FaHome,
//   FaSignOutAlt, FaChartLine, FaHospitalUser, FaBuilding
// } from "react-icons/fa";
// import { MdDashboard, MdLocalHospital, MdBloodtype, MdVerified } from "react-icons/md";
// import { logout } from "../../slices/authSlice";
// import { ROLES } from "../../constants/roles";
// import Avatar from "../ui/Avatar";
// import ConfirmationModal from "./ConfirmationModal";

// const PublicNavbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token, role, user } = useSelector((state) => state.auth);
//   const [scrolled, setScrolled] = useState(false);

//   const [loginDropdown, setLoginDropdown] = useState(false);
//   const [registerDropdown, setRegisterDropdown] = useState(false);
//   const [profileDropdown, setProfileDropdown] = useState(false);
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const loginRef = useRef(null);
//   const registerRef = useRef(null);
//   const profileRef = useRef(null);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (loginRef.current && !loginRef.current.contains(event.target)) {
//         setLoginDropdown(false);
//       }
//       if (registerRef.current && !registerRef.current.contains(event.target)) {
//         setRegisterDropdown(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const closeAll = () => {
//     setLoginDropdown(false);
//     setRegisterDropdown(false);
//     setProfileDropdown(false);
//     setMobileMenu(false);
//   };

//   const confirmLogout = () => {
//     dispatch(logout());
//     setShowLogoutModal(false);
//     closeAll();
//     navigate("/");
//   };

//   const getDashboardLink = () => {
//     if (role === ROLES.DONOR) return "/donor/dashboard";
//     if (role === ROLES.BLOOD_BANK) return "/bloodbank/dashboard";
//     if (role === ROLES.HOSPITAL) return "/hospital/dashboard";
//     if (role === ROLES.ADMIN) return "/admin/dashboard";
//     return "/";
//   };

//   const getUserName = () => {
//     if (role === ROLES.DONOR) return user?.fullName;
//     return user?.name;
//   };

//   const getRoleLabel = () => {
//     if (role === ROLES.DONOR) return "Donor";
//     if (role === ROLES.BLOOD_BANK) return "Blood Bank";
//     if (role === ROLES.HOSPITAL) return "Hospital";
//     if (role === ROLES.ADMIN) return "Admin";
//     return "";
//   };

//   const getRoleBadgeColor = () => {
//     if (role === ROLES.DONOR) return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 ring-1 ring-red-200";
//     if (role === ROLES.BLOOD_BANK) return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-200";
//     if (role === ROLES.HOSPITAL) return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 ring-1 ring-orange-200";
//     if (role === ROLES.ADMIN) return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 ring-1 ring-purple-200";
//     return "";
//   };

//   const navLinks = [
//     { to: "/", label: "Home", icon: FaHome, end: true },
   
//     { to: "/learn", label: "Learn", icon: FaBookOpen },
//     { to: "/about", label: "About Us", icon: FaInfoCircle },
//   ];

//   return (
//     <>
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled 
//           ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100" 
//           : "bg-white border-b border-gray-100"
//       }`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-12 lg:h-20">

//             {/* Logo */}
//             <Link
//               to="/"
//               className="flex items-center gap-2.5 group flex-shrink-0"
//               onClick={closeAll}
//             >
//               <div className="relative">
//                 <div className="absolute inset-0 bg-red-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
//                 <div className="relative w-9 h-9 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
//                   <FaTint className="text-white text-lg" />
//                 </div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-gray-900 font-bold text-xl tracking-tight">
//                   Blood<span className="text-red-600">Connect</span>
//                 </span>
//                 <span className="text-[10px] text-gray-400 -mt-1">Save Lives</span>
//               </div>
//             </Link>

//             {/* Desktop Navigation Links */}
//             <div className="hidden lg:flex items-center gap-1">
//               {navLinks.map((link) => (
//                 <NavLink
//                   key={link.to}
//                   to={link.to}
//                   end={link.end}
//                   className={({ isActive }) =>
//                     `group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
//                       isActive
//                         ? "text-red-600 bg-red-50"
//                         : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
//                     }`
//                   }
//                 >
//                   <div className="flex items-center gap-2">
//                     <link.icon className="text-base" />
//                     <span>{link.label}</span>
//                   </div>
//                   {({ isActive }) => isActive && (
//                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-red-600 rounded-full"></div>
//                   )}
//                 </NavLink>
//               ))}
//             </div>

//             {/* Desktop Right Side */}
//             <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
//               {token ? (
//                 // Logged In - Profile
//                 <div className="relative" ref={profileRef}>
//                   <button
//                     onClick={() => setProfileDropdown(!profileDropdown)}
//                     className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-red-200 group"
//                   >
//                     <Avatar name={getUserName()} size="sm" />
//                     <div className="text-left hidden xl:block">
//                       <p className="text-sm font-semibold text-gray-800 leading-tight">
//                         {getUserName()?.split(" ")[0] || "User"}
//                       </p>
//                       <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
//                         {getRoleLabel()}
//                       </span>
//                     </div>
//                     <FaChevronDown
//                       className={`text-xs text-gray-400 transition-transform duration-200 ${
//                         profileDropdown ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>

//                   {profileDropdown && (
//                     <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
//                       {/* User Header */}
//                       <div className="relative bg-gradient-to-r from-red-50 to-red-100 px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar name={getUserName()} size="lg" />
//                           <div className="flex-1">
//                             <p className="text-base font-bold text-gray-800">
//                               {getUserName() || "User"}
//                             </p>
//                             <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
//                               {getRoleLabel()}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Menu Items */}
//                       <div className="py-2">
//                         <Link
//                           to={getDashboardLink()}
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all group"
//                         >
//                           <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                             <MdDashboard className="text-red-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-medium">Dashboard</p>
//                             <p className="text-xs text-gray-400">View your analytics</p>
//                           </div>
//                         </Link>

//                         {role === ROLES.DONOR && (
//                           <Link
//                             to="/donor/donation-history"
//                             onClick={closeAll}
//                             className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all group"
//                           >
//                             <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                               <FaHeartbeat className="text-red-500 text-lg" />
//                             </div>
//                             <div>
//                               <p className="font-medium">My Donations</p>
//                               <p className="text-xs text-gray-400">Track donation history</p>
//                             </div>
//                           </Link>
//                         )}

//                         <div className="border-t border-gray-100 my-2"></div>

//                         <button
//                           onClick={() => {
//                             setProfileDropdown(false);
//                             setShowLogoutModal(true);
//                           }}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all w-full text-left group"
//                         >
//                           <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                             <FaSignOutAlt className="text-red-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-medium">Logout</p>
//                             <p className="text-xs text-gray-400">Sign out of your account</p>
//                           </div>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // Not Logged In
//                 <>
//                   {/* Login Dropdown */}
//                   <div className="relative" ref={loginRef}>
//                     <button
//                       onClick={() => {
//                         setLoginDropdown(!loginDropdown);
//                         setRegisterDropdown(false);
//                       }}
//                       className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm rounded-xl transition-all duration-200 hover:bg-gray-50"
//                     >
//                       <FaSignInAlt className="text-sm" />
//                       Login
//                       <FaChevronDown
//                         className={`text-xs transition-transform duration-200 ${
//                           loginDropdown ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {loginDropdown && (
//                       <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
//                         <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
//                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                             Select Account Type
//                           </p>
//                         </div>
//                         <Link
//                           to="/donor/login"
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group"
//                         >
//                           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                             <FaTint className="text-red-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">Donor</p>
//                             <p className="text-xs text-gray-500">Give the gift of life</p>
//                           </div>
//                         </Link>
//                         <Link
//                           to="/facility/login"
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50"
//                         >
//                           <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                             <MdLocalHospital className="text-blue-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">Facility</p>
//                             <p className="text-xs text-gray-500">Hospital / Blood Bank</p>
//                           </div>
//                         </Link>
//                         <Link
//                           to="/admin/login"
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50"
//                         >
//                           <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                             <MdVerified className="text-purple-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">Admin</p>
//                             <p className="text-xs text-gray-500">System administrator</p>
//                           </div>
//                         </Link>
//                       </div>
//                     )}
//                   </div>

//                   {/* Register Button */}
//                   <div className="relative" ref={registerRef}>
//                     <button
//                       onClick={() => {
//                         setRegisterDropdown(!registerDropdown);
//                         setLoginDropdown(false);
//                       }}
//                       className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
//                     >
//                       <FaUserPlus className="text-sm" />
//                       Donate Now
//                       <FaChevronDown
//                         className={`text-xs transition-transform duration-200 ${
//                           registerDropdown ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {registerDropdown && (
//                       <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
//                         <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
//                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                             Join as a
//                           </p>
//                         </div>
//                         <Link
//                           to="/donor/register"
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group"
//                         >
//                           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
//                             <FaTint className="text-red-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">Blood Donor</p>
//                             <p className="text-xs text-gray-500">Save lives by donating</p>
//                           </div>
//                         </Link>
//                         <Link
//                           to="/facility/register"
//                           onClick={closeAll}
//                           className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50"
//                         >
//                           <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                             <FaBuilding className="text-blue-500 text-lg" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-800">Blood Bank / Hospital</p>
//                             <p className="text-xs text-gray-500">Manage blood inventory</p>
//                           </div>
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
//               onClick={() => setMobileMenu(!mobileMenu)}
//             >
//               {mobileMenu ? (
//                 <FaTimes className="text-xl" />
//               ) : (
//                 <FaBars className="text-xl" />
//               )}
//             </button>
//           </div>

//           {/* Mobile Menu */}
//           {mobileMenu && (
//             <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
//               <div className="space-y-1">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.to}
//                     to={link.to}
//                     onClick={closeAll}
//                     className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
//                   >
//                     <link.icon className="text-lg" />
//                     <span>{link.label}</span>
//                   </Link>
//                 ))}

//                 <div className="border-t border-gray-100 my-2"></div>

//                 {token ? (
//                   <>
//                     <Link
//                       to={getDashboardLink()}
//                       onClick={closeAll}
//                       className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold"
//                     >
//                       <MdDashboard className="text-lg" />
//                       <span>Dashboard</span>
//                     </Link>
//                     <button
//                       onClick={() => {
//                         setMobileMenu(false);
//                         setShowLogoutModal(true);
//                       }}
//                       className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left"
//                     >
//                       <FaSignOutAlt className="text-lg" />
//                       <span>Logout</span>
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to="/donor/login"
//                       onClick={closeAll}
//                       className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
//                     >
//                       <FaSignInAlt className="text-lg" />
//                       <span>Donor Login</span>
//                     </Link>
//                     <Link
//                       to="/facility/login"
//                       onClick={closeAll}
//                       className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
//                     >
//                       <FaHospitalUser className="text-lg" />
//                       <span>Facility Login</span>
//                     </Link>
//                     <Link
//                       to="/donor/register"
//                       onClick={closeAll}
//                       className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold mt-2 shadow-md"
//                     >
//                       <FaHeartbeat className="text-lg" />
//                       <span>Donate Now →</span>
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Spacer to prevent content from hiding under fixed navbar */}
//       <div className="h-16 lg:h-20"></div>

//       {/* Logout Modal */}
//       <ConfirmationModal
//         isOpen={showLogoutModal}
//         title="Logout"
//         message="Are you sure you want to logout from BloodConnect?"
//         onConfirm={confirmLogout}
//         onCancel={() => setShowLogoutModal(false)}
//       />
//     </>
//   );
// };

// export default PublicNavbar;
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTint, FaSignInAlt, FaUserPlus, FaHeartbeat,
  FaChevronDown, FaBars, FaTimes,
  FaCalendarAlt, FaBookOpen, FaInfoCircle, FaHome,
  FaSignOutAlt, FaHospitalUser, FaBuilding, FaSearch
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
  const [scrolled, setScrolled] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) setLoginDropdown(false);
      if (registerRef.current && !registerRef.current.contains(event.target)) setRegisterDropdown(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileDropdown(false);
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
    if (role === ROLES.DONOR) return "bg-gradient-to-r from-red-50 to-red-100 text-red-700 ring-1 ring-red-200";
    if (role === ROLES.BLOOD_BANK) return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-200";
    if (role === ROLES.HOSPITAL) return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 ring-1 ring-orange-200";
    if (role === ROLES.ADMIN) return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 ring-1 ring-purple-200";
    return "";
  };

  // ✅ All 5 public nav links — no role-specific ones
  const navLinks = [
    { to: "/", label: "Home", icon: FaHome, end: true },
    { to: "/camps", label: "Blood Camps", icon: FaCalendarAlt },
    { to: "/find-blood", label: "Find Blood", icon: MdBloodtype },
    { to: "/learn", label: "Learn", icon: FaBookOpen },
    { to: "/about", label: "About Us", icon: FaInfoCircle },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ h-14 on mobile, h-16 on desktop */}
          <div className="flex items-center justify-between h-14 lg:h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" onClick={closeAll}>
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <FaTint className="text-white text-lg" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-xl tracking-tight">
                  Blood<span className="text-red-600">Connect</span>
                </span>
                <span className="text-[10px] text-gray-400 -mt-1">Save Lives</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <link.icon className="text-base flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {token ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-red-200 group"
                  >
                    <Avatar name={getUserName()} size="sm" />
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {getUserName()?.split(" ")[0] || "User"}
                      </p>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                        {getRoleLabel()}
                      </span>
                    </div>
                    <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${profileDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={getUserName()} size="lg" />
                          <div className="flex-1">
                            <p className="text-base font-bold text-gray-800">{getUserName() || "User"}</p>
                            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
                              {getRoleLabel()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to={getDashboardLink()}
                          onClick={closeAll}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <MdDashboard className="text-red-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-400">View your analytics</p>
                          </div>
                        </Link>

                        {role === ROLES.DONOR && (
                          <Link
                            to="/donor/donation-history"
                            onClick={closeAll}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all group"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <FaHeartbeat className="text-red-500 text-lg" />
                            </div>
                            <div>
                              <p className="font-medium">My Donations</p>
                              <p className="text-xs text-gray-400">Track donation history</p>
                            </div>
                          </Link>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => { setProfileDropdown(false); setShowLogoutModal(true); }}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all w-full text-left group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaSignOutAlt className="text-red-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-gray-400">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Login Dropdown */}
                  <div className="relative" ref={loginRef}>
                    <button
                      onClick={() => { setLoginDropdown(!loginDropdown); setRegisterDropdown(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 font-medium text-sm rounded-xl transition-all duration-200 hover:bg-gray-50"
                    >
                      <FaSignInAlt className="text-sm" />
                      Login
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${loginDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {loginDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Account Type</p>
                        </div>
                        <Link to="/donor/login" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaTint className="text-red-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Donor</p>
                            <p className="text-xs text-gray-500">Give the gift of life</p>
                          </div>
                        </Link>
                        <Link to="/facility/login" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <MdLocalHospital className="text-blue-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Facility</p>
                            <p className="text-xs text-gray-500">Hospital / Blood Bank</p>
                          </div>
                        </Link>
                        <Link to="/admin/login" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <MdVerified className="text-purple-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Admin</p>
                            <p className="text-xs text-gray-500">System administrator</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Register Dropdown */}
                  <div className="relative" ref={registerRef}>
                    <button
                      onClick={() => { setRegisterDropdown(!registerDropdown); setLoginDropdown(false); }}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <FaUserPlus className="text-sm" />
                      Donate Now
                      <FaChevronDown className={`text-xs transition-transform duration-200 ${registerDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {registerDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Join as a</p>
                        </div>
                        <Link to="/donor/register" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <FaTint className="text-red-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Blood Donor</p>
                            <p className="text-xs text-gray-500">Save lives by donating</p>
                          </div>
                        </Link>
                        <Link to="/facility/register" onClick={closeAll} className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-all group border-t border-gray-50">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FaBuilding className="text-blue-500 text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Blood Bank / Hospital</p>
                            <p className="text-xs text-gray-500">Manage blood inventory</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeAll}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <link.icon className="text-lg" />
                    <span>{link.label}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-100 my-2"></div>

                {token ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={closeAll}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold"
                    >
                      <MdDashboard className="text-lg" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => { setMobileMenu(false); setShowLogoutModal(true); }}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/donor/login" onClick={closeAll} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                      <FaSignInAlt className="text-lg" />
                      <span>Donor Login</span>
                    </Link>
                    <Link to="/facility/login" onClick={closeAll} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                      <FaHospitalUser className="text-lg" />
                      <span>Facility Login</span>
                    </Link>
                    <Link to="/donor/register" onClick={closeAll} className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold mt-2 shadow-md">
                      <FaHeartbeat className="text-lg" />
                      <span>Donate Now →</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Spacer matches navbar height exactly — h-14 mobile, h-16 desktop */}
      <div className="h-14 lg:h-16"></div>

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