import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Comment = ({ commenter, date, text = "", comment_id }) => {
    const charLimit = 100; // Character limit before trimming
    const [expanded, setExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false); // New state for reply box visibility
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        // Fetch initial comments
        axios.get(`http://localhost:5000/comments/${comment_id}/replies`).then((res) => {
            setReplies(res.data);
        });

        // Listen for new replies
        const handleNewReply = (newReply) => {
            if (newReply.comment_id === comment_id) {  // Ensure the reply is for this comment
                setReplies((prevReplies) => [...prevReplies, newReply]);
            }
        };

        socket.on("receive_reply", handleNewReply);

        return () => socket.off("receive_reply", handleNewReply);
    }, [comment_id]);


    const addReply = () => {
        if (replyText.trim()) {
            const newReply = {
                comment_id: comment_id,
                reply_user_id: localStorage.getItem("user_id"),
                reply_text: replyText
            };
            // setReplies((prevReplies) => [...prevReplies, newReply]);
            // setReplyText("");

            socket.emit("new_reply", newReply);
            setReplyText("");
        }
    };

    return (
        <div className="card mb-3 p-3 shadow-sm">
            <div className="d-flex justify-content-between">
                <strong>{commenter}</strong>
                <span className="text-muted" style={{ fontSize: "0.9rem" }}>{date}</span>
            </div>
            <p className="mt-2">
                {expanded ? text : text.length > charLimit ? text.substring(0, charLimit) + "..." : text}
                {text && text.length > charLimit && (
                    <span
                        className="text-primary ms-1"
                        style={{ cursor: "pointer" }}
                        onClick={toggleExpand}
                    >
                        {expanded ? "Read less" : "Read more"}
                    </span>
                )}
            </p>
            <div className="d-flex justify-content-between">
                <button className="btn btn-link p-0" style={{ textDecoration: "none" }} onClick={() => setShowReplies(!showReplies)}>
                    {showReplies ? "Hide Replies" : "Show Replies"}
                </button>
                <button className="btn btn-link p-0" style={{ textDecoration: "none" }} onClick={() => setShowReplyBox(!showReplyBox)}>
                    {showReplyBox ? "Cancel" : "Add Reply"}
                </button>
            </div>
            {   showReplies && 
                (
                    <div className="ms-4 mt-3">
                        {(replies || []).map((reply) => (
                            <div key={reply._id} className="mb-2">
                                <strong>{reply.reply_user_id}</strong>
                                <span className="text-muted ms-2" style={{ fontSize: "0.8rem" }}>{reply.timestamp}</span>
                                <p className="text-muted mb-0">{reply.reply_text}</p>
                            </div>
                        ))}
                    </div>
                )}
            {
                showReplyBox &&
                ( // Show reply box only for the clicked comment
                    <div className="mt-3">
                        <div className="input-group">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="form-control"
                            />
                            <button onClick={addReply} className="btn btn-primary">Add Reply</button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Comment;
