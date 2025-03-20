import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

import questionImage from './images/quest.png'; // Update the correct path
import sorryImage from './images/sorry.png'; // Update the correct path

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [matchedComments, setMatchedComments] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loader
  const { video_id } = useParams();

  const handleQuery = () => {
    if (!query.trim()) return;

    setLoading(true); // Show loader when request starts
    setNotFound(false);
    setMatchedComments([]);

    axios.post(`https://flask-app-570571842976.us-central1.run.app/ml/test-chatbot/${video_id}`, { query })
      .then((res) => {
        if (res.data.length > 0) {
          setMatchedComments(res.data);
          setNotFound(false);
        } else {
          setMatchedComments([]);
          setNotFound(true);
        }
      })
      .catch((err) => {
        // console.log(err);
        setMatchedComments([]);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false); // Hide loader when request completes
      });
  };

  return (
    <div className="container mt-4 bg-white">
      <h2 className="mb-3">Query Matching</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
          placeholder="Write a comment..."
        />
        <button onClick={handleQuery} className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Show loader while waiting for response */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Fetching results...</p>
        </div>
      )}

      {/* Show initial image when no query is entered */}
      {!loading && matchedComments.length === 0 && !notFound && (
        <div className="text-center">
          <img src={questionImage} alt="Got a question?" style={{ maxWidth: '200px' }} />
          <p className="mt-2">Got a question? Try to find it in the comment section.</p>
        </div>
      )}

      {/* Show error image when no matching query is found */}
      {!loading && notFound && (
        <div className="text-center">
          <img src={sorryImage} alt="No matching query found" style={{ maxWidth: '200px' }} />
          <p className="mt-2 text-danger">No matching query found</p>
        </div>
      )}

      {/* Show comments when there are results */}
      {!loading && matchedComments.length > 0 && (
        <ul className="list-unstyled mt-3 align-items-center w-100">
          {matchedComments.map((c) => <Comment key={c._id} {...c} />)}
        </ul>
      )}
    </div>
  );
};

export default Chatbot;
