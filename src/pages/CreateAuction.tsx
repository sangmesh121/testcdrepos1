import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, DollarSign, FileText, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const CreateAuction: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate minimum date for closing time (24 hours from now)
  const getMinDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 24);
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!itemName.trim() || !description.trim() || !startingBid || !closingTime) {
      setError('All fields are required');
      return;
    }
    
    const bidAmount = parseFloat(startingBid);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setError('Starting bid must be a positive number');
      return;
    }
    
    const closingDate = new Date(closingTime);
    const minDate = new Date(getMinDate());
    if (closingDate < minDate) {
      setError('Closing time must be at least 24 hours from now');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/auctions', {
        itemName,
        description,
        startingBid: bidAmount,
        closingTime: closingDate
      });
      
      navigate(`/auctions/${response.data.auction._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create auction. Please try again.');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Auction</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-gray-700 font-medium mb-2">
              Item Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter item name"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide a detailed description of your item"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="startingBid" className="block text-gray-700 font-medium mb-2">
              Starting Bid (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-500" />
              </div>
              <input
                type="number"
                id="startingBid"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                step="0.01"
                min="0.01"
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="closingTime" className="block text-gray-700 font-medium mb-2">
              Closing Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-gray-500" />
              </div>
              <input
                type="datetime-local"
                id="closingTime"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                min={getMinDate()}
                className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Auction must run for at least 24 hours
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Auction...
              </span>
            ) : (
              'Create Auction'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;