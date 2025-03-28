import { motion } from 'framer-motion';

export default function Intro() {
    return (
        <div className="text-center py-5 position-relative" style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', minHeight: '100vh' }}>
            <motion.h2
                className="display-5 fw-bold mb-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{color:'white'}}
            >
                Experience the Future of Smart Comment Management
            </motion.h2>
            <motion.p
                className="lead mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ opacity: 0.9 }}
            >
                Discover how our AI-driven tools can enhance your social media interactions, making engagement seamless and insightful.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="d-flex justify-content-center"
            >
                <div className="rounded p-3" >
                    <video width="80%" controls autoPlay loop muted className="rounded">
                        <source src="/images/BE.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </motion.div>
        </div>
    );
}
