import { motion } from 'framer-motion';
import { FaComments, FaSearch, FaChartLine } from 'react-icons/fa';

export default function Services() {
    const services = [
        { icon: <FaComments size={50} />, title: 'Comment Clustering', description: 'So that you can answer more queries efficiently.' },
        { icon: <FaSearch size={50} />, title: 'Query Matching', description: 'For users who want to find answers in the comment section.' },
        { icon: <FaChartLine size={50} />, title: 'Exclusive Comment Analysis', description: 'Get sentiment details and an overall summary of comments.' }
    ];

    return (
        <div className="text-center py-5" style={{ backgroundColor: '#F9FAFB' }}>
            <h2 className="display-5 fw-bold">Here's What We Offer</h2>
            <p className="lead mb-5">Make your social media interaction a truly valuable experience.</p>
            <div className="d-flex flex-wrap justify-content-center gap-5">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <div className="card shadow-lg p-4 d-flex flex-column align-items-center justify-content-center"
                            style={{
                                width: '20rem',
                                height: '18rem',
                                borderRadius: '15px',
                                background: 'linear-gradient(135deg, #F3F0FF, #E0DBFF)',
                                margin: '15px',
                                transition: 'transform 0.3s ease-in-out',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div className="text-primary mb-3">{service.icon}</div>
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold">{service.title}</h5>
                                <p className="card-text">{service.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
