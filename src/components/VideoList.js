import React, { useState, useEffect } from "react";
import YoutubeCard from "./YoutubeCard";
import "./VideoList.css";
import axios from "axios";


const VideoList = () => {
    const [videoData, setVideoData] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/video/videos");
                setVideoData(response.data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, [videoData]);


    return (
        <div className="container">
            {videoData.map((video, index) => (
                <YoutubeCard key={index} video={video} />
            ))}
        </div>
    );
};

export default VideoList;
