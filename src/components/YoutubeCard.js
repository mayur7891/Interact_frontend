import React from "react";
import { Link } from "react-router-dom";

function YouTubeCard({ video }) {

    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={video.thumbnail} className="card-img-top" alt="thumbnail" />
            <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                    {/* <img src={video.channelIcon} alt="Channel Icon" className="rounded-circle me-2" style={{ width: "40px", height: "40px" }} /> */}
                    <h6 className="mb-0">{video.creator_id}</h6>
                </div>
                <h5 className="card-title">{video.title}</h5>
                <p className="card-text text-muted">
                    {video.description}<br />
                    3M+ views • {video.duration} mins
                </p>
                <Link to={`/comments/${video.video_id}/comments`} className="btn btn-primary" >
                    <i className="fab fa-youtube"></i> Watch Now
                </Link>
            </div>
        </div>
    );
}

export default YouTubeCard