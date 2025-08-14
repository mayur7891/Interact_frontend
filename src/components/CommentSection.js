import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import './commentsection.css';

const socket = io("https://flask-app-993257609003.asia-south1.run.app/");

function CommentSection() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { video_id } = useParams();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        setLoading(true);
        axios.get(`https://flask-app-993257609003.asia-south1.run.app/comments/${video_id}/comments`)
            .then((res) => {
                // console.log("Comments fetched:", res.data);
                setComments(res.data);
            })
            .catch((err) => {
                // console.error("Error fetching comments:", err);
            })
            .finally(() => {
                // console.log("Stopping loader...");
                setTimeout(() => setLoading(false), 500);
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

        axios.post(`https://flask-app-993257609003.asia-south1.run.app/comments/${video_id}/add`, newComment)
            .then((res) => {
                if (res.data.success) {
                    setComment("");
                }
            })
            .catch((err) =>{ 
                // console.error("Error posting comment:", err)
            })
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
            <h2 className="mb-3">Comments</h2>

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

            <div className="container comment-card custom-scroll bg-white" style={{ border: 'none', minHeight: "150px" }}>
                {loading ? (
                    // Bootstrap Loader (Spinner) when loading is true
                    <div className="d-flex justify-content-center align-items-center mt-3" style={{ minHeight: "150px" }}>
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ul className="list-unstyled mt-3 align-items-center w-100">
                        {comments.length > 0 ? (
                            comments.map((c) => <Comment key={c._id} {...c} />)
                        ) : (
                            <p className="text-center text-muted">No comments yet. Be the first to comment!</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
