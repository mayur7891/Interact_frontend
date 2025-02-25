import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import './yourreply.css';

const YourReply = () => {
  const { video_id } = useParams();
  const user_id = localStorage.getItem("user_id");
  const[yourComments,setYourComments]=useState([]);

  useEffect(()=>{
    axios.get(`http://localhost:5000/comments/${user_id}/${video_id}`)
    .then((res)=>{
        if(res.data.success){
            setYourComments(res.data.comments);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
  },[user_id,video_id]);


  return (
    <div className="container mt-4 min-vh-100">
      <h2>Your Comments</h2>
      <div className='container your-comment-card ' style={{border:'none'}}>
        <ul className="list-unstyled mt-3 align-items-center w-100">
            {yourComments.map((c) => <Comment key={c._id} {...c} />)}
        </ul>
      </div>
    </div>
  )
}

export default YourReply
