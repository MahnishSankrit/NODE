import React, { useEffect, useRef, useState } from 'react';

function User({ onLogout, close }) {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const cardRef = useRef(null);

  // Load user data from localStorage (or cookie/context)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setOpen(false);
        close(); // hide the card
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  if (!open || !user) return null;

  return (
    <div
      ref={cardRef}
      className="flex flex-col justify-center items-center w-full max-w-md bg-white text-black shadow-lg rounded-xl p-6 z-50 mx-auto mt-10"
    >
      <div className="flex justify-center items-center w-full mb-4">
        <img
          src={user.avatar || "/placeholder-avatar.png"} // fallback if no avatar
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border-2"
        />
      </div>

      <div className='border-2 rounded-2xl p-3 flex flex-row space-x-2 w-full mb-2'>
        <h2 className="font-bold text-sm">Full Name:</h2>
        <p className="text-sm text-gray-500 font-medium">{user.fullName}</p>
      </div>
      <div className='border-2 rounded-2xl p-3 flex flex-row space-x-2 w-full mb-2'>
        <h2 className="font-bold text-sm">UserName:</h2>
        <p className="text-sm text-gray-500 font-medium">{user.username}</p>
      </div>
      <div className='border-2 rounded-2xl p-3 flex flex-row space-x-2 w-full mb-2'>
        <h2 className="font-bold text-sm">Email:</h2>
        <p className="text-sm text-gray-500 font-medium">{user.email}</p>
      </div>
      <div className='border-2 rounded-2xl p-3 flex flex-row space-x-2 w-full mb-4'>
        <h2 className="font-bold text-sm">Role:</h2>
        <p className="text-sm text-gray-600">{user.role}</p>
      </div>
      <div className='flex flex-row justify-center items-center space-x-4 w-full'>
        <button className="w-1/2 px-4 py-2 hover:bg-gray-100 border-2 rounded-2xl">
          Edit Profile
        </button>
        <button
          onClick={onLogout}
          className="w-1/2 px-4 py-2 hover:bg-red-100 text-red-600 border-2 rounded-2xl"
        >
          Logout
        </button>
      </div>
    </div>

  );
}

export default User;
