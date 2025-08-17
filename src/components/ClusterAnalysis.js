import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const ClusterAnalysis = ({ video_id }) => {
    const [clusterSentiments, setClusterSentiments] = useState({});
    const [positiveClusters, setPositiveClusters] = useState(0);
    const [negativeClusters, setNegativeClusters] = useState(0);
    const [neutralClusters, setNeutralClusters] = useState(0);
    const [clusters, setClusters] = useState([]);
    const [expandedClusters, setExpandedClusters] = useState({});
    const [loading, setLoading] = useState(true);

    const creatorId = localStorage.getItem("user_id");

    const fetchClusterComments = async (clusterId) => {
        try {
            const res = await axios.get(
                `https://flask-app-993257609003.asia-south1.run.app/comments/cluster/${video_id}/${clusterId}`
            );
            
            return res.data.comments || [];
        } catch (error) {
            // console.error(error);
            return [];
        }
    };



    useEffect(() => {
        if (!video_id) return;

        axios
            .get(`https://flask-app-993257609003.asia-south1.run.app/comments/unique_clusters/${video_id}`)
            .then(async (res) => {
                if (!res.data || !Array.isArray(res.data.clusters)) {
                    setLoading(false);
                    return;
                }

                let posClusters = 0, negClusters = 0, neuClusters = 0;
                let clusterSentimentData = {};
                let clusterDataArray = [];

                for (const cluster of res.data.clusters) {
                    const clusterId = cluster.cluster;
                    const comments = await fetchClusterComments(clusterId);
                    // if (clusterId === 0) {  // Only log for cluster 0
                    //     console.log(`Cluster 0 Comments:`, comments);
                    //     console.log(`Cluster 0 Replies:`, comments.map(c => c.replies));
                    // }


                    let posCount = 0, negCount = 0, neuCount = 0;

                    comments.forEach((comment) => {
                        if (!comment.sentiment) return;
                        if (comment.sentiment === "positive") posCount++;
                        else if (comment.sentiment === "negative") negCount++;
                        else neuCount++;
                    });

                    if (posCount === negCount) {
                        neuClusters++;
                    } else if (negCount > posCount) {
                        negClusters++;
                    } else {
                        posClusters++;
                    }

                    clusterSentimentData[clusterId] = {
                        positive: posCount,
                        negative: negCount,
                        neutral: neuCount,
                    };

                    clusterDataArray.push({
                        cluster: clusterId,
                        comment: comments.length > 0 ? comments[0] : { comment: "No comment available" },
                        replies: comments.length > 0 ? comments[0].replies : [],
                        sentiment: posCount === negCount ? "neutral" : negCount > posCount ? "negative" : "positive"
                    });
                
                }

                setPositiveClusters(posClusters);
                setNegativeClusters(negClusters);
                setNeutralClusters(neuClusters);
                setClusterSentiments(clusterSentimentData);
                setClusters(clusterDataArray);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [video_id]);

    const toggleReplies = (clusterId) => {
        setExpandedClusters((prev) => ({
            ...prev,
            [clusterId]: !prev[clusterId],
        }));
    };

    return (
        <div className="container text-center" style={{ color: "white" }}>
            <h2 className='text-white'>Cluster Sentiment Analysis</h2>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "150px" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden text-white">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="chart-container w-100" style={{ maxWidth: "600px", margin: "auto", overflowX: "auto" }}>
                        <Bar
                            data={{
                                labels: ["Positive Clusters", "Negative Clusters", "Neutral Clusters"],
                                datasets: [
                                    {
                                        label: "Number of Clusters",
                                        data: [positiveClusters, negativeClusters, neutralClusters],
                                        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: "top",
                                        labels: { color: "white" }
                                    },
                                    tooltip: { enabled: true },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { color: "white" }
                                    },
                                    x: {
                                        ticks: { color: "white" }
                                    }
                                },
                            }}
                            style={{ position: 'relative' }}
                        />
                    </div>

                    <div className="mt-4">
                        {clusters.map(({ cluster, comment, replies, sentiment }) => (
                            <div key={cluster} className="card bg-dark text-white mb-3 w-100" style={{ minHeight: "80px", wordWrap: "break-word", transition: "none" }}>
                                <div className="card-body p-2 overflow-auto">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="card-title mb-1 text-wrap">Cluster {cluster}</h6>
                                        <span className={`badge ${sentiment === "positive" ? "bg-success" :
                                            sentiment === "negative" ? "bg-danger" : "bg-warning"
                                            }`}>
                                            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                                        </span>
                                    </div>
                                    <p className="card-text text-white small mb-1 text-wrap">"{comment?.comment || "No comment available"}"</p>
                                    <button className="btn btn-outline-light btn-sm" onClick={() => toggleReplies(cluster)}>
                                        {expandedClusters[cluster] ? "Hide Replies" : "Show Replies"}
                                    </button>
                                    {expandedClusters[cluster] && (
                                        <div className="mt-2 p-2 bg-transparent rounded small text-white overflow-auto">
                                            {replies?.length > 0 ? (
                                                replies.map((reply, index) => (
                                                    <p key={index} className="text-white mb-1 small text-wrap">
                                                        • {reply.reply_text}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-white small">No replies available.</p>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ClusterAnalysis;
