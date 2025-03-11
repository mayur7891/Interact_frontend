import React, { useState, useEffect } from "react";
import axios from "axios";
import './clustered.css';
import { useParams, useLocation } from "react-router-dom";
import { FaReply } from "react-icons/fa";

const Clustered = () => {
    const [clusteredComments, setClusteredComments] = useState([]);
    const [expandedCluster, setExpandedCluster] = useState(null);
    const [allClusterComments, setAllClusterComments] = useState({});
    const { video_id } = useParams();
    const location = useLocation();
    const creator_id = location.state?.creator_id || "Unknown";
    const [showReplyBox, setShowReplyBox] = useState(null);
    const [showRepliesBox, setShowRepliesBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [allClusterReplies, setAllClusterReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clusteringLoading, setClusteringLoading] = useState(false);

    useEffect(() => {
        if (!video_id) return;
        axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/unique_clusters/${video_id}`)
            .then((res) => {
                setClusteredComments(res.data.clusters);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching clustered comments:", error);
                setLoading(false);
            });
    }, [video_id]);

    const fetchClusterComments = async (clusterId) => {
        try {
            const res = await axios.get(`https://flask-app-570571842976.us-central1.run.app/comments/cluster/${video_id}/${clusterId}`);
            setAllClusterComments((prev) => ({ ...prev, [clusterId]: res.data.comments }));
        } catch (error) {
            console.error("Error fetching cluster comments:", error);
        }
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

    useEffect(() => {
        axios.get(`https://flask-app-570571842976.us-central1.run.app/ml/get_all_cluster_replies/${video_id}/${String(creator_id)}`)
            .then((res) => {
                const clusteredReplies = new Map(res.data.map(item => [item.cluster_no, item.replies]));
                setAllClusterReplies(clusteredReplies);
            })
            .catch((err) => console.log(err));
    }, [creator_id, video_id]);

    const handleClustering = () => {
        setClusteringLoading(true);
        axios.get(`https://flask-app-570571842976.us-central1.run.app/ml/get_clusters/${video_id}`)
            .then((res) => {
                if (res.data.message) {
                    console.log(res.data);
                }
                setClusteringLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setClusteringLoading(false);
            });
    };

    return (
        <div className="container mt-4 bg-white">
            <h2>Clustered Comments
                <button type="button" className="btn btn-info" onClick={handleClustering}>
                    {clusteringLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "CLUSTER IT"}
                </button>
            </h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                clusteredComments.map((cluster, index) => (
                    <div key={index} className={`cluster-card list-unstyled mt-3 p-1 w-100 ${expandedCluster === cluster.cluster ? "cluster-clicked" : ""}`}>
                        <div className="cluster-header d-flex justify-content-between align-items-center w-100">
                            <div>
                                <strong>Cluster {cluster.cluster}</strong>
                                <p>{cluster.comment.comment}</p>
                            </div>
                            <div>
                                <button className="btn btn-transparent-secondary btn-sm" onClick={() => setShowReplyBox(cluster.cluster === showReplyBox ? null : cluster.cluster)}>
                                    <FaReply className='fs-5' />
                                </button>
                                <button className='btn btn-transparent arrow-btn' onClick={() => handleClusterClick(cluster.cluster)}>
                                    <div className="d-flex align-items-center mx-1">
                                        {expandedCluster === cluster.cluster ? "▲" : "▼"} Comments
                                    </div>
                                </button>
                            </div>
                        </div>

                        {expandedCluster === cluster.cluster && (
                            <ul className="list-group">
                                {allClusterComments[cluster.cluster] ? (
                                    allClusterComments[cluster.cluster].map((comment, idx) => (
                                        <li className="list-group-item" key={idx}>
                                            <strong>{comment.user_id}:</strong> {comment.comment}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">Loading comments...</li>
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
