import React, { useState, useEffect } from "react";
import YoutubeCard from "./YoutubeCard";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
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

const channelIcons = [gaming, music, cooking, tech, travel];
const thumbnails = [gameThumb, musicThumbnail, cookingThumbnail, techThumbnail, infoThumbnail];

const VideoList = () => {
    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "https://flask-app-993257609003.asia-south1.run.app/video/videos"
                );
                // Simulate a slight delay for demonstration
                setTimeout(() => {
                    // Cycle through icons and thumbnails
                    const videosWithExtras = response.data.map((video, index) => ({
                        ...video,
                        channelIcon: channelIcons[index % channelIcons.length],
                        thumbnail: thumbnails[index % thumbnails.length]
                    }));
                    setVideoData(videosWithExtras);
                    setLoading(false);
                }, 500);
            } catch (error) {
                // console.error("Error fetching videos:", error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <>
            <Navbar />
            <div
                className="min-vh-100"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
            >
                <div className="container-fluid mt-4 px-0">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                            <div
                                className="spinner-border text-primary"
                                role="status"
                                style={{ width: "3rem", height: "3rem" }}
                            >
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : videoData.length > 0 ? (
                        // Use a flex container that wraps, so cards with fixed width will wrap naturally
                        <div className="d-flex flex-wrap justify-content-start">
                            {videoData.map((video, index) => (
                                <div key={video.video_id || index} className="p-2">
                                    <YoutubeCard video={video} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted">No videos available.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default VideoList;
