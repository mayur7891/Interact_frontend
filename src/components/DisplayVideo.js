import { FaRegThumbsUp, FaRegThumbsDown, FaShare } from 'react-icons/fa';
import Navbar from './Navbar';
import tech from './images/tech-logo.png';
import gaming from './images/gaming-logo.jpeg';
import travel from './images/travel-logo.jpeg';
import music from './images/music-logo.png';
import cooking from './images/cooking-logo.jpeg';
import info from './images/info-logo.jpg'
export default function DisplayVideo({ video_id }) {
    const sampleVideos = [
        {
            _id: '1',
            video_id: 101,
            title: 'NOOB LOBBY SOLO VS SQUAD MY BEST GAMEPLAY | GARENA FREE FIRE',
            channelLogo: gaming,
            channelName: 'Total Gaming',
            subscribers: '44.5M',
            videoUrl: "https://www.youtube.com/embed/YPrfNgdZ0tU?si=9QM0nDhdUhliJlAC"
        },
        {
            _id: '2',
            video_id: 102,
            title: 'AI in Everyday Life',
            channelLogo: music,
            channelName: 'T-Series',
            subscribers: '289M',
            videoUrl: 'https://www.youtube.com/embed/XjpgwSQa9B4?si=L2yI-ybmRwreixYT'
        },
        {
            _id: '3',
            video_id: 103,
            title: 'The Future of Web Development',
            channelLogo: cooking,
            channelName: 'MadhurasRecipe Marathi',
            subscribers: '600K',
            videoUrl: 'https://www.youtube.com/embed/0pa1rC_EvxI?si=1grU7JUrS2JRPVVJ'
        },
        {
            _id: '4',
            video_id: 104,
            title: 'The Future of Web Development',
            channelLogo: tech,
            channelName: 'take U forward',
            subscribers: '795K',
            videoUrl: 'https://www.youtube.com/embed/M3_pLsDdeuU?si=Rbl7N-seYHQ08k14'
        },
        {
            _id: '5',
            video_id: 105,
            title: 'The Future of Web Development',
            channelLogo: info,
            channelName: 'Simply Tech',
            subscribers: '326K',
            videoUrl: 'https://www.youtube.com/embed/JaUCiKTNBxQ?si=VEW8xwb9maFyN2Zy'
        },
    ];

    const videoDetails = sampleVideos[video_id - 1]; 

    return (
        <>
            <Navbar />
           
            <style>{`
        @media (max-width: 576px) {
          .channel-logo-sm {
            width: 24px !important;
            height: 24px !important;
            margin-bottom: 0.5rem;
          }
          .channel-name-sm {
            font-size: 0.8rem !important;
          }
          .subscribe-btn-sm {
            font-size: 0.8rem !important;
            padding: 0.25rem 0.5rem !important;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
            <div className="container">
                
                <div
                    className="d-flex justify-content-center py-3"
                    style={{ maxWidth: "1268px", maxHeight: "713px" }}
                >
                    <iframe
                        style={{
                            aspectRatio: "16/9",
                            maxWidth: "100%",
                            maxHeight: "100%"
                        }}
                        className="rounded-0 w-100 h-100"
                        src={videoDetails.videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

               
                <div
                    className="mt-4 px-4 d-flex align-items-center justify-content-between flex-wrap"
                    style={{ whiteSpace: "nowrap", marginTop: "1rem" }}
                >
                   
                    <div className="d-flex align-items-center flex-wrap">
                        <img
                            src={videoDetails.channelLogo}
                            alt="Channel Logo"
                            className="rounded-circle channel-logo-sm"
                            width={36}
                            height={36}
                        />
                        <div className="ms-2">
                            <p className="mb-0 fw-bold text-white channel-name-sm" style={{ fontSize: "1rem" }}>
                                {videoDetails.channelName}
                            </p>
                            <p className="mb-0 text-white" style={{ fontSize: "14px" }}>
                                {videoDetails.subscribers} subscribers
                            </p>
                        </div>
                        <button
                            className="ms-3 btn btn-sm fw-bold subscribe-btn-sm"
                            style={{
                                backgroundColor: "linear-gradient(135deg, #0f172a, #1e293b)",
                                color: "white",
                                borderRadius: "999px",
                                padding: "0.25rem 0.75rem",
                                marginTop: "0.5rem"
                            }}
                        >
                            Subscribe
                        </button>
                    </div>

                    
                    <div className="d-flex gap-3 flex-wrap" style={{ display: "inline-flex" }}>
                        <button
                            className="btn btn-sm d-flex align-items-center gap-1"
                            style={{
                                backgroundColor: "linear-gradient(135deg, #0f172a, #1e293b)",
                                color: "white",
                                borderRadius: "999px",
                                padding: "0.25rem 0.75rem"
                            }}
                        >
                            <FaRegThumbsUp /> Like
                        </button>
                        <button
                            className="btn btn-sm d-flex align-items-center gap-1"
                            style={{
                                backgroundColor: "#linear-gradient(135deg, #0f172a, #1e293b)",
                                color: "white",
                                borderRadius: "999px",
                                padding: "0.25rem 0.75rem"
                            }}
                        >
                            <FaRegThumbsDown /> Dislike
                        </button>
                        <button
                            className="btn btn-sm d-flex align-items-center gap-1"
                            style={{
                                backgroundColor: "#linear-gradient(135deg,rgb(26, 48, 98),rgb(36, 72, 132))",
                                color: "white",
                                borderRadius: "999px",
                                padding: "0.25rem 0.75rem"
                            }}
                        >
                            <FaShare /> Share
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
