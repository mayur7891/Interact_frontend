import React, { useState, useEffect } from "react";
import YoutubeCard from "./YoutubeCard";
import "./VideoList.css";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VideoList = () => {
    const [videoData, setVideoData] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get("https://flask-app-570571842976.us-central1.run.app/video/videos");
                setVideoData(response.data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, [videoData]);


    return (
        <>
            <Navbar></Navbar>
            <div className="min-vh-100" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
                <div className="video-container">
                    {videoData.map((video, index) => (
                        <YoutubeCard key={index} video={video} />
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default VideoList;
