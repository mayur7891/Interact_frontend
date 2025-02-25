import React, { useState,useEffect } from "react";
import TestComment from "./TestComment";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Test = () => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const { video_id } = useParams();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
      // Fetch initial comments from backend (API call)
      axios.get(`http://localhost:5000/comments/${video_id}/comments`)
          .then((res) => setComments(res.data))
          .catch((err) => console.error("Error fetching comments:", err));

      socket.emit("join", { video_id });

      // Handle new comments with duplicate check
      const handleNewComment = (newComment) => {
          setComments((prevComments) => {
              const exists = prevComments.some(comment => comment._id === newComment._id);
              return exists ? prevComments : [newComment, ...prevComments];
          });
      };

      // Prevent multiple socket event listeners
      if (!socket.hasListeners("receive_comment")) {
          socket.on("receive_comment", handleNewComment);
      }

      return () => {
          socket.off("receive_comment", handleNewComment); // Cleanup listener on unmount
      };
  }, [video_id]);

  const handleComment = () => {
      if (!comment.trim()) return;

      const newComment = {
          user_id,
          comment_text: comment,
          video_id,
      };

      axios.post(`http://localhost:5000/comments/${video_id}/add`, newComment)
          .then((res) => {
              if (res.data.success) {
                  // Don't add the comment here, let WebSocket handle it
                  setComment(""); 
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
        <ul className="list-group list-group-flush mb-3">
          {comments.map((c) => (
            <TestComment key={c._id} {...c}></TestComment>
          ))}
        </ul>
    </div>
  );
};

export default Test;
