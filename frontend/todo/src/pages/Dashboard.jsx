import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';
import API_URL from '../config/api';

function Dashboard() {
  const [searched, setSearch] = useState("");
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (query) => {
    if(!query){
      setPosts([]); // clearing the post when the search bar has nothing
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/posts/search`,
        { params: { query } }
      );
      setPosts(res.data.data); // FIXED: use res.data.data
    } catch (error) {
      console.log("something went wrong while searching", error);
    }
  };

  useEffect(() => {
    const delayBounce = setTimeout(() => {
      fetchPosts(searched);
    }, 300);

    return () => clearTimeout(delayBounce);
  }, [searched]);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Topbar />
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Search posts
            </span>
            <h1 className="section-title mt-4">Find the right update in seconds.</h1>
            <p className="section-copy mt-3">
              Browse existing posts with clearer spacing, better readability, and a calmer dashboard layout.
            </p>
          </div>
          <div className="surface-card max-w-md p-5">
            <p className="text-sm font-medium text-slate-500">Live search</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Results update as you type after the same debounce timing already used in the app.</p>
          </div>
        </div>

        <label className="block">
          <input
            type="search"
            placeholder="Search posts..."
            className="input-modern h-14 rounded-[22px] pl-5 text-base"
            value={searched}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="mt-8 space-y-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="surface-card py-16 text-center">
              <p className="text-lg font-semibold text-slate-800">No posts found.</p>
              <p className="mt-2 text-sm text-slate-500">Try a different search term to explore matching content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
