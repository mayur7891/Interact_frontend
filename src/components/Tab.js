import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import DisplayVideo from './DisplayVideo';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const Tab = () => {
    const[activeTab,setActiveTab]=useState("all");
    const { video_id } = useParams();

    const location = useLocation();
    const creator_id = location.state?.creator_id || "Unknown";
    const user_id = localStorage.getItem("user_id");

    const tabs = creator_id===user_id
        ?[
            { id: "all", label: "All", path: "allcomments" },
            { id: "clusters", label: "Clustered", path: "clusters" },
            { id: "chatbot", label: "Chatbot", path: "chatbot" },
            { id: "sentiment", label: "Sentiment", path: "sentiment" },
            { id: "your_comments", label: "Your Comments", path: "your_comments" }
        ]
        :[
            { id: "all", label: "All", path: "allcomments" },
            { id: "clusters", label: "Clustered", path: "clusters" },
            { id: "chatbot", label: "Chatbot", path: "chatbot" },
            { id: "your_comments", label: "Your Comments", path: "your_comments" }
        ];


  return (
    <div>
        {/* <div className="z-3 position-absolute" style={{top:"5.7rem",left:"5px"}}>
                <Link to="/videos">
                <i className="bi bi-arrow-left-circle-fill fs-1"></i>
                </Link>
            </div> */}
            <DisplayVideo video_id={video_id} />

            {/* Left-Aligned Navigation Tabs with Animated Underline */}
            <div className="d-flex justify-content-start px-4 container">
                <ul className="nav custom-tabs mt-3">
                    {tabs.map((tab) => (
                        <li className="nav-item" key={tab.id}>
                            <Link
                                to={`/comments/${video_id}/${tab.path}`}
                                className={`nav-link fw-bold px-2 py-2 position-relative ${activeTab === tab.id ? "active-tab" : "hover-underline"}`}
                                onClick={() => setActiveTab(tab.id)}

                                state={{ creator_id: creator_id }}
                            >
                                {tab.label}
                                <span className="underline"></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>


            
            <Outlet/>
            <div className="mb-5"></div>
            <Footer />

            {/* Custom Styling for Tabs */}
            <style>{`
                .custom-tabs {
                    display: flex;
                    justify-content: flex-start; /* Aligns tabs to the left */
                    border-bottom: none !important; /* Removes default border */
                }

                .custom-tabs .nav-item .nav-link {
                    font-size: 1.1rem;
                    color: #333;
                    transition: color 0.3s ease-in-out;
                    border: none !important;
                }
                
                .custom-tabs .nav-item .nav-link:hover {
                    color: #0056b3 !important;
                }

                /* Stylish Animated Underline */
                .underline {
                    content: '';
                    position: absolute;
                    bottom: -3px;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background-color: #007bff;
                    transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
                }

                .hover-underline:hover .underline {
                    width: 70%; /* Slightly smaller to prevent overlap */
                    left: 15%;
                }

                .active-tab {
                    color: #0056b3 !important;
                    font-weight: bold;
                }
                
                .active-tab .underline {
                    width: 70%; /* Slightly smaller to prevent overlap */
                    left: 15%;
                }
            `}</style>
        </div>
    
  )
}

export default Tab;