import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User, Package, DollarSign, Clock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

interface Auction {
  _id: string;
  itemName: string;
  currentBid: number;
  startingBid: number;
  closingTime: string;
  isClosed: boolean;
  highestBidder: {
    _id: string;
    username: string;
  } | null;
}

const UserProfile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'auctions' | 'bids'>('auctions');
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [myBids, setMyBids] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's auctions
        const auctionsResponse = await axios.get('/auctions/user/auctions');
        setMyAuctions(auctionsResponse.data);
        
        // Fetch user's bids
        const bidsResponse = await axios.get('/auctions/user/bids');
        setMyBids(bidsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format time remaining or status
  const getAuctionStatus = (auction: Auction) => {
    if (auction.isClosed) {
      const isWinner = auction.highestBidder && user?.id === auction.highestBidder._id;
      return isWinner ? 'Won' : 'Closed';
    }
    
    const now = new Date();
    const end = new Date(auction.closingTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ending';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-4 rounded-full mr-4">
            <User size={32} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('auctions')}
            className={`flex items-center px-6 py-3 font-medium ${
              activeTab === 'auctions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Package size={18} className="mr-2" />
            My Auctions
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`flex items-center px-6 py-3 font-medium ${
              activeTab === 'bids'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <DollarSign size={18} className="mr-2" />
            My Bids
          </button>
        </div>

        {error && (
          <div className="p-6">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* My Auctions Tab */}
        {activeTab === 'auctions' && (
          <div className="p-6">
            {myAuctions.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">You haven't created any auctions yet</p>
                <Link
                  to="/create-auction"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Create Your First Auction
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Bid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myAuctions.map((auction) => (
                      <tr key={auction._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{auction.itemName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${auction.currentBid.toFixed(2)}</div>
                          {auction.highestBidder && (
                            <div className="text-xs text-gray-500">
                              by {auction.highestBidder.username}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            auction.isClosed
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {getAuctionStatus(auction)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/auctions/${auction._id}`} className="text-indigo-600 hover:text-indigo-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'bids' && (
          <div className="p-6">
            {myBids.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">You haven't placed any bids yet</p>
                <Link
                  to="/auctions"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Browse Auctions
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Bid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myBids.map((auction) => {
                      const isHighestBidder = auction.highestBidder && user?.id === auction.highestBidder._id;
                      return (
                        <tr key={auction._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{auction.itemName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${auction.currentBid.toFixed(2)}</div>
                            {isHighestBidder && (
                              <div className="text-xs text-green-600 font-medium">
                                You are the highest bidder
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              auction.isClosed
                                ? isHighestBidder
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {auction.isClosed
                                ? isHighestBidder
                                  ? 'Won'
                                  : 'Lost'
                                : getAuctionStatus(auction)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/auctions/${auction._id}`} className="text-indigo-600 hover:text-indigo-900">
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;