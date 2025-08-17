import React, { useState, useEffect } from 'react';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import DisplayVideo from './DisplayVideo';
import Footer from './Footer';

const Tab = () => {
  const { video_id } = useParams();
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const currentSegment =
    pathParts.length > 3 ? pathParts[pathParts.length - 1] : "allcomments";
  const initialTab = currentSegment === "allcomments" ? "all" : currentSegment;

  const [activeTab, setActiveTab] = useState(initialTab);

  const creator_id = location.state?.creator_id || "Unknown";

  useEffect(() => {
    const parts = location.pathname.split("/");
    const seg = parts.length > 3 ? parts[parts.length - 1] : "allcomments";
    const newTab = seg === "allcomments" ? "all" : seg;
    setActiveTab(newTab);
  }, [location.pathname]);

  const tabs = [
    { id: "all", label: "All", path: "allcomments" },
    { id: "clusters", label: "Clustered", path: "clusters" },
    { id: "chatbot", label: "Search", path: "chatbot" }
  ];

  return (
    <div>
      <DisplayVideo video_id={video_id} />

      <div className="container mt-4">
        <ul className="nav custom-tabs mt-3">
          {tabs.map((tabItem) => (
            <li className="nav-item" key={tabItem.id}>
              <Link
                to={`/comments/${video_id}/${tabItem.path}`}
                className={`nav-link fw-bold px-2 py-2 position-relative ${activeTab === tabItem.id ? "active-tab" : "hover-underline"}`}
                onClick={() => setActiveTab(tabItem.id)}
                state={{ creator_id: creator_id }}
              >
                {tabItem.label}
                <span className="underline"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Outlet />
      <div className="mb-5"></div>
      <Footer />

      <style>{`
        .custom-tabs {
          display: flex;
          justify-content: flex-start;
          border-bottom: none !important;
        }
        .custom-tabs .nav-item .nav-link {
          font-size: 1.1rem;
          color: white !important;
          background-color: transparent !important;
          transition: none;
          border: none !important;
        }
        .custom-tabs .nav-item .nav-link:hover {
          color: white !important;
        }
        .underline {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          width: 0;
          height: 3px;
          background-color: white;
          transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
        }
        .hover-underline:hover .underline {
          width: 70%;
          left: 15%;
        }
        .active-tab {
          color: white !important;
          font-weight: bold;
        }
        .active-tab .underline {
          width: 70%;
          left: 15%;
        }
      `}</style>
    </div>
  );
};

export default Tab;
