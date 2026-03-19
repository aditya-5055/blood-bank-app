import { Link } from "react-router-dom";
import { FaTint } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaTint className="text-red-500 text-xl" />
            <span className="font-bold text-lg">BloodConnect</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 BloodConnect. Saving lives, one drop at a time. 🩸
          </p>
          <div className="flex gap-6">
            <Link to="/donor/login" className="text-gray-400 hover:text-white text-sm transition-all">Donor Login</Link>
            <Link to="/facility/login" className="text-gray-400 hover:text-white text-sm transition-all">Facility Login</Link>
            <Link to="/admin/login" className="text-gray-400 hover:text-white text-sm transition-all">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;