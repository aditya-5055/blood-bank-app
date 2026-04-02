import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTint, FaHeart, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdBloodtype, MdLocalHospital, MdInfo, MdWarning, MdCheckCircle } from "react-icons/md";

const faqs = [
  {
    q: "Who can donate blood?",
    a: "Anyone between 18–65 years old, weighing at least 50 kg, and in good health can donate blood. You should not have donated blood in the last 3 months (for whole blood).",
  },
  {
    q: "How often can I donate blood?",
    a: "Whole blood can be donated once every 3 months (90 days). Platelets can be donated every 2 weeks, and plasma every 4 weeks.",
  },
  {
    q: "Does donating blood hurt?",
    a: "You may feel a brief pinch when the needle is inserted, but the donation process itself is generally painless. Most donors feel fine throughout.",
  },
  {
    q: "How long does the donation process take?",
    a: "The actual blood draw takes about 8–10 minutes. Including registration, health check, and rest time, the entire visit is typically 45–60 minutes.",
  },
  {
    q: "Will I feel weak after donating?",
    a: "Most donors feel perfectly fine. You may feel slightly lightheaded immediately after. Drinking fluids and having a snack before and after donation helps prevent this.",
  },
  {
    q: "Can I donate if I have a tattoo or piercing?",
    a: "Yes, but you must wait 6 months after getting a tattoo or piercing from an unregulated facility. If done at a licensed, sterile facility, check with your blood bank.",
  },
  {
    q: "Is my blood tested after donation?",
    a: "Yes. Every unit of donated blood is screened for HIV, Hepatitis B, Hepatitis C, syphilis, and malaria before it is used for transfusion.",
  },
  {
    q: "What blood type is the rarest?",
    a: "AB negative is the rarest blood type, found in only about 1% of the population. O negative is the universal donor type and is always in high demand.",
  },
];

const bloodTypes = [
  { type: "A+", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A−", "O+", "O−"], frequency: "35.7%" },
  { type: "A−", canDonateTo: ["A+", "A−", "AB+", "AB−"], canReceiveFrom: ["A−", "O−"], frequency: "6.3%" },
  { type: "B+", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B−", "O+", "O−"], frequency: "8.5%" },
  { type: "B−", canDonateTo: ["B+", "B−", "AB+", "AB−"], canReceiveFrom: ["B−", "O−"], frequency: "1.5%" },
  { type: "AB+", canDonateTo: ["AB+"], canReceiveFrom: ["All Types"], frequency: "3.4%" },
  { type: "AB−", canDonateTo: ["AB+", "AB−"], canReceiveFrom: ["A−", "B−", "AB−", "O−"], frequency: "0.6%" },
  { type: "O+", canDonateTo: ["A+", "B+", "O+", "AB+"], canReceiveFrom: ["O+", "O−"], frequency: "37.4%" },
  { type: "O−", canDonateTo: ["All Types"], canReceiveFrom: ["O−"], frequency: "6.6%" },
];

const steps = [
  { step: "01", color: "red", title: "Register Online", desc: "Create your BloodConnect account as a donor in minutes. No paperwork needed." },
  { step: "02", color: "orange", title: "Health Screening", desc: "A quick check of your hemoglobin, blood pressure, pulse, and temperature at the donation center." },
  { step: "03", color: "blue", title: "The Donation", desc: "About 450ml of blood is drawn — takes just 8–10 minutes. You're in safe hands." },
  { step: "04", color: "green", title: "Rest & Refresh", desc: "Relax for 10–15 minutes, enjoy juice and snacks provided by the center." },
  { step: "05", color: "purple", title: "Go Save a Life", desc: "Your blood is tested, processed, and sent to patients who need it within 24 hours." },
];

const eligibility = {
  canDonate: [
    "Age 18–65 years",
    "Weight ≥ 50 kg",
    "Hemoglobin ≥ 12.5 g/dL",
    "Normal blood pressure",
    "No fever or cold",
    "Last donation 90+ days ago",
    "Good sleep the night before",
  ],
  cannotDonate: [
    "Pregnant or breastfeeding",
    "Recent surgery (< 6 months)",
    "HIV, Hepatitis B/C positive",
    "Active cancer treatment",
    "Recent tattoo (< 6 months, unregulated)",
    "Severe heart or lung disease",
    "Under certain medications",
  ],
};

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm pr-4">{q}</span>
        {open ? <FaChevronUp className="text-red-500 flex-shrink-0" /> : <FaChevronDown className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-red-50/30">
          {a}
        </div>
      )}
    </div>
  );
};

const Learn = () => {
  const [activeType, setActiveType] = useState(null);

  return (
    <div className="font-sans">

      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MdInfo className="text-white" />
            Education & Awareness
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Learn About <br />
            <span className="text-yellow-300">Blood Donation</span>
          </h1>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Everything you need to know about donating blood — eligibility,
            blood types, the donation process, and answers to your most common questions.
          </p>
          <Link
            to="/donor/register"
            className="inline-block px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg text-sm"
          >
            🩸 Ready to Donate? Register Now
          </Link>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Donate Blood?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              One donation can save up to 3 lives. Here's why your blood matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaHeart, color: "red", title: "Save Up to 3 Lives", desc: "A single whole blood donation is separated into red cells, platelets, and plasma — each saving a different patient." },
              { icon: MdBloodtype, color: "blue", title: "Blood Has No Substitute", desc: "No artificial alternative exists for human blood. Every patient who needs a transfusion depends on a real donor like you." },
              { icon: MdLocalHospital, color: "orange", title: "Constant Demand", desc: "India needs over 14.6 million units of blood annually. Someone in India needs blood every 2 seconds." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${item.color}-100 rounded-full mb-4`}>
                  <item.icon className={`text-${item.color}-600 text-2xl`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Eligibility Criteria</h2>
            <p className="text-gray-500">Check if you're eligible to donate today</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow border border-green-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <MdCheckCircle className="text-green-500 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800">You CAN Donate If...</h3>
              </div>
              <ul className="space-y-3">
                {eligibility.canDonate.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow border border-red-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <MdWarning className="text-red-500 text-2xl" />
                <h3 className="text-lg font-bold text-gray-800">You CANNOT Donate If...</h3>
              </div>
              <ul className="space-y-3">
                {eligibility.cannotDonate.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <FaTimesCircle className="text-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">
            * Always consult the medical staff at the donation center for final eligibility confirmation.
          </p>
        </div>
      </section>

      {/* Donation Process */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Donation Process</h2>
            <p className="text-gray-500">Simple, safe, and over before you know it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="bg-white rounded-2xl shadow p-5 text-center border border-gray-100">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${item.color}-100 rounded-full mb-3`}>
                  <FaTint className={`text-${item.color}-600 text-lg`} />
                </div>
                <p className={`text-2xl font-bold text-${item.color}-600 mb-1`}>{item.step}</p>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Type Compatibility */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Blood Type Compatibility</h2>
            <p className="text-gray-500">Click on any blood type to see compatibility details</p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-8">
            {bloodTypes.map((bt) => (
              <button
                key={bt.type}
                onClick={() => setActiveType(activeType?.type === bt.type ? null : bt)}
                className={`rounded-xl py-4 font-bold text-lg transition-all shadow-sm border-2 ${
                  activeType?.type === bt.type
                    ? "bg-red-600 text-white border-red-600 scale-105 shadow-md"
                    : "bg-white text-red-600 border-red-100 hover:border-red-400"
                }`}
              >
                {bt.type}
              </button>
            ))}
          </div>

          {activeType && (
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 transition-all">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="bg-red-600 text-white font-bold text-3xl px-6 py-3 rounded-xl">
                  {activeType.type}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Population with this type</p>
                  <p className="text-2xl font-bold text-gray-800">{activeType.frequency}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-5">
                  <p className="text-green-700 font-bold mb-3 flex items-center gap-2">
                    <FaCheckCircle /> Can Donate To
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeType.canDonateTo.map((t) => (
                      <span key={t} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-5">
                  <p className="text-blue-700 font-bold mb-3 flex items-center gap-2">
                    <MdBloodtype /> Can Receive From
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeType.canReceiveFrom.map((t) => (
                      <span key={t} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!activeType && (
            <div className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-dashed border-gray-200">
              <FaQuestionCircle className="text-4xl mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Select a blood type above to see its compatibility details</p>
            </div>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Before & After Donation Tips</h2>
            <p className="text-gray-500">Follow these tips for a comfortable donation experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-7">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🌅 Before Donation</h3>
              <ul className="space-y-3">
                {[
                  "Drink at least 2–3 extra glasses of water",
                  "Eat a healthy, iron-rich meal",
                  "Get a good night's sleep",
                  "Avoid alcohol for 24 hours before",
                  "Wear comfortable, loose clothing",
                  "Bring a valid photo ID",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-gray-600">
                    <FaCheckCircle className="text-orange-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-7">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🌙 After Donation</h3>
              <ul className="space-y-3">
                {[
                  "Rest for 10–15 minutes at the center",
                  "Drink plenty of fluids throughout the day",
                  "Eat iron-rich foods like spinach, lentils, meat",
                  "Avoid heavy lifting or strenuous exercise for 24 hours",
                  "Keep the bandage on for at least 4 hours",
                  "Avoid smoking for 2 hours after donating",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-gray-600">
                    <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Got questions? We've got answers.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQ key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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

export default Learn;