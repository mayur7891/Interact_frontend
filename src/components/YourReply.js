import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import './yourreply.css';

const YourReply = () => {
  const { video_id } = useParams();
  const user_id = localStorage.getItem("user_id");
  const [yourComments, setYourComments] = useState([]);
  const [loading, setLoading] = useState(true); // Added loader state

  useEffect(() => {
    setLoading(true); // Show loader before fetching comments

    axios.get(`https://flask-app-993257609003.asia-south1.run.app/comments/${user_id}/${video_id}`)
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            setYourComments(res.data.comments);
            setLoading(false); // Hide loader after data is loaded
          }, 500);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        // console.error("Error fetching your comments:", err);
        setLoading(false);
      });

  }, [user_id, video_id]);

  return (
    <div className="container mt-4 min-vh-100">
      <h2>Your Comments</h2>
      <div className='container your-comment-card' style={{ border: 'none' }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          yourComments.length > 0 ? (
            <ul className="list-unstyled mt-3 align-items-center w-100">
              {yourComments.map((c) => <Comment key={c._id} {...c} />)}
            </ul>
          ) : (
            <p className="text-center text-muted">No comments yet.</p>
          )
        )}
      </div>
    </div>
  );
};

export default YourReply;
