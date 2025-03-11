import React, { useState, useEffect } from "react";
import YoutubeCard from "./YoutubeCard";
import "./VideoList.css";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VideoList = () => {
    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(true); // Added loader state

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true); // Show loader before fetching videos
            try {
                const response = await axios.get("https://flask-app-570571842976.us-central1.run.app/video/videos");
                console.log("Fetched videos:", response.data);
                setTimeout(() => {
                    setVideoData(response.data);
                    setLoading(false); // Hide loader after data is loaded
                }, 500);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, []); // Dependency array fixed to avoid infinite re-fetch

    return (
        <>
            <Navbar />
            <div className="min-vh-100" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                <div className="video-container">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        videoData.length > 0 ? (
                            videoData.map((video, index) => <YoutubeCard key={index} video={video} />)
                        ) : (
                            <p className="text-center text-muted">No videos available.</p>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default VideoList;
