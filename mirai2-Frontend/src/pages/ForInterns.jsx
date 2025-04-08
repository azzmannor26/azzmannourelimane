import React from "react";
import Header from "../components/Homepage/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
const ForInterns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center px-10 py-24">
      <div className="max-w-6xl text-center space-y-6">
      
        <h1 className="text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">For Interns</h1>
        <p className="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto">
          At <span className="text-blue-600 font-semibold">Mirai</span>, we empower interns by providing AI-driven career matching, skill-building resources, and mentorship opportunities to help you thrive in the professional world.
        </p>
      </div>
      <Header />
      <ButtonGradient />
      <div className="max-w-6xl mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
          { title: "AI-Powered Job Matching", desc: "Let our AI match you with the best internships based on your skills, experience, and aspirations." },
          { title: "One-on-One Mentorship", desc: "Connect with industry experts for guidance, career advice, and networking opportunities." },
          { title: "Smart Career Insights", desc: "Gain valuable data-driven insights into hiring trends and skill demands in your industry." },
          { title: "Automated Certifications", desc: "Earn and showcase verified certificates for every milestone achieved during your internship." },
          { title: "Interactive Learning Hub", desc: "Access exclusive training programs, skill-building courses, and career workshops tailored for interns." },
          { title: "Real-Time Collaboration Tools", desc: "Engage with peers and professionals using integrated chat, video calls, and task management systems." }
        ].map((feature, index) => (
          <div key={index} className="p-10 rounded-3xl shadow-lg bg-white text-gray-900 hover:shadow-2xl transition-transform transform hover:-translate-y-2 flex flex-col items-start">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">{feature.title}</h2>
            <p className="text-gray-600 text-lg">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForInterns;
