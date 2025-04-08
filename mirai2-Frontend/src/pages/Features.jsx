import React from "react";
import Header from "../components/Homepage/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center px-10 py-24">
      <div className="max-w-6xl text-center space-y-6">
      <Header />
      <ButtonGradient />
        <h1 className="text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">Our Features</h1>
        <p className="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto">
          Explore the innovative features that make <span className="text-blue-600 font-semibold">Mirai</span> the ultimate platform for career growth and professional development. These features cover both our current offerings and future advancements.
        </p>
      </div>
      
      <div className="max-w-6xl mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
          { title: "AI-Powered Matching", desc: "Advanced AI matches candidates with opportunities based on skills and experience." },
          { title: "Real-Time Collaboration", desc: "Seamless chat, video, and task tools for effective engagement with HR teams." },
          { title: "Smart Career Analytics", desc: "Data-driven insights to track career growth and hiring trends." },
          { title: "AI Chatbot for Assistance", desc: "An intelligent chatbot offering real-time career guidance and platform navigation." },
          { title: "Automated CV Filtering", desc: "AI categorizes CVs efficiently, connecting recruiters with top talent instantly." },
          { title: "One-to-One Chat", desc: "Direct communication between interns and supervisors for mentorship and support." },
          { title: "Automated Certifications", desc: "Auto-generated certificates upon completion of internships, ensuring recognition." }
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

export default Features;
