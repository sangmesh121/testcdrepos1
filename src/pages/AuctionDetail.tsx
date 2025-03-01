import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, DollarSign, User, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

interface Bid {
  _id: string;
  bidder: {
    _id: string;
    username: string;
  };
  amount: number;
  time: string;
}

interface Auction {
  _id: string;
  itemName: string;
  description: string;
  startingBid: number;
  currentBid: number;
  highestBidder: {
    _id: string;
    username: string;
  } | null;
  seller: {
    _id: string;
    username: string;
    email: string;
  };
  closingTime: string;
  isClosed: boolean;
  createdAt: string;
  bids: Bid[];
}

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(`/auctions/${id}`);
        setAuction(response.data);
        setLoading(false);
        
        // Set initial bid amount suggestion
        const suggestedBid = response.data.currentBid + 1;
        setBidAmount(suggestedBid.toString());
      } catch (err) {
        console.error('Error fetching auction:', err);
        setError('Failed to load auction details. Please try again later.');
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  // Update time remaining
  useEffect(() => {
    if (!auction) return;
    
    const updateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(auction.closingTime);
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Auction closed');
        if (!auction.isClosed) {
          // Refresh auction data to get updated status
          axios.get(`/auctions/${id}`).then(response => {
            setAuction(response.data);
          });
        }
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [auction, id]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setBidError('');
    setBidSuccess('');
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    if (auction && amount <= auction.currentBid) {
      setBidError(`Bid must be higher than the current bid ($${auction.currentBid.toFixed(2)})`);
      return;
    }
    
    setBidLoading(true);
    
    try {
      const response = await axios.put(`/auctions/bid/${id}`, { amount });
      
      // Update auction with new bid
      const updatedAuction = await axios.get(`/auctions/${id}`);
      setAuction(updatedAuction.data);
      
      setBidSuccess('Your bid was placed successfully!');
      setBidAmount((amount + 1).toString()); // Suggest next bid
    } catch (err: any) {
      setBidError(err.response?.data?.message || 'Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Auction not found'}
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === auction.seller._id;
  const isHighestBidder = isAuthenticated && auction.highestBidder && user?.id === auction.highestBidder._id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Auction Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold mb-2">{auction.itemName}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>Seller: {auction.seller.username}</span>
            </div>
            
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>Listed on: {new Date(auction.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            auction.isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {auction.isClosed ? 'Auction Closed' : 'Active Auction'}
          </div>
        </div>
        
        {/* Auction Content */}
        <div className="p-6 md:flex">
          <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{auction.description}</p>
            </div>
            
            {auction.bids.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Bid History</h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {auction.bids.slice().reverse().map((bid, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-500" />
                        <span className="font-medium">{bid.bidder.username}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-green-600">${bid.amount.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(bid.time).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <div className="text-gray-600 text-sm mb-1">Current Bid</div>
                <div className="text-3xl font-bold text-green-600 flex items-center">
                  <DollarSign size={24} />
                  {auction.currentBid.toFixed(2)}
                </div>
                {auction.highestBidder && (
                  <div className="text-sm text-gray-600 mt-1">
                    by {auction.highestBidder.username}
                    {isHighestBidder && ' (You)'}
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="text-gray-600 text-sm mb-1">Time Remaining</div>
                <div className="flex items-center text-lg font-semibold">
                  <Clock size={20} className="mr-2 text-indigo-600" />
                  <span className={auction.isClosed ? 'text-red-600' : ''}>
                    {timeRemaining}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Closes: {new Date(auction.closingTime).toLocaleString()}
                </div>
              </div>
              
              {!auction.isClosed && !isOwner && (
                <form onSubmit={handleBid}>
                  {bidError && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-start">
                      <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{bidError}</span>
                    </div>
                  )}
                  
                  {bidSuccess && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
                      {bidSuccess}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="bidAmount" className="block text-gray-700 font-medium mb-2">
                      Your Bid (USD)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        step="0.01"
                        min={auction.currentBid + 0.01}
                        className="pl-8 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={bidLoading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-70"
                  >
                    {bidLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Place Bid'
                    )}
                  </button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      You need to be logged in to place a bid
                    </p>
                  )}
                </form>
              )}
              
              {isOwner && (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm">
                  You are the seller of this auction.
                </div>
              )}
              
              {auction.isClosed && (
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-center">
                  {auction.highestBidder ? (
                    <p>
                      This auction was won by <strong>{auction.highestBidder.username}</strong> with a bid of <strong>${auction.currentBid.toFixed(2)}</strong>
                    </p>
                  ) : (
                    <p>This auction ended with no bids</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;