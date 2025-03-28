import React, { useState, useEffect } from "react";
import axios from "axios";
import './clustered.css';
import { useParams, useLocation } from "react-router-dom";
import { FaReply } from "react-icons/fa";

import { io } from "socket.io-client";
const socket = io("https://flask-app-570571842976.asia-south1.run.app");

const Clustered = () => {
    const [clusteredComments, setClusteredComments] = useState([]);
    const [expandedCluster, setExpandedCluster] = useState(null);
    const [allClusterComments, setAllClusterComments] = useState({});
    const { video_id } = useParams();
    const location = useLocation();
    const creator_id = location.state?.creator_id || "Unknown";
    const [showReplyBox, setShowReplyBox] = useState(null);
    const [replyText, setReplyText] = useState({});
    const [loading, setLoading] = useState(true);

    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);


    useEffect(() => {
        if (!video_id) return;
        axios.get(`https://flask-app-570571842976.asia-south1.run.app/comments/unique_clusters/${video_id}`)
            .then((res) => {
                let clusters = res.data.clusters;
                let maxCluster = Math.max(...clusters.map(item => item.cluster));
                let sortedClusters = new Array(maxCluster + 1).fill(undefined);
                clusters.forEach(item => {
                    sortedClusters[item.cluster + 1] = item;
                });
                setClusteredComments(sortedClusters);
                setLoading(false);
            })
            .catch(() => { });
    }, [video_id]);

    const fetchClusterComments = async (clusterId) => {
        try {
            const res = await axios.get(`https://flask-app-570571842976.asia-south1.run.app/comments/cluster/${video_id}/${clusterId}`);
            setAllClusterComments((prev) => ({ ...prev, [clusterId]: res.data.comments }));
        } catch (error) { }
    };

    const handleClusterClick = (clusterId) => {
        if (expandedCluster === clusterId) {
            setExpandedCluster(null);
        } else {
            setExpandedCluster(clusterId);
            if (!allClusterComments[clusterId]) {
                fetchClusterComments(clusterId);
            }
        }
    };
    const handleReplyTextChange = (cluster_no, value) => {
        setReplyText(prev => ({
            ...prev,
            [cluster_no]: value
        }));
    };

    const addReply = async (cluster_no) => {
        if (!replyText[cluster_no]?.trim()) return;

        try {
            // Fetch all comments in the cluster
            const res = await axios.get(`https://flask-app-570571842976.asia-south1.run.app/comments/cluster/${video_id}/${cluster_no}`);

            if (!res.data || !Array.isArray(res.data.comments)) {
                // console.error("Invalid response format:", res.data);
                return;
            }

            const newReplies = res.data.comments.map(comment => ({
                comment_id: comment._id,  // Use individual comment ID
                reply_user_id: creator_id,
                reply_text: replyText[cluster_no]
            }));

            // Send all replies in parallel
            const replyPromises = newReplies.map(newReply =>
                axios.post(`https://flask-app-570571842976.asia-south1.run.app/comments/${newReply.comment_id}/reply`, newReply)
            );

            const responses = await Promise.all(replyPromises);
            let successCount = responses.filter(response => response.data.success).length;

            if (successCount === newReplies.length) {
                setAlertMessage("Replies added successfully!");
                setAlertType("success");
            } else {
                setAlertMessage("Some replies failed to post!");
                setAlertType("danger");
            }

            setTimeout(() => setAlertMessage(null), 3000);  


            // Emit socket events for successful replies
            responses.forEach(response => {
                if (response.data.success) {
                    socket.emit("new_reply", response.data.reply);
                }
            });

            // Clear the input field after replying
            setReplyText(prev => ({ ...prev, [cluster_no]: "" }));

        } catch (err) {
            // console.error("Error posting replies:", err);
            setAlertMessage("Error posting replies!");
            setAlertType("danger");
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    const handleClustering = () => {
        setLoading(true)
        axios.get(`https://flask-app-570571842976.asia-south1.run.app/ml/get_clusters/${video_id}`)
            .then((res) => {
                if (res.data.message) {
                    // console.log(res.data);
                }
                setLoading(false)
            })
            .catch((err) => {
                // console.log(err);
                setLoading(false)
            })
    };


    return (
        <div className="container mt-4" style={{ backgroundColor: "transparent", color: "white" }}>

            <h2 className="text-white">Clustered Comments <button type="button" class="btn btn-info bg-transparent text-white" onClick={handleClustering}>CLUSTER IT</button></h2>
            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
                    {alertMessage}
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                
                clusteredComments.map((cluster, index) => (
                    <div key={index} className="cluster-card list-unstyled mt-3 p-1 align-items-center w-100">
                        <div className="cluster-header d-flex justify-content-between align-items-center w-100">
                            <div>
                                <strong>{cluster.cluster === -1 ? "Miscellaneous" : `Cluster ${cluster.cluster}`}</strong>
                                <p className="mt-1 text-white">{cluster.comment.comment}</p>
                            </div>
                            <div>
                                {cluster.cluster !== -1 && creator_id === localStorage.getItem("user_id") && (
                                    <button className="btn btn-transparent text-white reply-icon"
                                        onClick={() => {
                                            if (cluster.cluster === showReplyBox) {
                                                setShowReplyBox(null);
                                            }
                                            else {
                                                setShowReplyBox(cluster.cluster)
                                            }
                                        }
                                        }>
                                        <FaReply className='fs-5' />
                                    </button>
                                )}
                                <button className='btn btn-transparent text-white' onClick={() => handleClusterClick(cluster.cluster)}>
                                    {expandedCluster === cluster.cluster ? "Hide" : "Show"} Comments
                                </button>
                            </div>
                        </div>
                        {showReplyBox === cluster.cluster && (
                            <div className="m-2">
                                <div className='d-flex justify-content-between'>
                                    <i className="user-icon bg-orange text-white fw-medium fst-normal">{String(localStorage.getItem("user_id")).charAt(0).toUpperCase()}</i>
                                    <input
                                        type="text"
                                        value={replyText[cluster.cluster] || ""}
                                        onChange={(e) => handleReplyTextChange(cluster.cluster, e.target.value)}
                                        placeholder="Write a reply..."
                                        className="ms-3 form-control bg-transparent text-white custom-placeholder"
                                    />
                                </div>
                                <div className='d-grid gap-2 d-sm-flex justify-content-sm-end'>
                                    <button className="btn btn-transparent mt-2 reply-btns px-3 text-white" onClick={() => setShowReplyBox(null)}>Cancel</button>
                                    <button onClick={() => addReply(cluster.cluster)} className="btn btn-transparent px-3 mt-2 reply-btns text-white">Reply</button>
                                </div>
                            </div>
                        )}


                        {expandedCluster === cluster.cluster && (
                            <ul className="list-group">
                                {allClusterComments[cluster.cluster] ? (
                                    allClusterComments[cluster.cluster].map((comment, idx) => (
                                        <li className="list-group-item text-white" key={idx} style={{ backgroundColor: "transparent", border: "none" }}>
                                            <strong>{comment.user_id}:</strong> {comment.comment}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item text-white" style={{ backgroundColor: "transparent", border: "none" }}>Loading Comments...</li>
                                )}
                            </ul>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Clustered;