import React, { useState, useEffect } from "react";
import axios from "axios";

function PostCard({ post }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const token = localStorage.getItem("token");

  // Post like state
  const [likeCount, setLikeCount] = useState(post.likecount || post.likeCount || 0);
  const [liked, setLiked] = useState(post.likes?.includes(userId) || false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/comments/post/${post._id}`
        );
        setComments(res.data.data || []);
      } catch (error) {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [post._id]);

  // Like/unlike post
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/posts/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikeCount(res.data.data.likecount || res.data.data.likeCount);
      setLiked(res.data.data.likes.includes(userId));
    } catch (error) {
      console.log("Error liking post", error);
    }
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/comments/create`,
        { text: commentText, postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data.data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      alert("Error adding comment");
    }
  };

  // Like/unlike comment
  const handleLikeComment = async (commentId) => {
  try {
    const res = await axios.put(
      `http://localhost:8000/api/v1/comments/like/${commentId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? { ...c, likeCount: res.data.data.likeCount, likes: res.data.data.likes }
          : c
      )
    );
  } catch (error) {
    alert("Error liking comment");
  }
};

  return (
    <div className="border rounded-lg p-4 bg-white shadow mb-6">
      <h2 className="text-xl font-bold mb-2">{post.title || "Untitled Post"}</h2>
      <p className="text-gray-700 mb-2">{post.content || post.body || "No content"}</p>
      <div className="text-sm text-gray-500">
        By: {post.author?.username || post.username || "Unknown"}
      </div>
      <div className="text-xs text-gray-400">
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleLike}
          className={`px-3 py-1 rounded ${liked ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <form onSubmit={handleAddComment} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border px-2 py-1 rounded"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-3 py-1 rounded"
          >
            Comment
          </button>
        </form>
        <div>
          {loadingComments ? (
            <div className="text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-gray-400">No comments yet.</div>
          ) : (
            comments.map((comment) => {
              const commentLiked = comment.likes?.includes(userId);
              return (
                <div key={comment._id} className="border-t py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{comment.user?.username || "User"}: </span>
                    <span>{comment.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`px-2 py-1 rounded text-xs ${commentLiked ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                    >
                      {commentLiked ? "Unlike" : "Like"}
                    </button>
                    <span className="text-xs">{comment.likeCount || 0}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;