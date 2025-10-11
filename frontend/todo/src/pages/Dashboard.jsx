import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';

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
        "http://localhost:8000/api/v1/posts/search",
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
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <label>
        <input
          type="search"
          placeholder="search others post"
          className="border-2 font-black rounded-2xl w-full bg-amber-200"
          value={searched}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="p-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;