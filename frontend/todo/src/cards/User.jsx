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
    <div ref={cardRef} className="glass-panel w-[22rem] rounded-[28px] p-6 text-slate-900">
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar || "/placeholder-avatar.png"}
          alt="User Avatar"
          className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
        />
        <h2 className="mt-4 text-lg font-semibold tracking-tight">{user.fullName || user.username}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>

      {/* UI refresh: information rows are now easier to scan */}
      <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4">
        <div className='flex items-center justify-between text-sm'>
          <span className="font-medium text-slate-700">Username</span>
          <span className="text-slate-500">{user.username}</span>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <span className="font-medium text-slate-700">Role</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{user.role}</span>
        </div>
      </div>

      <div className='mt-5 grid grid-cols-2 gap-3'>
        <button className="btn-secondary px-3 py-2.5">Edit Profile</button>
        <button onClick={onLogout} className="btn-danger px-3 py-2.5">Logout</button>
      </div>
    </div>
  );
}

export default User;
