import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import banner from './images/slider-img.png';
import Services from './Services';
import Intro from './Intro';
import Footer from './Footer';
import Lottie from 'lottie-react';
import animationData from './animations/tech.json';

export default function Banner() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const redirectPath = userId ? '/videos' : '/login';

    const handleNavigation = () => {
        // console.log("Navigating to:", redirectPath);
        navigate(redirectPath);
    };

    return (
        <>
            {/* Inline styles for our custom animated background */}
            <style>{`
                @keyframes blob {
                    0% {
                        transform: scale(1) translate(0, 0);
                    }
                    33% {
                        transform: scale(1.1) translate(10px, -10px);
                    }
                    66% {
                        transform: scale(0.9) translate(-10px, 10px);
                    }
                    100% {
                        transform: scale(1) translate(0, 0);
                    }
                }
                .animated-bg {
                    animation: blob 20s ease-in-out infinite;
                    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%);
                }
            `}</style>

            <div
                className="banner-container position-relative"
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    overflow: 'hidden',
                    marginTop:'-7rem'

                }}
            >
                {/* Unique Animated Background */}
                <div
                    className="animated-bg position-absolute top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1 }}
                ></div>

                {/* Main Content */}
                <div
                    className="d-flex flex-column flex-md-row align-items-center justify-content-center text-dark py-5 position-relative"
                    style={{ minHeight: '100vh', zIndex: 10 }}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -70 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="w-75 w-md-35 text-center position-relative mx-2"
                    >
                        <img
                            src={banner}
                            className="img-fluid rounded shadow-lg"
                            style={{ maxWidth: '70%', borderRadius: '20px' }}
                            alt="Technology Banner"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="w-100 w-md-50 text-center px-4 mt-4 mt-md-0 position-relative mx-2"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            padding: '40px',
                            zIndex: 10
                        }}
                    >
                        <motion.h1
                            className="display-5 fw-bold text-light"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            Revolutionizing Your Digital Experience
                        </motion.h1>
                        <motion.p
                            className="lead mt-3 text-light"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                        >
                            An innovative software solution designed to streamline your workflow and boost productivity.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            style={{ position: 'relative', zIndex: 20 }}
                        >
                            <button
                                onClick={handleNavigation}
                                className="btn btn-light mt-4 px-5 py-3 fw-bold shadow-lg"
                                style={{
                                    borderRadius: '30px',
                                    transition: '0.3s',
                                    color: '#6D5BBA',
                                    cursor: 'pointer'
                                }}
                            >
                                Try a Demo
                            </button>
                        </motion.div>

                        {/* Decorative Lottie Animation */}
                        <div
                            className="position-absolute bottom-0 start-50 translate-middle-x"
                            style={{ zIndex: 1, pointerEvents: 'none' }}
                        >
                            <Lottie animationData={animationData} style={{ height: 150 }} />
                        </div>
                    </motion.div>
                </div>
            </div>

            <Services />
            <Intro />
            <Footer />
        </>
    );
}
