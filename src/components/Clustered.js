import React, { useState, useEffect } from "react";
import axios from "axios";
import './clustered.css';
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FaReply } from "react-icons/fa";

const Clustered = () => {
    const [clusteredComments, setClusteredComments] = useState([]); // Stores unique clusters
    const [expandedCluster, setExpandedCluster] = useState(null); // Stores which cluster is expanded
    const [allClusterComments, setAllClusterComments] = useState({}); // Stores all comments of a cluster
    const { video_id } = useParams();

    const location = useLocation();
    const creator_id = location.state?.creator_id || "Unknown";

    const [showReplyBox, setShowReplyBox] = useState(null);
    const [showRepliesBox, setShowRepliesBox] = useState(false);
    const [replyText, setReplyText] = useState({});

    const [allClusterReplies, setAllClusterReplies] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true)

    const handleReplyTextChange = (cluster_no, value) => {
        setReplyText(prev => ({
            ...prev,
            [cluster_no]: value
        }));
    };

    useEffect(() => {
        if (!video_id) return;

        // Fetch distinct clusters with one comment each
        axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/unique_clusters/${video_id}`)
            .then((res) => {
                // setClusteredComments(res.data.clusters)

                let clusters = res.data.clusters;

                // Find the maximum cluster value to create an array of that size
                let maxCluster = Math.max(...clusters.map(item => item.cluster));

                // Create an empty array with undefined values of maxCluster + 1 size
                let sortedClusters = new Array(maxCluster + 1).fill(undefined);

                // Place each item at its respective cluster index
                clusters.forEach(item => {
                    sortedClusters[item.cluster + 1] = item;
                });

                setClusteredComments(sortedClusters);
                setLoading(false)
            })
            .catch((error) => { 
                // console.error("Error fetching clustered comments:", error) 
            });
    }, [video_id]);

    // Function to fetch all comments for a specific cluster
    const fetchClusterComments = async (clusterId) => {
        try {
            const res = await axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/cluster/${video_id}/${clusterId}`);
            setAllClusterComments((prev) => ({ ...prev, [clusterId]: res.data.comments }));
        } catch (error) {
            // console.error("Error fetching cluster comments:", error);
        }
    };

    // Toggle to expand/collapse cluster
    const handleClusterClick = (clusterId) => {
        if (expandedCluster === clusterId) {
            setExpandedCluster(null); // Collapse if clicked again
        } else {
            setExpandedCluster(clusterId);
            if (!allClusterComments[clusterId]) {
                fetchClusterComments(clusterId); // Fetch comments if not already loaded
            }
        }
    };

    useEffect(() => {
        axios.get(`https://flask-app-570571842976.us-central1.run.app/ml/get_all_cluster_replies/${video_id}/${String(creator_id)}`)
            .then((res) => {
                const clusteredReplies = new Map(res.data.map(item => [item.cluster_no, item.replies]));
                setAllClusterReplies(clusteredReplies);
            })
            .catch((err) => {
                // console.log(err);
            })
    }, [creator_id, video_id]);

    // console.log((allClusterReplies.get(41))[0].reply_text)

    const addReply = (cluster_no) => {
        if (!replyText[cluster_no]?.trim()) return;

        const newReply = {
            reply_text: replyText[cluster_no],
            creator_id: creator_id
        };

        axios.post(`https://flask-app-570571842976.us-central1.run.app/ml/reply_cluster/${video_id}/${cluster_no}`, newReply)
            .then((res) => {
                if (res.data.message) {
                    setAllClusterReplies(prev => {
                        const newMap = new Map(prev);
                        const updatedReplies = [...(newMap.get(cluster_no) || []), {
                            reply_text: newReply.reply_text,
                            timestamp: new Date().toISOString()
                        }];
                        newMap.set(cluster_no, updatedReplies);
                        return newMap;
                    });
                    setReplyText(prev => ({ ...prev, [cluster_no]: "" })); // Clear input for that cluster
                }
            })
            .catch((err) => {
                // console.error("Error posting reply:", err);
            });
    };

    const handleClustering = () => {
        setLoading(true)
        axios.get(`https://flask-app-570571842976.us-central1.run.app/ml/get_clusters/${video_id}`)
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
        <div className="container mt-4 bg-white">
            <h2>Clustered Comments <button type="button" class="btn btn-info" onClick={handleClustering}>CLUSTER IT</button></h2>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                clusteredComments.map((cluster, index) => (
                    <div key={index}
                        className={`cluster-card list-unstyled mt-3 p-1 align-items-center w-100 ${expandedCluster === cluster.cluster ? "cluster-clicked" : ""}`}
                    >

                        <div className="cluster-header d-flex justify-content-between align-items-center w-100">
                            <div className="abc">
                                <strong>{cluster.cluster === -1 ? "Miscellaneous" : `Cluster ${cluster.cluster}`}</strong>
                                <p className="mt-1">
                                    {expanded ? cluster.comment.comment : cluster.comment.comment.substring(0, 100)}
                                    {cluster.comment.comment.length > 100 && (
                                        <span className="text-primary ms-1" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
                                            {expanded ? "Read less" : "Read more"}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                {cluster.cluster !== -1 && creator_id === localStorage.getItem('user_id') && (
                                    <button className="btn btn-transparent-secondary btn-sm reply-icon"
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
                                <button className='btn btn-transparent arrow-btn'
                                    onClick={() => handleClusterClick(cluster.cluster)}>
                                    <div className="d-flex align-items-center mx-1">
                                        {expandedCluster === cluster.cluster ? <i className="bi bi-chevron-up me-1" /> : <i className="bi bi-chevron-down me-1" />}
                                        {/* <i className="bi bi-chevron-down me-1"/> */}
                                        Comments
                                    </div>
                                </button>
                                <button className='btn btn-transparent arrow-btn'
                                    onClick={() => {
                                        if (cluster.cluster === showRepliesBox) {
                                            setShowRepliesBox(null)
                                        }
                                        else {
                                            setShowRepliesBox(cluster.cluster)
                                        }
                                    }
                                    }>
                                    <div className="d-flex align-items-center mx-1">
                                        {showRepliesBox === cluster.cluster ? <i className="bi bi-chevron-up me-1" /> : <i className="bi bi-chevron-down me-1" />}
                                        {/* <i className="bi bi-chevron-down me-1"/> */}
                                        Replies
                                    </div>
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
                                        className="ms-3 form-control"
                                    />
                                </div>
                                <div className='d-grid gap-2 d-sm-flex justify-content-sm-end'>
                                    <button className="btn btn-transparent mt-2 reply-btns px-3" onClick={() => setShowReplyBox(null)}>Cancel</button>
                                    <button onClick={() => addReply(cluster.cluster)} className="btn btn-transparent px-3 mt-2 reply-btns">Reply</button>
                                </div>
                            </div>
                        )}


                        {expandedCluster === cluster.cluster && (
                            <ul className="list-group">
                                {allClusterComments[cluster.cluster] ? (
                                    allClusterComments[cluster.cluster].map((comment, idx) => (
                                        <li className="list-group-item" key={idx}>
                                            <strong>{comment.user_id}:</strong> {comment.comment}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">Loading Comments...</li>
                                )}
                            </ul>
                        )}

                        {showRepliesBox === cluster.cluster && (
                            <ul className="list-group">
                                {allClusterReplies.get(cluster.cluster) ? (
                                    allClusterReplies.get(cluster.cluster).map((reply, idx) => (
                                        <li className="list-group-item" key={idx}>
                                            <strong>{creator_id}:</strong> {reply.reply_text}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No Reply Added Yet!</li>)
                                }
                            </ul>
                        )}

                    </div>
                )))}
        </div>
    );
};

export default Clustered;
