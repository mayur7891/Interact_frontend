import { useState } from "react";
// import { motion } from "framer-motion";
import * as framerMotion from "framer-motion";
import { FaUserCircle,  FaPaperPlane } from "react-icons/fa";

const { motion } = framerMotion;

const CommentCard = ({ username, comment = "", time, replies = [] }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [newReply, setNewReply] = useState("");
    const [replyList, setReplyList] = useState(replies);
    const [expanded, setExpanded] = useState(false);

    const handleReplySubmit = () => {
        if (newReply.trim() !== "") {
            setReplyList([...replyList, { username: "You", comment: newReply, time: "Just now" }]);
            setNewReply("");
        }
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
                border:'none'
            }}
        >
            <div className="d-flex align-items-start">
                <FaUserCircle size={30} className="text-primary me-2" />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold text-dark mb-0 small">{username}</h6>
                        <small className="text-muted">{time}</small>
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
                            onClick={() => setShowReplies(!showReplies)}
                            style={{ cursor: "pointer" }}
                        >
                            {showReplies ? "Hide Replies" : "Show Replies"}
                        </small>
                        {/* <FaChevronDown
                            size={16}
                            className="text-dark cursor-pointer"
                            onClick={() => setShowReplies(!showReplies)}
                            style={{ cursor: "pointer" }}
                        /> */}
                    </div>

                    {showReplies && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="mt-2"
                        >
                            {replyList.map((reply, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="reply-card p-2 mb-2 rounded"
                                >
                                    <div className="d-flex align-items-center">
                                        <FaUserCircle size={25} className="text-secondary me-2" />
                                        <h6 className="fw-bold text-dark mb-0 small">{reply.username}</h6>
                                    </div>
                                    <p className="mt-1 mb-0 text-dark small">{reply.comment}</p>
                                    <small className="text-muted">{reply.time}</small>
                                </motion.div>
                            ))}

                            <div className="d-flex align-items-center mt-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm rounded-pill"
                                    placeholder="Write a reply..."
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                />
                                <FaPaperPlane
                                    size={18}
                                    className="text-primary ms-2 cursor-pointer"
                                    onClick={handleReplySubmit}
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
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

const CommentTest = () => {
    const comments = [
        {
            username: "John Doe",
            comment: "This feature is amazing! 🔥 I can't believe how smooth everything works. This is the best feature I have seen in a long time.",
            time: "2 hours ago",
            replies: [
                { username: "Alice", comment: "Totally agree!", time: "1 hour ago" },
                { username: "Bob", comment: "This is so useful!", time: "30 minutes ago" }
            ]
        },
        {
            username: "Bob",
            comment: "Can’t wait to use this. Great work! This will be super useful for everyone looking for a better comment section experience.",
            time: "10 minutes ago",
            replies: [{ username: "Bob", comment: "This is so useful!", time: "30 minutes ago" }]
        }
    ];

    return (
        <div className="container my-4">
            <h4 className="fw-bold text-dark">Comments</h4>
            {comments.map((c, index) => (
                <CommentCard key={index} username={c.username} comment={c.comment} time={c.time} replies={c.replies} />
            ))}
        </div>
    );
};

export default CommentTest;