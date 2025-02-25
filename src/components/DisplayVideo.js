import { FaRegThumbsUp, FaRegThumbsDown, FaShare} from 'react-icons/fa';
// import { motion } from 'framer-motion';
import Navbar from './Navbar';
// import Footer from './Footer';
// import CommentSection from './CommentSection';

import tech from './images/tech-logo.png'
import gaming from './images/gaming-logo.jpeg'
import travel from './images/travel-logo.jpeg'
export default function DisplayVideo({video_id}) {
    const sampleVideos = [
        {
            _id: '1',
            video_id: 101,
            title: 'Understanding React Hooks',
            channelLogo: tech,
            channelName: 'Tech Guru',
            subscribers: '1.2M',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            _id: '2',
            video_id: 102,
            title: 'AI in Everyday Life',
            channelLogo: gaming,
            channelName: 'AI Explained',
            subscribers: '850K',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            _id: '3',
            video_id: 103,
            title: 'The Future of Web Development',
            channelLogo: travel,
            channelName: 'Code World',
            subscribers: '600K',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            _id: '4',
            video_id: 104,
            title: 'The Future of Web Development',
            channelLogo: travel,
            channelName: 'Code World',
            subscribers: '600K',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            _id: '5',
            video_id: 105,
            title: 'The Future of Web Development',
            channelLogo: travel,
            channelName: 'Code World',
            subscribers: '600K',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
    ];
    

    const videoDetails = sampleVideos[video_id-1]; // Displaying one sample video for now

    return (
        <>
            <Navbar />
            <div className='container'>
                {/* Video Player Section */}
                <div className="d-flex justify-content-center py-3" style={{maxwidth:"1268px",maxheight:"713px"}}>
                    <iframe
                        // width="100%"
                        // height="540vh"
                        style={{
                            aspectRatio: "16/9",
                            maxwidth: "100%",
                            maxheight: "100%"
                        }}
                        className="rounded-0 w-100 h-100"
                        src={videoDetails.videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Video Details Section */}
                <div className="mt-3 px-4 d-flex align-items-center justify-content-between flex-wrap" style={{ whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Hide scrollbar for Webkit browsers */}
                    <style>{`
                        .overflow-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {/* Left Section */}
                    <div className="d-flex align-items-center">
                        <img src={videoDetails.channelLogo} alt="Channel Logo" className="rounded-circle" width={36} height={36} />
                        <div className="ms-2">
                            <p className="mb-0 fw-bold text-black">{videoDetails.channelName}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>{videoDetails.subscribers} subscribers</p>
                        </div>
                        <button className="ms-3 btn btn-danger fw-bold">Subscribe</button>
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="d-flex gap-3" style={{ display: 'inline-flex' }}>
                        <button className="btn btn-light d-flex align-items-center gap-1">
                            <FaRegThumbsUp /> Like
                        </button>
                        <button className="btn btn-light d-flex align-items-center gap-1">
                            <FaRegThumbsDown /> Dislike
                        </button>
                        <button className="btn btn-light d-flex align-items-center gap-1">
                            <FaShare /> Share
                        </button>
                        {/* <button className="btn btn-light d-flex align-items-center gap-1">
                            <FaDownload /> Download
                        </button>
                        <button className="btn btn-light d-flex align-items-center gap-1">
                            <FaSave /> Save
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
}
