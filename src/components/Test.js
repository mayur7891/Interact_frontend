import React, { useState, useEffect } from "react";
import TestComment from "./TestComment";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
 // Ensure Bootstrap is loaded

const socket = io("https://flask-app-570571842976.us-central1.run.app");

const Test = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loader state
  const { video_id } = useParams();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    setLoading(true); // Show loader before fetching comments

    axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/${video_id}/comments`)
      .then((res) => {
        // console.log("Fetched comments:", res.data);
        setTimeout(() => {
          setComments(res.data);
          setLoading(false); // Hide loader after data is loaded
        }, 500);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });

    socket.emit("join", { video_id });

    const handleNewComment = (newComment) => {
      setComments((prevComments) => {
        const exists = prevComments.some(comment => comment._id === newComment._id);
        return exists ? prevComments : [newComment, ...prevComments];
      });
    };

    if (!socket.hasListeners("receive_comment")) {
      socket.on("receive_comment", handleNewComment);
    }

    return () => {
      socket.off("receive_comment", handleNewComment);
    };
  }, [video_id]);

  const handleComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      user_id,
      comment_text: comment,
      video_id,
    };

    axios.post(`https://flask-app-570571842976.us-central1.run.app/comments/${video_id}/add`, newComment)
      .then((res) => {
        if (res.data.success) {
          setComment(""); // WebSocket will handle UI update
        }
      })
      .catch((err) => console.error("Error posting comment:", err));
  };

  return (
    <div className="container mt-4">
      <div className="card col-md-12 p-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleComment}>Submit</button>
        </div>
      </div>

      <h5 className="mt-3 mb-3">Comments ({comments.length})</h5>

      {/* Show loader when fetching comments */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100px" }}>
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className="list-group list-group-flush mb-3">
          {comments.length > 0 ? (
            comments.map((c) => <TestComment key={c._id} {...c} />)
          ) : (
            <p className="text-center text-muted">No comments yet. Be the first to comment!</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Test;
