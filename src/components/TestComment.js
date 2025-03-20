import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";



import "./testcomment.css";
import { FaReply } from 'react-icons/fa';

const socket = io("https://flask-app-570571842976.us-central1.run.app");

const TestComment = ({ _id, user_id, comment, timestamp }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);  // Track if replies are loading
  const [noRepliesMessage, setNoRepliesMessage] = useState(null);  // Track no-replies message


  useEffect(() => {
    // Initially, set replies to empty array
    setReplies([]);
    setNoRepliesMessage(null);
  }, [_id]);

  const handleFetchReplies = () => {
    // Only fetch replies if not already loading
    if (loadingReplies || showReplies) return;

    setLoadingReplies(true);  // Set loading state
    axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/${_id}/replies`)
      .then((res) => {
        const fetchedReplies = res.data || [];
        if (fetchedReplies.message) {
          // If no replies, show the message
          setNoRepliesMessage(fetchedReplies.message);
        }
        setReplies(fetchedReplies);  // Update replies
      })
      .catch((err) => {
        // console.error("Error fetching replies:", err);
        setReplies([]);
        setNoRepliesMessage("Failed to load replies. Please try again.");
      })
      .finally(() => {
        setLoadingReplies(false);  // Reset loading state
      });
  };

  const addReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      comment_id: _id,
      reply_user_id: localStorage.getItem("user_id"),
      reply_text: replyText
    };

    axios.post(`https://flask-app-570571842976.us-central1.run.app/comments/${_id}/reply`, newReply)
      .then((res) => {
        if (res.data.success) {
          // setReplies((prev) => [...prev, res.data.reply]); // Update replies immediately
          setReplies((prev) => (Array.isArray(prev) ? [...prev, res.data.reply] : [res.data.reply]));
          socket.emit("new_reply", res.data.reply);
          setReplyText("");
        }
      })
      .catch((err) => {
        // console.error("Error posting reply:", err);
      });
  };


  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const years = Math.floor(diffInSeconds / (3600 * 24 * 365));
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;

    const months = Math.floor(diffInSeconds / (3600 * 24 * 30));
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;

    const days = Math.floor(diffInSeconds / (3600 * 24));
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
  };

  return (
    <li key={_id} className="list-group-item">
      <div className="d-flex">
        <div><i className="me-2 user-icon bg-purple text-white fw-medium fst-normal">{String(user_id).charAt(0).toUpperCase()}</i></div>
        <div className='flex-grow-1'>
          <div className='d-flex justify-content-between'>
            <strong>{user_id}</strong>
            <span className="text-muted" style={{ fontSize: "0.9rem" }}>{getTimeDifference(timestamp)}</span>
          </div>
          {/* <p>{comment}</p> */}
          <p className="mt-1">
            {expanded ? comment : comment.substring(0, 100)}
            {comment.length > 100 && (
              <span className="text-primary ms-1" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Read less" : "Read more"}
              </span>
            )}
          </p>
          <div>
            <button className="btn btn-transparent-primary btn-sm me-2 thumb-icon">
              <LuThumbsUp className='fs-5' />
            </button>
            <button className="btn btn-transparent-danger btn-sm me-2 thumb-icon">
              <LuThumbsDown className='fs-5' />
            </button>
            <button className="btn btn-transparent-secondary btn-sm reply-icon" onClick={() => setShowReplyBox(!showReplyBox)}>
              <FaReply className='fs-5' />
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-2">
              <div className='d-flex justify-content-between'>
                <i className="user-icon bg-orange text-white fw-medium fst-normal">{String(localStorage.getItem("user_id")).charAt(0).toUpperCase()}</i>
                <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="ms-3 form-control" />
              </div>
              <div className='d-grid gap-2 d-sm-flex justify-content-sm-end'>
                <button className="btn btn-transparent mt-2 reply-btns px-3" onClick={() => setShowReplyBox(!showReplyBox)}>Cancel</button>
                <button onClick={addReply} className="btn btn-transparent px-3 mt-2 reply-btns">Reply</button>
              </div>
            </div>
          )}

          <div>
            <button className='btn btn-transparent arrow-btn' onClick={() => {
              setShowReplies(!showReplies);
              if (!showReplies) handleFetchReplies();  // Fetch replies only when "Show Replies" is clicked
            }}>
              <div className="d-flex align-items-center mx-1">
                {showReplies ? <i className="bi bi-chevron-up me-1" /> : <i className="bi bi-chevron-down me-1" />}
                {/* <i className="bi bi-chevron-down me-1"/> */}
                replies
              </div>
            </button>
          </div>


          {showReplies && (
            <>
              {loadingReplies ? (
                <p className="ms-4 text-muted">Loading replies...</p>
              ) : (

                <div className="mt-2 position-relative">
                  {replies.length > 0 ? <div className="position-absolute start-0 top-0 w-100 border-start border-bottom" style={{ height: "20px", width: "20px" }}></div> : (<></>)}
                  <ul className="list-group list-group-flush ms-3">
                    {replies.length > 0 ? (
                      replies.map((r, index) => (
                        <>
                          <li key={index} className="list-group-item">
                            <div className='d-flex'>
                              <div>
                                <i className="me-2 user-icon bg-orange text-white fw-medium fst-normal">{r.reply_user_id.charAt(0).toUpperCase()}</i>
                              </div>
                              <div className='flex-grow-1'>
                                <div className='d-flex justify-content-between'>
                                  <strong>{r.reply_user_id}</strong>
                                  <span className="text-muted" style={{ fontSize: "0.9rem" }}>{getTimeDifference(r.reply_id)}</span>
                                </div>
                                <p>{r.reply_text}</p>
                                <div>
                                  <button className="btn btn-transparent-primary btn-sm me-2">
                                    <LuThumbsUp className='fs-5' />
                                  </button>
                                  <button className="btn btn-transparent-danger btn-sm me-2">
                                    <LuThumbsDown className='fs-5' />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </>
                      ))
                    ) : (
                      <p className="ms-4 text-muted">{noRepliesMessage || "No replies yet..."}</p>
                    )}
                  </ul>
                </div>
              )}
            </>

          )}
        </div>
      </div>
    </li>
  )
}

export default TestComment;