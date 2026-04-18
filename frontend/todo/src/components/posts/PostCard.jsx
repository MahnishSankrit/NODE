import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config/api";

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
  // reply state 
  const [replyText, setReplyText] = useState("");
  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/v1/comments/post/${post._id}`
        );
        setComments(res.data.data || []);
      } catch (error) {
        console.log("error in fetching the comment in post ", error)
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
        `${API_URL}/api/v1/posts/like/${post._id}`,
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
        `${API_URL}/api/v1/comments/createcomment`,
        { text: commentText, postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data.data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      console.log("Error in adding comment", error);
    }
  };

  // Like/unlike comment
  const handleLikeComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/v1/comments/like/${commentId}`,
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
      alert("Error in liking comment", error);
    }
  };

  // reply on comments 
  const handleReplycomment = async (commentId, replyText) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/v1/comments/reply/${post._id}`,
      { text: replyText, parentComment: commentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Assuming your API returns the new comment in the same format
    setComments((prev) => [res.data.data.comment, ...prev]);

    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
  } catch (error) {
    console.log("Error in replying comment", error);
  }
};

  return (
  <div className="glass-panel mb-6 rounded-[30px] p-5 md:p-7">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="line-clamp-2 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
          {post.title || "Untitled Post"}
        </h2>
        <p className="mt-3 break-words text-sm leading-7 text-slate-600 md:text-base">
          {post.content || post.body || "No content"}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">By {post.author?.username || post.username || "Unknown"}</span>
          <span className="hidden md:inline">•</span>
          <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</span>
        </div>
      </div>
    </div>

    {/* Like Section */}
    <div className="mt-4 flex items-center gap-3">
      <button
        onClick={handleLike}
        className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          liked
            ? "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-900"
            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-300"
        }`}
      >
        {liked ? "Unlike" : "Like"}
      </button>
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </div>

    {/* Comment Form */}
    <div className="mt-5">
      <form onSubmit={handleAddComment} className="mb-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          className="input-modern flex-1"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="btn-primary px-4 py-3"
        >
          Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-slate-100">
        {loadingComments ? (
          <div className="py-4 text-sm text-slate-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-sm text-slate-400">No comments yet.</div>
        ) : (
          comments.map((comment) => {
            const commentLiked = comment.likes?.includes(userId);
            return (
              <div key={comment._id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-slate-900">
                      <span className="font-semibold">
                        {comment.user?.username || "User"}
                      </span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span className="break-words text-slate-700">{comment.text}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`rounded-2xl px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        commentLiked
                          ? "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-900"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-300"
                      }`}
                    >
                      {commentLiked ? "Unlike" : "Like"}
                    </button>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {comment.likeCount || 0}
                    </span>
                  </div>
                </div>

                {/* Reply Form */}
                <form
                  className="ml-0 mt-3 flex flex-col gap-2 sm:ml-6 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReplycomment(comment._id, replyText[comment._id]);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="input-modern flex-1"
                    value={replyText[comment._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="submit"
                    className="btn-secondary px-4 py-3"
                  >
                    Reply
                  </button>
                </form>
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
