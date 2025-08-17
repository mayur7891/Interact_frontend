import React, { useState } from "react";
import logo from "./images/cover.png";
import { FaSignOutAlt, FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleNavToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const handleLogoutClick = () => {
        setShowModal(true);
    };

    const handleConfirmLogout = () => {
        setShowModal(false);
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            navigate("/login");
            // console.log("User logged out!");
        }, 300);
    };

    return (
        <>
          
            <nav className="navbar navbar-expand-lg p-3 " style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <div>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{
                                    maxHeight: "40px",
                                    height: "auto",
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </a>

                   
                    <button
                        className="navbar-toggler bg-white"
                        type="button"
                        onClick={handleNavToggle}
                        aria-controls="navbarNavDropdown"
                        aria-expanded={!isNavCollapsed}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                   
                    <div
                        className={`collapse navbar-collapse ${!isNavCollapsed ? "show" : ""}`}
                        id="navbarNavDropdown"
                    >
                        <ul className="navbar-nav ms-auto text-white">
                            <li className="nav-item">
                                <Link
                                    to="/"
                                    className="nav-link mx-2 active text-white"
                                    aria-current="page"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/videos"
                                    className="nav-link mx-2 text-white"
                                    aria-current="page"
                                >
                                    Videos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/dashboard"
                                    className="nav-link mx-2 text-white"
                                    aria-current="page"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link mx-2 text-white">
                                    About
                                </Link>
                            </li>
                           
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-light mx-1 p-1"
                                    style={{
                                        fontSize: "0.8rem",
                                        padding: "4px 6px",
                                        minWidth: "35px",
                                        minHeight: "30px",
                                        marginTop: "6px",
                                        border: "none",
                                    }}
                                    onClick={handleLogoutClick}
                                    title="Logout"
                                >
                                    <FaSignOutAlt size={16} />
                                </button>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </nav>

            
            {showModal && (
                <div className="plain-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="plain-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="plain-modal-header">
                            {/* <FaExclamationCircle className="exclamation-icon" size={24} /> */}
                            <h3>Confirm Logout</h3>
                            <button className="plain-close-btn" onClick={() => setShowModal(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="plain-modal-body">
                            <p>Are you sure you want to logout?</p>
                            
                            <div className="plain-modal-warning">
                                <FaExclamationCircle size={32} className="warning-icon" />
                            </div>
                        </div>
                        <div className="plain-modal-footer">
                            <button className="plain-cancel-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="plain-confirm-btn" onClick={handleConfirmLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            <style jsx="true">{`
        .plain-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
        }
        .plain-modal-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 360px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-family: sans-serif;
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .plain-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .plain-modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
          flex: 1;
          text-align: center;
          color: #333;
        }
        .exclamation-icon {
          color: #333;
          margin-right: 8px;
        }
        .plain-close-btn {
          background: transparent;
          border: none;
          font-size: 1.2rem;
          color: #999;
          cursor: pointer;
        }
        .plain-modal-body {
          margin-top: 16px;
          text-align: center;
          color: #555;
        }
        .plain-modal-warning {
          margin: 16px 0;
          text-align: center;
        }
        .warning-icon {
          color: #ff4d4f;
        }
        .plain-modal-footer {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .plain-cancel-btn,
        .plain-confirm-btn {
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.95rem;
          cursor: pointer;
          background: transparent;
          transition: background 0.2s, transform 0.2s;
          color: #333;
        }
        .plain-cancel-btn:hover,
        .plain-confirm-btn:hover {
          background: #f5f5f5;
          transform: scale(1.02);
        }
      `}</style>
        </>
    );
}

export default Navbar;
