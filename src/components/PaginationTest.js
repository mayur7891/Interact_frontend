import React, { useState, useEffect, useRef, useCallback } from "react";
import TestComment from "./TestComment";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(" https://flask-app-993257609003.asia-south1.run.app/");

const PaginationTest = () => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastCommentId, setLastCommentId] = useState(null);
    const [hasMore, setHasMore] = useState(true); 
    const observer = useRef(null);
    const { video_id } = useParams();
    const user_id = localStorage.getItem("user_id");

    
    const fetchComments = useCallback(async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            let url = `https://flask-app-993257609003.asia-south1.run.app/comments/${video_id}/comments?limit=10`;
            if (lastCommentId) url += `&last_comment_id=${lastCommentId}`;

            const response = await axios.get(url);
            const data = response.data;

            if (data.length > 0) {
                const uniqueComments = [...new Map([...comments, ...data].map(c => [c._id, c])).values()];
                setComments(uniqueComments);
                setLastCommentId(data[data.length - 1]._id);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            // console.error(error);
        }
        setLoading(false);
    }, [video_id, lastCommentId, hasMore]);


    useEffect(() => {
        setComments([]);
        setLastCommentId(null);
        setHasMore(true);
        fetchComments(); 
    }, [video_id]);

   
    useEffect(() => {
        socket.emit("join", { video_id });

        const handleNewComment = (newComment) => {
            setComments((prev) => {
                const exists = prev.some(comment => comment._id === newComment._id);
                return exists ? prev : [newComment, ...prev];
            });
        };

        socket.on("receive_comment", handleNewComment);

        return () => {
            socket.off("receive_comment", handleNewComment);
        };
    }, [video_id]);

    const handleComment = async () => {
        if (!comment.trim()) return;

        const newComment = { user_id, comment_text: comment, video_id };

        try {
            const res = await axios.post(`https://flask-app-993257609003.asia-south1.run.app/comments/${video_id}/add`, newComment);
            if (res.data.success) {
                setComment("");
            }
        } catch (error) {
            // console.error(error);
        }
    };

    const lastCommentRef = useCallback((node) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchComments();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchComments]);

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

            <h5 className="mt-3 mb-3 text-white">Comments ({comments.length})</h5>

            <ul className="list-group list-group-flush mb-3">
                {comments.length > 0 ? (
                    comments.map((c, index) => (
                        <li key={c._id} ref={index === comments.length - 1 ? lastCommentRef : null}>
                            <TestComment {...c} />
                        </li>
                    ))
                ) : (
                    <p className="text-center text-muted">No comments yet. Be the first to comment!</p>
                )}
            </ul>

            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100px" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaginationTest;
