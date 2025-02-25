import { motion } from 'framer-motion';

export default function Intro() {
    return (
        <div className="text-center py-5" style={{ backgroundColor: '#F9FAFB' }}>
            <h2 className="display-5 fw-bold">Experience the Future of Smart Comment Management</h2>
            <p className="lead mb-4">Discover how our AI-driven tools can enhance your social media interactions, making engagement seamless and insightful.</p>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="d-flex justify-content-center"
            >
                <video width="80%" controls autoPlay loop muted className="rounded shadow-lg">
                    <source src="/videos/service-intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>
        </div>
    );
}
