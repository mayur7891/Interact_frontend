import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Clustered from "./Clustered";
import Chatbot from "./Chatbot";
import YourReply from "./YourReply";

const socket = io("http://localhost:5000");  // Connect to backend

function CommentSection() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const { video_id } = useParams();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        axios.get(`http://localhost:5000/comments/${video_id}/comments`).then((res) => {
            setComments(res.data);
        });

        socket.on("receive_comment", (newComment) => {
            setComments((prevComments) => [newComment, ...prevComments]);
        });

        return () => socket.off("receive_comment");
    }, [video_id]);

    const handleComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            user_id,
            comment_text: comment,
            video_id,
            timestamp: new Date().toISOString()
        };
        socket.emit("new_comment", newComment);
        setComment("");
    };

    const renderComments = (filter) => {
        let filteredComments = comments;
        if (filter === "your") {
            filteredComments = comments.filter(c => c.user_id === user_id);
        }
        return filteredComments.map((c) => (
            <Comment
                key={c._id}
                commenter={c.user_id}
                date={new Date(c.timestamp).toLocaleString()}
                text={c.comment}
                replies={c.replies || []}
                comment_id={c._id}
            />
        ));
    };

    return (
        <>

            <ul className="nav nav-tabs justify-content-center mt-3" role="tablist" style={{ borderBottom: "2px solid #ddd" }}>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")} style={{ fontWeight: "bold", color: "#555" }}>All</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "clustered" ? "active" : ""}`} onClick={() => setActiveTab("clustered")} style={{ fontWeight: "bold", color: "#555" }}>Clustered</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "chatbot" ? "active" : ""}`} onClick={() => setActiveTab("chatbot")} style={{ fontWeight: "bold", color: "#555" }}>Chatbot</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "your" ? "active" : ""}`} onClick={() => setActiveTab("your")} style={{ fontWeight: "bold", color: "#555" }}>Your Comments</button>
                </li>
            </ul>

        <div className="container mt-4">
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
            <ul className="list-unstyled mt-3  align-items-center w-100">

                    {activeTab === "all" && renderComments("all")}
                    {activeTab === "clustered" && <Clustered></Clustered>}
                    {activeTab === "chatbot" && <Chatbot></Chatbot>}
                    {activeTab === "your" && <YourReply></YourReply>}
            </ul>
              

        </div>
        </>
    );
}

export default CommentSection;
