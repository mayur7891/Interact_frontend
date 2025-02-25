import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';

const Chatbot = () => {
  const[query,setQuery]=useState("");
  const[matchedComments,setMatchedComments]=useState([]);
  const {video_id} = useParams();

  const handleQuery = ()=>{
        if (!query.trim()) return;

        const newquery = {
            query
        };

        axios.post(`http://localhost:5000/ml/test-chatbot/${video_id}`,newquery)
        .then((res)=>{
            if(res.data){
              setMatchedComments(res.data)
            }
        }).catch((err)=>{
          console.log(err)
        })
  };

  return (
    <div className='container mt-4'>
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
      <ul className="list-unstyled mt-3 align-items-center w-100">
          {matchedComments.map((c) => <Comment key={c._id} {...c} />)}
      </ul>
    </div>
  )
}

export default Chatbot;
