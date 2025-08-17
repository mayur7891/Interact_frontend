import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import YoutubeCard from "./YoutubeCard";
import gaming from "./images/gaming-logo.jpeg";
import music from "./images/music-logo.png";
import cooking from "./images/cooking-logo.jpeg";
import tech from "./images/tech-logo.jpeg";
import travel from "./images/info-logo.jpg";
import gameThumb from "./images/gaming-thumbnail.jpeg";
import musicThumbnail from "./images/music-thumbnail.jpeg";
import cookingThumbnail from "./images/cooking-thumbnail.jpeg";
import techThumbnail from "./images/tech-thumbnail.jpeg";
import infoThumbnail from "./images/info-thumbnail.jpeg";
import Navbar from "./Navbar";
import Footer from "./Footer";

const channelIcons = [gaming, music, cooking, tech, travel];
const thumbnails = [gameThumb, musicThumbnail, cookingThumbnail, techThumbnail, infoThumbnail];

const Dashboard = () => {
    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("user_id");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://flask-app-993257609003.asia-south1.run.app/video/videos");
                const filteredVideos = response.data.filter(video => video.creator_id === userId);

                // Assigning thumbnails and logos based on video_id
                const videosWithExtras = filteredVideos.map((video) => {
                    const index = (video.video_id - 1) % thumbnails.length;
                    return {
                        ...video,
                        channelIcon: channelIcons[index],
                        thumbnail: thumbnails[index]
                    };
                });

                setVideoData(videosWithExtras);
            } catch (error) {
                
            }
            setLoading(false);
        };

        fetchVideos();
    }, [userId]);

    return (
        <>
        <Navbar></Navbar>
        <div className="container mt-4" style={{height:'100vh'}}>
          
            <div className="p-4" style={{ background: "transparent" }}>
                <h2 className="h4 mb-4 text-center text-light">Select a Video for Analysis</h2>
                <div className="row g-3">
                    {loading ? (
                        <div className="text-center w-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : videoData.length > 0 ? (
                        videoData.map((video, index) => (
                            <div
                                className="col-md-3 col-sm-6"
                                key={video.video_id || index}
                                onClick={() => navigate(`/analysis/${video.video_id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <YoutubeCard video={video} channelIcon={video.channelIcon} thumbnail={video.thumbnail} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No videos available.</p>
                    )}
                </div>
            </div>
        </div>
        <Footer></Footer>
        </>
    );
};

export default Dashboard;
