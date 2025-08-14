import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

import questionImage from './images/quest.png';
import sorryImage from './images/sorry.png';

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [matchedComments, setMatchedComments] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const { video_id } = useParams();

  const handleQuery = () => {
    if (!query.trim()) return;

    setLoading(true);
    setNotFound(false);
    setMatchedComments([]);

    axios.post(`https://flask-app-993257609003.asia-south1.run.app/ml/test-chatbot/${video_id}`, { query })
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
        setMatchedComments([]);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="chatbot-container">
      <h2 className="section-title text-white">Query Matching</h2>
      <div className="input-group chatbot-input-group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control chatbot-input"
          placeholder="Write a comment..."
        />
        <button
          onClick={handleQuery}
          className="btn chatbot-btn"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="text-center chatbot-loader">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Fetching results...</p>
        </div>
      )}

      {!loading && matchedComments.length === 0 && !notFound && (
        <div className="text-center chatbot-placeholder">
          <img src={questionImage} alt="Got a question?" style={{ maxWidth: '200px' }} />
          <p className="mt-2">Got a question? Try to find it in the comment section.</p>
        </div>
      )}

      {!loading && notFound && (
        <div className="text-center chatbot-placeholder">
          <img src={sorryImage} alt="No matching query found" style={{ maxWidth: '200px' }} />
          <p className="mt-2 text-danger">No matching query found</p>
        </div>
      )}

      {!loading && matchedComments.length > 0 && (
        <ul className="list-unstyled mt-3 chatbot-results text-white">
          {matchedComments.map((c) => <Comment key={c._id} {...c} />)}
        </ul>
      )}

      {/* Internal Styles */}
      <style>{`
        .chatbot-container {
          background: transparent;
          color: white;
          padding: 2rem;
          border-radius: 10px;
          // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          margin-top: 2rem;
        }
        .section-title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .chatbot-input-group {
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: inset 0 0 10px rgba(255,255,255,0.1);
          margin-bottom: 1.5rem;
        }
        .chatbot-input {
          background: transparent;
          border: none;
          color: white !important;
          padding: 0.75rem 1rem;
        }
        .chatbot-input::placeholder {
          color: rgba(255,255,255,0.7);
        }
        .chatbot-input:focus {
          outline: none;
          box-shadow: none;
          background: transparent;
        }
        .chatbot-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255,255,255,0.5);
          color: white;
          padding: 0.75rem 1.5rem;
          transition: background 0.3s ease;
        }
        .chatbot-btn:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .chatbot-loader p,
        .chatbot-placeholder p {
          color: white;
        }
        .chatbot-results li {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
