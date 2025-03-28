import {  motion } from 'framer-motion';
import { FaComments, FaSearch, FaChartLine } from 'react-icons/fa';
import { Tilt } from 'react-tilt';
import { useState } from 'react';

const defaultOptions = {
    reverse: false,
    max: 25,
    perspective: 1000,
    scale: 1.1,
    speed: 500,
    transition: true,
    axis: null,
    reset: true
};

export default function Services() {
    const [hovered, setHovered] = useState(null);

    const services = [
        { icon: <FaComments size={50} />, title: 'Comment Clustering', description: 'Efficiently group similar comments to improve responses.' },
        { icon: <FaSearch size={50} />, title: 'Query Matching', description: 'Find relevant answers instantly within comment sections.' },
        { icon: <FaChartLine size={50} />, title: 'Comment Analysis', description: 'Analyze sentiments and gain deeper insights from comments.' }
    ];

    return (
        <div className="text-center py-5 position-relative" style={{ background: '#0F172A', color: 'white', minHeight: '100vh' }}>
            <h2 className="display-5 fw-bold mb-3" style={{color:'white'}}>Here's What We Offer</h2>
            <p className="lead mb-5" style={{ opacity: 0.8 }}>Enhance your social media experience with AI-powered insights.</p>

            <div className="d-flex flex-wrap justify-content-center gap-4">
                {services.map((service, index) => (
                    <Tilt key={index} options={defaultOptions} className="tilt-card">
                        <motion.div
                            className="service-card shadow-lg d-flex flex-column align-items-center justify-content-center"
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            style={{
                                width: '22rem',
                                height: '18rem',
                                borderRadius: '20px',
                                padding: '30px',
                                background: hovered === index ? 'linear-gradient(135deg, #6D28D9, #9333EA)' : 'linear-gradient(135deg, #1E293B, #334155)',
                                transform: hovered === index ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: hovered === index ? '0px 10px 30px rgba(147, 51, 234, 0.5)' : '0px 5px 15px rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                cursor: 'pointer'
                            }}
                        >
                            <motion.div animate={{ scale: hovered === index ? 1.2 : 1 }}>
                                <div className="text-white mb-3">{service.icon}</div>
                            </motion.div>
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold" style={{ color: '#FFFFFF', textShadow: '0px 2px 5px rgba(255, 255, 255, 0.3)' }}>{service.title}</h5>
                                <p className="card-text" style={{ color: '#E5E7EB' }}>{service.description}</p>
                            </div>
                        </motion.div>
                    </Tilt>
                ))}
            </div>
        </div>
    );
}
