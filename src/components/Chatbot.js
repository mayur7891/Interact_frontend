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
  const { video_id } = useParams();

  const handleQuery = () => {
    if (!query.trim()) return;

    const newquery = { query };

    axios.post(`http://localhost:5000/ml/test-chatbot/${video_id}`, newquery)
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
        console.log(err);
        setMatchedComments([]);
        setNotFound(true);
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
        <button onClick={handleQuery} className="btn btn-primary">Search</button>
      </div>

      {/* Show initial image when no query is entered */}
      { matchedComments.length === 0 && !notFound && (
        <div className="text-center">
          <img src={questionImage} alt="Got a question?" style={{ maxWidth: '200px' }} />
          <p className="mt-2">Got a question? Try to find it in the comment section.</p>
        </div>
      )}

      {/* Show error image when no matching query is found */}
      {notFound && (
        <div className="text-center">
          <img src={sorryImage} alt="No matching query found" style={{ maxWidth: '200px' }} />
          <p className="mt-2 text-danger">No matching query found</p>
        </div>
      )}

      {/* Show comments when there are results */}
      {matchedComments.length > 0 && (
        <ul className="list-unstyled mt-3 align-items-center w-100">
          {matchedComments.map((c) => <Comment key={c._id} {...c} />)}
        </ul>
      )}
    </div>
  );
};

export default Chatbot;
