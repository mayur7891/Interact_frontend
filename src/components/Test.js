import React, { useState, useEffect } from "react";
import TestComment from "./TestComment";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://flask-app-570571842976.asia-south1.run.app");
const API_KEY = "AIzaSyDeQwjklidMRCb9dubHg52mbJGG_KxQfYk";

const Test = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { video_id } = useParams();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    setLoading(true);

    axios.get(`https://flask-app-570571842976.asia-south1.run.app/comments/${video_id}/comments`)
      .then((res) => {
        setTimeout(() => {
          setComments(res.data);
          setLoading(false);
        }, 500);
      })
      .catch(() => setLoading(false));

    socket.emit("join", { video_id });

    const handleNewComment = (newComment) => {
      setComments((prevComments) => {
        const exists = prevComments.some(comment => comment._id === newComment._id);
        return exists ? prevComments : [newComment, ...prevComments];
      });
      updateSummary(newComment.comment_text);
    };

    if (!socket.hasListeners("receive_comment")) {
      socket.on("receive_comment", handleNewComment);
    }

    return () => {
      socket.off("receive_comment", handleNewComment);
    };
  }, [video_id]);

  const handleComment = async () => {
    if (!comment.trim()) return;

    const newComment = {
      user_id,
      comment_text: comment,
      video_id,
    };

    try {
      const res = await axios.post(
        `https://flask-app-570571842976.asia-south1.run.app/comments/${video_id}/add`,
        newComment
      );

      if (res.data.success) {
        setComment("");
      }
    } catch (error) {
      // console.error("Error posting comment:", error);
    }
  };

  const updateSummary = async (newCommentText) => {
    try {
      const existingSummaryRes = await axios.get(`https://flask-app-570571842976.asia-south1.run.app/ml/getsummary/${video_id}`);
      const existingSummary = existingSummaryRes.data?.summary || "";

      const newSummary = await generateSummary(existingSummary, newCommentText);
      // console.log(newSummary)

      await axios.put(`https://flask-app-570571842976.asia-south1.run.app/ml/update-summary/${video_id}`, { summary: newSummary });
    } catch (error) {
      // console.error("Error updating summary:", error);
    }
  };

  const generateSummary = async (existingSummary, newComment) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: `Summarize the following:\nExisting Summary: ${existingSummary}\nNew Comment: ${newComment}` }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data?.candidates?.length > 0 &&
        response.data.candidates[0].content?.parts?.length > 0
      ) {
        return response.data.candidates[0].content.parts[0].text.trim();
      }

      return existingSummary;
    } catch (error) {
      // console.error("Error generating summary:", error);
      return existingSummary;
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="card col-md-12 p-3 custom-card"
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control custom-input"
            placeholder="Add comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn text-white custom-btn" onClick={handleComment}>Submit</button>
        </div>
      </div>

      <h5 className="mt-3 mb-3 text-white">Comments ({comments.length})</h5>

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
            <p className="text-center text-white">No comments yet. Be the first to comment!</p>
          )}
        </ul>
      )}

      <style>{`
        .custom-card {
          box-shadow: none;
        border: none;
        transition: none;
        background: transparent;
        }

        .custom-input {
          background: transparent;
        // border: none;
        color: white !important;
        padding: 0.75rem 1rem;
        }

        .custom-input::placeholder {
          color: rgba(255,255,255,0.7);
        }

        .custom-input:focus {
          outline: none;
        box-shadow: none;
        background: transparent;
        }

        .custom-btn {
          background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255,255,255,0.5);
        color: white;
        padding: 0.75rem 1.5rem;
        transition: background 0.3s ease;
        }

        .custom-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          color:'black'
        }`
      }</style>




    </div>
  );
};

export default Test;
