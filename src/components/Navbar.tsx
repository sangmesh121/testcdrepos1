import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Construction as Auction, LogIn, LogOut, User, PlusCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Auction size={24} />
            <span className="text-xl font-bold">AuctionHub</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/auctions" className="hover:text-indigo-200 transition">
              Browse Auctions
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-auction" className="flex items-center space-x-1 hover:text-indigo-200 transition">
                  <PlusCircle size={18} />
                  <span>Create Auction</span>
                </Link>
                
                <Link to="/profile" className="flex items-center space-x-1 hover:text-indigo-200 transition">
                  <User size={18} />
                  <span>{user?.username}</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-indigo-200 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-200 transition">
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;