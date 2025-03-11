import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const socket = io("https://flask-app-570571842976.us-central1.run.app");

const Comment = ({ _id, user_id, comment, timestamp }) => {
    const [expanded, setExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [noRepliesMessage, setNoRepliesMessage] = useState(null);

    useEffect(() => {
        setReplies([]);
        setNoRepliesMessage(null);
    }, [_id]);

    const handleFetchReplies = () => {
        if (loadingReplies || showReplies) return;

        setLoadingReplies(true);
        axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/${_id}/replies`)
            .then((res) => {
                const fetchedReplies = res.data || [];
                if (fetchedReplies.message) {
                    setNoRepliesMessage(fetchedReplies.message);
                }
                setReplies(fetchedReplies);
            })
            .catch((err) => {
                console.error("Error fetching replies:", err);
                setReplies([]);
                setNoRepliesMessage("Failed to load replies. Please try again.");
            })
            .finally(() => {
                setLoadingReplies(false);
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
                    setReplies((prev) => (Array.isArray(prev) ? [...prev, res.data.reply] : [res.data.reply]));
                    socket.emit("new_reply", res.data.reply);
                    setReplyText("");
                }
            })
            .catch((err) => {
                console.error("Error posting reply:", err);
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="comment-card p-3 my-2 w-100"
            style={{
                height: showReplies ? "auto" : "15vh",
                overflow: "hidden",
                transition: "height 0.3s ease-in-out",
                border: 'none'
            }}
        >
            <div className="d-flex align-items-start">
                <FaUserCircle size={30} className="text-primary me-2" />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold text-dark mb-0 small">{user_id}</h6>
                        <small className="text-muted">{getTimeDifference(timestamp)}</small>
                    </div>

                    <p className="mt-1 mb-1 text-dark small">
                        {expanded ? comment : `${comment.slice(0, 100)}${comment.length > 100 ? "..." : ""}`}
                        {comment.length > 100 && (
                            <span
                                className="text-primary fw-bold ms-1 cursor-pointer"
                                onClick={() => setExpanded(!expanded)}
                                style={{ cursor: "pointer" }}
                            >
                                {expanded ? "See Less" : "Read More"}
                            </span>
                        )}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                        <small
                            className="text-primary fw-bold cursor-pointer"
                            onClick={() => {
                                setShowReplies(!showReplies);
                                if (!showReplies) handleFetchReplies();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {showReplies ? "Hide Replies" : "Show Replies"}
                        </small>
                    </div>

                    {showReplies && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="mt-2"
                        >
                            <div className="d-flex align-items-center my-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <FaPaperPlane
                                    size={18}
                                    className="text-primary ms-2 cursor-pointer"
                                    onClick={addReply}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                            {loadingReplies ? (
                                <p className="ms-4 text-muted">Loading replies...</p>
                            ) : (
                                <>
                                    {replies.length > 0 ? (
                                        replies.map((r, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="reply-card p-2 mb-2 rounded"
                                            >
                                                <div className="d-flex align-items-center">
                                                    <FaUserCircle size={25} className="text-secondary me-2" />
                                                    <h6 className="fw-bold text-dark mb-0 small">{r.reply_user_id}</h6>
                                                </div>
                                                <p className="mt-1 mb-0 text-dark small">{r.reply_text}</p>
                                                <small className="text-muted">{getTimeDifference(r.reply_id)}</small>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="ms-4 text-muted">{noRepliesMessage || "No replies yet..."}</p>
                                    )}
                                </>
                            )}

                            
                        </motion.div>
                    )}
                </div>
            </div>

            <style>{`
                .comment-card {
                    background: transparent;
                    transition: all 0.3s ease-in-out;
                }
                .comment-card:hover {
                    transform: translateY(-2px);
                }
                .reply-card {
                    background: #f0f2f5;
                    border-left: 3px solid #0d6efd;
                }
                .cursor-pointer:hover {
                    opacity: 0.8;
                }
            `}</style>
        </motion.div>
    );
};

export default Comment;