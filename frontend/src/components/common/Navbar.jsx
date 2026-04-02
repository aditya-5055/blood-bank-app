// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaTint, FaSignInAlt, FaUserPlus, FaChevronDown } from "react-icons/fa";
// import { MdLocalHospital, MdBloodtype, MdVerified } from "react-icons/md";

// const Navbar = () => {
//   const [loginDropdown, setLoginDropdown] = useState(false);
//   const [registerDropdown, setRegisterDropdown] = useState(false);

//   const closeAll = () => {
//     setLoginDropdown(false);
//     setRegisterDropdown(false);
//   };

//   return (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2">
//           <FaTint className="text-red-600 text-2xl" />
//           <span className="text-red-600 font-bold text-xl">BloodConnect</span>
//         </Link>

//         {/* Nav Links */}
//         <div className="hidden md:flex items-center gap-8">
//           <a href="#about" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-all">About</a>
//           <a href="#how-it-works" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-all">How It Works</a>
//           <a href="#stats" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-all">Impact</a>
//         </div>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-3">

//           {/* Login Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => { setLoginDropdown(!loginDropdown); setRegisterDropdown(false); }}
//               className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-xl transition-all"
//             >
//               <FaSignInAlt />
//               Login
//               <FaChevronDown className={`text-xs transition-transform duration-200 ${loginDropdown ? "rotate-180" : ""}`} />
//             </button>
//             {loginDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
//                 <Link
//                   to="/donor/login"
//                   onClick={closeAll}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
//                 >
//                   <FaTint className="text-red-500" />
//                   Donor Login
//                 </Link>
//                 <Link
//                   to="/facility/login"
//                   onClick={closeAll}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
//                 >
//                   <MdLocalHospital className="text-orange-500" />
//                   Facility Login
//                 </Link>
//                 <div className="border-t border-gray-100">
//                   <Link
//                     to="/admin/login"
//                     onClick={closeAll}
//                     className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
//                   >
//                     <MdVerified className="text-purple-500" />
//                     Admin Login
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Register Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => { setRegisterDropdown(!registerDropdown); setLoginDropdown(false); }}
//               className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
//             >
//               <FaUserPlus />
//               Register
//               <FaChevronDown className={`text-xs transition-transform duration-200 ${registerDropdown ? "rotate-180" : ""}`} />
//             </button>
//             {registerDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
//                 <Link
//                   to="/donor/register"
//                   onClick={closeAll}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
//                 >
//                   <FaTint className="text-red-500" />
//                   Donor Register
//                 </Link>
//                 <Link
//                   to="/facility/register"
//                   onClick={closeAll}
//                   className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-gray-700 hover:text-red-600 transition-all"
//                 >
//                   <MdBloodtype className="text-blue-500" />
//                   Facility Register
//                 </Link>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;