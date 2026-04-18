import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import API_URL from "../config/api";

function Post() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", tags: "" });

  const token = localStorage.getItem("token");
  // Get user from localStorage (adjust this if you store user differently)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch only current user's posts
  const fetchPosts = async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/v1/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.data || []);
    } catch (error) {
      console.log("error while fetching posts: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // Create post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/posts/createPost`,
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
        `${API_URL}/api/v1/posts/${postId}`,
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
      await axios.delete(`${API_URL}/api/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.log("error deleting post", error);
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen w-full">
      <Topbar />
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              Publishing
            </span>
            <h1 className="section-title mt-4">Create and manage your posts with more clarity.</h1>
            <p className="section-copy mt-3">Every create, edit, update, and delete action stays exactly the same. Only the presentation has been modernized.</p>
          </div>
          <div className="surface-card max-w-md p-5">
            <p className="text-sm font-medium text-slate-500">Your content hub</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">Draft new posts and manage existing ones in a cleaner, card-based workspace.</p>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="glass-panel mx-auto max-w-3xl rounded-[32px] p-6 text-black md:p-8">
          <form className="space-y-6" onSubmit={handlePostSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                placeholder="Enter your post title"
                className="input-modern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Content</label>
              <textarea
                rows={4}
                placeholder="Enter your content"
                className="textarea-modern"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
              <input
                type="text"
                placeholder="Enter tags (comma separated)"
                className="input-modern"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-950">Your Posts</h2>
          {posts.length === 0 ? (
            <div className="surface-card px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-800">No posts available</p>
              <p className="mt-2 text-sm text-slate-500">Create your first post using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="glass-panel rounded-[28px] p-5 text-black transition duration-200 hover:-translate-y-0.5"
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
                        className="input-modern mb-3"
                      />
                      <textarea
                        rows={3}
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        className="textarea-modern mb-3"
                      />
                      <input
                        type="text"
                        value={editForm.tags}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tags: e.target.value })
                        }
                        className="input-modern mb-4"
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="btn-secondary px-4 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{post.title}</h3>
                      <p className="mt-3 leading-7 text-slate-700">{post.content}</p>
                      <p className="mt-3 text-sm text-slate-500">
                        Tags: {Array.isArray(post.tags) ? post.tags.join(", ") : post.tags}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        Author: {post.author?.username || "Unknown"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => startEdit(post)}
                          className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handlePostDelete(post._id)}
                          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
