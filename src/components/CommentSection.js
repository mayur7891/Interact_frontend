import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import './commentsection.css';

const socket = io("https://flask-app-570571842976.us-central1.run.app");

function CommentSection() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const { video_id } = useParams();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        // Fetch initial comments from backend (API call)
        axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/${video_id}/comments`)
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

        axios.post(`https://flask-app-570571842976.us-central1.run.app/comments/${video_id}/add`, newComment)
            .then((res) => {
                if (res.data.success) {
                    // Don't add the comment here, let WebSocket handle it
                    setComment(""); 
                }
            })
            .catch((err) => console.error("Error posting comment:", err));
    };

    return (
        <div>

        <div className="container mt-4" style={{backgroundColor:'rgb(249, 250, 251)'}}>
            <h2 className="mb-3">Comments</h2>

            {/* Comment Input */}
            <div className="input-group mb-3">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-control"
                    placeholder="Write a comment..."
                />
                <button onClick={handleComment} className="btn btn-primary">Post</button>
            </div>

            {/* List of Comments */}
            <div className="container comment-card custom-scroll bg-white" style={{border:'none'}}>
            <ul className="list-unstyled mt-3  align-items-center w-100">
                {comments.map((c) => <Comment key={c._id} {...c} />)}
            </ul>
            </div>

        </div>
        </div>
    );
}

export default CommentSection;
