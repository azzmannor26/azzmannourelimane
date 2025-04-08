import React from "react";
import Header from "../components/Homepage/Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
const Blog = () => {
  const posts = [
    {
      title: "Mirai: The Future of Internships & Career Growth",
      date: "February 15, 2025",
      content: "In a world where competition for jobs is fiercer than ever, Mirai is emerging as the bridge between aspiring professionals and groundbreaking career opportunities. Built with the power of AI, Mirai is more than just a platform—it's a revolution in talent acquisition, mentorship, and career advancement.\n\nImagine a system where your skills are recognized instantly, where AI matches you with the perfect internship or job opportunity based on your strengths, aspirations, and potential. No more generic applications that get lost in the shuffle—Mirai ensures that every candidate gets noticed, every talent is nurtured, and every opportunity is maximized.\n\nBut Mirai isn't just about AI-powered job matching. It's a holistic ecosystem designed to empower professionals. From real-time one-on-one chat support with industry experts to automated certification upon completion of training, Mirai ensures that your journey from intern to employee is seamless and rewarding.\n\nInternships are no longer just a formality; they are now an integral part of professional growth. Mirai recognizes this shift and has designed an interactive and engaging experience that not only helps interns gain experience but also builds a community of future leaders.\n\nAs we continue to expand, Mirai is set to become the go-to platform for both interns and companies. In the near future, we aim to provide even more tools, from skill-based learning paths to virtual career fairs, ensuring that every professional has the resources needed to succeed.\n\nJoin us on this journey. The future of career growth is here. The future is Mirai."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center px-10 py-24">
      <div className="max-w-6xl text-center space-y-6">
      <Header />
      <ButtonGradient />
        <h1 className="text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">Latest Blog Posts</h1>
        <p className="text-gray-700 text-xl leading-relaxed max-w-4xl mx-auto">
          Stay up-to-date with the latest insights, trends, and career advice curated by industry professionals.
        </p>
      </div>

      <div className="max-w-6xl mt-16 space-y-12">
        {posts.map((post, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{post.date}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
