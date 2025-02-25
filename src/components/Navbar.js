import React, { useState } from "react";
import logo from "./images/cover.png";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    // State to track if the navbar is collapsed
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    // State for logout confirmation modal
    const [showModal, setShowModal] = useState(false);

    // Toggle the collapse state
    const handleNavToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    // Open the logout confirmation modal
    const handleLogoutClick = () => {
        setShowModal(true);
    };

    // Confirm logout action
    const handleConfirmLogout = () => {
        setShowModal(false);
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            navigate("/login");
            console.log("User logged out!");
        }, 300); // Replace with your actual logout logic
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg p-3 nav-dark bg-dark" >
                <div className="container-fluid">
                    {/* Logo */}
                    <a className="navbar-brand" href="/">
                        <div>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{
                                    maxHeight: "40px", // Adjust based on your navbar height
                                    height: "auto",
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />

                        </div>
                    </a>

                    {/* Hamburger Toggle Button */}
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

                    {/* Navbar Links - Add "show" when not collapsed */}
                    <div className={`collapse navbar-collapse ${!isNavCollapsed ? "show" : ""}`} id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto text-white">
                            <li className="nav-item">
                                <Link to="/" className="nav-link mx-2 active text-white" aria-current="page">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/videos" className="nav-link mx-2 text-white" aria-current="page">
                                    Videos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link mx-2 text-white" to="/about">
                                   About
                                </Link>
                            </li>
                            
                            {/* Logout Button */}
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-light mx-1 p-1"
                                    style={{ fontSize: "0.8rem", padding: "4px 6px", minWidth: "35px", minHeight: "30px",marginTop:'6px', border:'none'}}
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

            {/* Logout Confirmation Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Logout</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
