import React, { useEffect, useState } from "react";
import axios from "axios";

function Post() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingPost, setEditingPost] = useState(null); // track editing
  const [editForm, setEditForm] = useState({ title: "", content: "", tags: "" });

  const token = localStorage.getItem("token");

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/posts/getallpost");
      setPosts(res.data.data.posts || []);
    } catch (error) {
      console.log("error while fetching posts: ", error);
    }
  };

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, []);

  // Create post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/posts/createPost",
        { title, content, tags: tags.split(",").map((tag) => tag.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newPost = response.data.data;
      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
      setTags("");
    } catch (error) {
      console.error("error creating post", error.response?.data || error);
    }
  };

  // Start editing
  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditForm({
      title: post.title,
      content: post.content,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPost(null);
    setEditForm({ title: "", content: "", tags: "" });
  };

  // Update post
  const handleUpdatePost = async (e, postId) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/posts/${postId}`,
        {
          title: editForm.title,
          content: editForm.content,
          tags: editForm.tags.split(",").map((tag) => tag.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data.data : p))
      );
      cancelEdit();
    } catch (error) {
      console.log("error updating the post: ", error);
    }
  };

  // Delete post
  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId)); // FIXED _id
    } catch (error) {
      console.log("error deleting post", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen w-full p-8">
      <h1 className="text-white text-3xl font-bold text-center mb-8">Your Posts</h1>

      {/* Create Post Form */}
      <div className="bg-white text-black rounded-2xl shadow-lg max-w-md mx-auto p-6">
        <form className="space-y-6" onSubmit={handlePostSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Title:</label>
            <input
              type="text"
              placeholder="Enter your post title"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content:</label>
            <textarea
              rows={4}
              placeholder="Enter your content"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags:</label>
            <input
              type="text"
              placeholder="Enter tags (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl"
          >
            Post
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="mt-10 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-white text-2xl font-bold mb-4">All Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-300">No posts available</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl p-4 shadow-lg text-black"
            >
              {editingPost === post._id ? (
                // Edit Form
                <form onSubmit={(e) => handleUpdatePost(e, post._id)}>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <textarea
                    rows={3}
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm({ ...editForm, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-1 bg-green-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-1 bg-gray-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="mt-2">{post.content}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Tags: {Array.isArray(post.tags) ? post.tags.join(", ") : post.tags}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Author: {post.author?.username || "Unknown"}
                  </p>

                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => startEdit(post)}
                      className="px-4 py-1 bg-yellow-500 text-white rounded-lg"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handlePostDelete(post._id)}
                      className="px-4 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Post;
