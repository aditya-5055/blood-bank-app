import { Link } from "react-router-dom";
import { FaTint, FaHandHoldingHeart, FaUserPlus } from "react-icons/fa";
import { MdLocalHospital, MdBloodtype, MdPeople, MdVerified } from "react-icons/md";

const Home = () => {
  return (
    <div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaTint className="text-white" />
            India's Blood Donation Network
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Every Drop of Blood <br />
            <span className="text-yellow-300">Saves a Life</span>
          </h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Connect with nearby blood banks, hospitals and donors.
            Real-time blood requests, camp registrations and inventory
            management — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor/register"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg text-sm"
            >
              🩸 Become a Donor
            </Link>
            <Link
              to="/facility/register"
              className="px-8 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 border-2 border-white/30 transition-all text-sm"
            >
              🏥 Register Facility
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "1000+", label: "Donors Registered", color: "text-red-600" },
              { number: "50+", label: "Hospitals Connected", color: "text-orange-500" },
              { number: "20+", label: "Blood Banks", color: "text-blue-600" },
              { number: "5000+", label: "Lives Saved", color: "text-green-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow p-6">
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.number}</p>
                <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What is BloodConnect?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              BloodConnect is a smart blood donation management platform that
              connects donors, blood banks, and hospitals in real time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaTint, color: "red", title: "For Donors", desc: "Find nearby blood banks, register for camps, and respond to emergency blood requests in your area." },
              { icon: MdLocalHospital, color: "orange", title: "For Hospitals", desc: "Post urgent blood requests and get connected with nearby blood banks and eligible donors instantly." },
              { icon: MdBloodtype, color: "blue", title: "For Blood Banks", desc: "Manage blood inventory, organize donation camps, and fulfill hospital requests efficiently." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${item.color}-100 rounded-full mb-4`}>
                  <item.icon className={`text-${item.color}-600 text-2xl`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-500">Simple steps to save a life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register", desc: "Create your account as a donor, hospital, or blood bank.", icon: FaUserPlus, color: "red" },
              { step: "02", title: "Get Verified", desc: "Admin verifies facilities. Donors are ready instantly.", icon: MdVerified, color: "blue" },
              { step: "03", title: "Connect", desc: "Hospitals post requests, blood banks respond, donors help.", icon: MdPeople, color: "orange" },
              { step: "04", title: "Save Lives", desc: "Blood reaches the patient in time. Lives are saved!", icon: FaHandHoldingHeart, color: "green" },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl shadow p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${item.color}-100 rounded-full mb-4`}>
                  <item.icon className={`text-${item.color}-600 text-xl`} />
                </div>
                <p className={`text-3xl font-bold text-${item.color}-600 mb-2`}>{item.step}</p>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Save a Life Today?
          </h2>
          <p className="text-red-100 mb-8 text-lg">
            Join thousands of donors and facilities already making a difference.
          </p>
          <Link
            to="/donor/register"
            className="inline-block px-10 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg"
          >
            🩸 Register as Donor — It's Free!
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;