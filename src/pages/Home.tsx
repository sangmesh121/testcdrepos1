import React from 'react';
import { Link } from 'react-router-dom';
import { Construction as Auction, Clock, DollarSign, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white rounded-xl p-10 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Buy and Sell with Real-Time Auctions
          </h1>
          <p className="text-xl mb-8">
            Join our community of buyers and sellers in a secure, 
            transparent auction marketplace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auctions"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-100 transition"
            >
              Browse Auctions
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg border border-white hover:bg-indigo-800 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <Auction className="text-indigo-600" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Easy Bidding</h3>
          <p className="text-gray-600">
            Place bids with just a few clicks. Our real-time system ensures you're always up to date with the latest bid.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <Clock className="text-indigo-600" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Timed Auctions</h3>
          <p className="text-gray-600">
            All auctions have a set closing time. The system automatically closes auctions when time expires.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <DollarSign className="text-indigo-600" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
          <p className="text-gray-600">
            Our platform ensures secure bidding with encrypted user authentication and data protection.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who buy and sell items through our auction platform every day.
        </p>
        <Link
          to="/register"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
        >
          Create Your Account
        </Link>
      </div>
    </div>
  );
};

export default Home;