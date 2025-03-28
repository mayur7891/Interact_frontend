import React from 'react';
import { useParams } from 'react-router-dom';
import SentimentAnalysis from './SentimentAnalysis';
import ClusterAnalysis from './ClusterAnalysis';
import './VideoAnalysis.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Assistant from './Assistant';

const VideoAnalysis = () => {
    const { video_id } = useParams();

    return (
        <>
            <Navbar />
            <div className="video-analysis-container">
                <div className="analysis-section">
                    <SentimentAnalysis video_id={video_id} />
                </div>
                <div className="analysis-section">
                    <ClusterAnalysis video_id={video_id} />
                </div>
                <div className="analysis-section">
                    <Assistant video_id={video_id} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default VideoAnalysis;
