import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import User from '../cards/User';

function Topbar() {
  const navigate = useNavigate();
  const [showUserCard, setShowUserCard] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-teal-600 w-full h-screen text-white p-6 relative">
      <h1 className="border-2 rounded-2xl bg-amber-600 p-2 text-2xl font-bold w-max">
        ✅Todo + 📝Blog
      </h1>

      <nav className="flex flex-row justify-center items-center space-x-4 mt-6">
        <button
          className="border-2 rounded-2xl p-3 bg-orange-400 hover:bg-amber-300"
          onClick={() => setShowUserCard(!showUserCard)}
        >
          Profile
        </button>

        <Link to="/todo" className="border-2 rounded-2xl p-3 bg-orange-400">
          Todo
        </Link>

        <Link to="/posts" className="border-2 rounded-2xl p-3 bg-orange-400">
          Posts
        </Link>

        <button
          className="border-2 rounded-2xl p-3 bg-orange-400 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* Show User Card */}
      {showUserCard && (
        <User onLogout={handleLogout} close={() => setShowUserCard(false)} />
      )}
    </div>
  );
}

export default Topbar;
