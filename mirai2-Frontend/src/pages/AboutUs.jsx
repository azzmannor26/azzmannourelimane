import React from "react";
import Header from "../components/Homepage/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center px-10 py-24">
      <div className="max-w-6xl text-center space-y-6">
      <Header />
      <ButtonGradient />
        <h1 className="text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">Who We Are</h1>
        <p className="text-gray-700 text-2xl leading-relaxed max-w-4xl mx-auto">
          At <span className="text-blue-600 font-semibold">Mirai</span>, we are redefining the way ambitious interns and professionals connect with visionary HR teams. Our platform creates transformative opportunities that bridge the gap between talent and progressive companies.
        </p>
        <p className="text-gray-700 text-2xl leading-relaxed max-w-4xl mx-auto">
          As we evolve, our ambition grows. We aspire to become a global career hub, not only for interns but also for employees seeking to thrive in forward-thinking organizations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 w-full max-w-6xl">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-300 transform transition duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg">
            Empower individuals with access to life-changing opportunities, fostering successful careers in an ever-evolving world.
          </p>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-300 transform transition duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Our Vision</h2>
          <p className="text-gray-600 text-lg">
            To be the leading global platform connecting professionals and companies that prioritize innovation and career growth.
          </p>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center border border-gray-300 transform transition duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Our Values</h2>
          <p className="text-gray-600 text-lg">
            We stand for innovation, integrity, and inclusivity—building a future where talent is nurtured and opportunities are limitless.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
