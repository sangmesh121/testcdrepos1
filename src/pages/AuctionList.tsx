import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, DollarSign, Search } from 'lucide-react';

interface Auction {
  _id: string;
  itemName: string;
  description: string;
  currentBid: number;
  startingBid: number;
  closingTime: string;
  isClosed: boolean;
  seller: {
    _id: string;
    username: string;
  };
  highestBidder: {
    _id: string;
    username: string;
  } | null;
}

const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('active'); // 'active', 'closed', 'all'

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('/auctions');
        setAuctions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Failed to load auctions. Please try again later.');
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Format time remaining
  const getTimeRemaining = (closingTime: string) => {
    const now = new Date();
    const end = new Date(closingTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Auction closed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  // Filter auctions based on search term and filter
  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'active') return matchesSearch && !auction.isClosed;
    if (filter === 'closed') return matchesSearch && auction.isClosed;
    return matchesSearch; // 'all'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Auctions</h1>
        <p className="text-gray-600">Find and bid on items from our marketplace</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'closed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Closed
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No auctions found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Link
              key={auction._id}
              to={`/auctions/${auction._id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 truncate">{auction.itemName}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <DollarSign size={18} className="text-green-600 mr-1" />
                    <span className="font-semibold">${auction.currentBid.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={18} className="text-indigo-600 mr-1" />
                    <span className={auction.isClosed ? "text-red-500" : "text-gray-600"}>
                      {getTimeRemaining(auction.closingTime)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Seller: {auction.seller.username}</span>
                  {auction.highestBidder && (
                    <span>Top bidder: {auction.highestBidder.username}</span>
                  )}
                </div>
              </div>
              
              <div className={`py-2 px-6 text-center ${auction.isClosed ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {auction.isClosed ? 'Auction Closed' : 'Bid Now'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;