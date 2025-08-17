import React from "react";
import { Link } from "react-router-dom";

function YouTubeCard({ video }) {
    // console.log(video.creator_id)
    return (
        <Link to={`/comments/${video.video_id}`} style={{ textDecoration: "none" }} state={{ creator_id: video.creator_id }}>
            <div
                className="card"
                style={{
                    width: "20rem",
                    background: "transparent",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    boxShadow: "none",
                    marginTop: "0px",
                    marginBottom: "0px"
                }}
            >
               
                <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <img
                        src={video.thumbnail}
                        alt="thumbnail"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </div>

          
                <div className="px-2 pt-3 d-flex">
                    
                    <img
                        src={video.channelIcon}
                        alt="Channel Icon"
                        className="rounded-circle me-2"
                        style={{ width: "36px", height: "36px" }}
                    />

                
                    <div style={{ maxWidth: "85%" }}>
                        <h6
                            className="mb-1 fw-bold text-truncate"
                            style={{
                                fontSize: "0.9rem",
                                color: "white"
                            }}
                            title={video.title}
                        >
                            {video.title}
                        </h6>
                        <p
                            className="mb-1 text-white-50 small text-truncate"
                            style={{ fontSize: "0.75rem" }}
                        >
                            {video.creator_id}
                        </p>
                        <p
                            className="mb-0 text-white-50 small"
                            style={{ fontSize: "0.7rem" }}
                        >
                            3.1M views • 6 days ago
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default YouTubeCard;
