import { Rocket, Link, LineChart, Users, LayoutDashboard } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h1 
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
          
        >
          Empower Your <span className="text-indigo-500">Affiliate Strategy</span> with Affiliate++
        </h1>
        <p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mb-8"
          
        >
          Create, track, and optimize affiliate links like a pro. Whether you're a content creator, student ambassador, or digital marketer — manage campaigns, shorten URLs, and unlock insights that drive performance.
        </p>
        <a 
          href="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg transition"
        >
          Get Started for Free
        </a>
      </section>
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{desc}</p>
  </div>
);

// Reusable Use Case Component
const UseCase = ({ title, desc }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition">
    <h4 className="text-lg font-bold mb-2 text-indigo-400">{title}</h4>
    <p className="text-gray-300">{desc}</p>
  </div>
);

export default Home;
