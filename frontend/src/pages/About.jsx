
import { Link } from "react-router-dom";
import { FaTint, FaHeart, FaHandHoldingHeart, FaAward } from "react-icons/fa";
import { MdLocalHospital, MdBloodtype, MdPeople, MdVerified, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const AboutUs = () => {
  const team = [
    {
      name: "Dr. Ananya Sharma",
      role: "Founder & Medical Director",
      bio: "Hematologist with 15+ years of experience in transfusion medicine.",
      initials: "AS",
      color: "red",
    },
    {
      name: "Rohan Mehta",
      role: "Co-Founder & CTO",
      bio: "Tech entrepreneur passionate about healthcare innovation and real-time systems.",
      initials: "RM",
      color: "orange",
    },
    {
      name: "Priya Nair",
      role: "Head of Partnerships",
      bio: "10+ years bridging hospitals and NGOs for impactful healthcare outcomes.",
      initials: "PN",
      color: "blue",
    },
    {
      name: "Karan Verma",
      role: "Community Manager",
      bio: "Drives donor engagement and manages India's largest blood donation volunteer network.",
      initials: "KV",
      color: "green",
    },
  ];

  const values = [
    {
      icon: FaHeart,
      color: "red",
      title: "Compassion First",
      desc: "Every decision we make is rooted in empathy — for patients in need, for selfless donors, and for the communities we serve.",
    },
    {
      icon: MdVerified,
      color: "blue",
      title: "Trust & Transparency",
      desc: "We verify every facility on our platform and maintain complete transparency in how blood requests are matched and fulfilled.",
    },
    {
      icon: FaHandHoldingHeart,
      color: "orange",
      title: "Community Driven",
      desc: "BloodConnect is built by and for India's communities. Every donor, hospital, and blood bank shapes our mission.",
    },
    {
      icon: FaAward,
      color: "green",
      title: "Excellence in Impact",
      desc: "We measure our success in lives saved — and we relentlessly improve our platform to save more, faster.",
    },
  ];

  const milestones = [
    { year: "2021", event: "BloodConnect founded in Bengaluru with 3 partner hospitals." },
    { year: "2022", event: "Expanded to 10 cities, onboarding 100+ blood banks across India." },
    { year: "2023", event: "Launched real-time emergency blood request system." },
    { year: "2024", event: "Crossed 1,000 registered donors and 5,000 lives saved." },
    { year: "2025", event: "Partnered with the Government of India on national blood shortage alerts." },
  ];

  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaTint className="text-white" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            About <span className="text-yellow-300">BloodConnect</span>
          </h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            We started with one simple belief — no one should lose their life
            waiting for blood. Today, we're India's fastest-growing blood
            donation network, connecting donors, hospitals, and blood banks in
            real time.
          </p>
          <Link
            to="/donor/register"
            className="inline-block px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            🩸 Join Our Mission
          </Link>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-5">
                <FaTint className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To eliminate blood shortages across India by creating a
                seamless, technology-driven network that connects every donor
                with every patient who needs them — faster than ever before.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-5">
                <FaHandHoldingHeart className="text-orange-500 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A future where no life is lost due to unavailability of blood —
                where every hospital has instant access to verified supply, and
                every willing donor's contribution is valued and celebrated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Our Impact So Far</h2>
            <p className="text-gray-500 mt-2">Numbers that reflect the lives we've touched</p>
          </div>
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

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Stand For</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our values guide every feature we build and every partnership we form.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex gap-5 p-6 bg-white rounded-2xl shadow border border-gray-100">
                <div className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-${v.color}-100 rounded-full`}>
                  <v.icon className={`text-${v.color}-600 text-2xl`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-gray-500">From a small startup to India's blood donation backbone</p>
          </div>
          <div className="relative border-l-4 border-red-200 pl-8 space-y-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-[2.85rem] top-1 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow" />
                <p className="text-red-600 font-bold text-sm mb-1">{m.year}</p>
                <p className="text-gray-700 bg-white rounded-xl shadow px-5 py-4 text-sm border border-gray-100">
                  {m.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet the Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A passionate group of doctors, engineers, and community builders
              working to save lives every day.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl shadow p-6 text-center border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${member.color}-100 rounded-full mb-4 text-${member.color}-600 text-xl font-bold`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{member.name}</h3>
                <p className={`text-${member.color}-600 text-xs font-semibold mb-2`}>{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Serve</h2>
            <p className="text-gray-500">BloodConnect is built for everyone in the blood supply chain</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaTint, color: "red", title: "For Donors", desc: "Find nearby blood banks, register for camps, and respond to emergency blood requests in your area." },
              { icon: MdLocalHospital, color: "orange", title: "For Hospitals", desc: "Post urgent blood requests and get connected with nearby blood banks and eligible donors instantly." },
              { icon: MdBloodtype, color: "blue", title: "For Blood Banks", desc: "Manage blood inventory, organize donation camps, and fulfill hospital requests efficiently." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow border border-gray-100">
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

      {/* Contact Strip */}
      <section className="py-14 bg-white border-t border-gray-100 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-500 mt-1 text-sm">We'd love to hear from you — donors, facilities, or partners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: MdEmail, label: "Email Us", value: "hello@bloodconnect.in", color: "red" },
              { icon: MdPhone, label: "Call Us", value: "+91 98765 43210", color: "orange" },
              { icon: MdLocationOn, label: "Head Office", value: "Bengaluru, Karnataka", color: "blue" },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${c.color}-100 rounded-full`}>
                  <c.icon className={`text-${c.color}-600 text-xl`} />
                </div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{c.label}</p>
                <p className="text-gray-700 font-medium text-sm">{c.value}</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor/register"
              className="inline-block px-10 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg"
            >
              🩸 Register as Donor — It's Free!
            </Link>
            <Link
              to="/facility/register"
              className="inline-block px-10 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 border-2 border-white/30 transition-all"
            >
              🏥 Register Your Facility
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;