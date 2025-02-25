import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import banner from './images/slider-img.png';
import Services from './Services';
import Intro from './Intro';
import Footer from './Footer';

export default function Banner() {
    const userId = localStorage.getItem('user_id');
    const redirectPath = userId ? '/videos' : '/login';

    return (
        <>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center text-dark py-5" style={{ minHeight: '50vh', backgroundColor: '#A1E3F9' }}>
                <motion.div
                    initial={{ opacity: 0, x: -70 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="w-75 w-md-35 text-center"
                >
                    <img src={banner} className="img-fluid rounded" style={{ maxWidth: '70%' }} alt="Technology Banner" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="w-100 w-md-50 text-center px-4 mt-4 mt-md-0"
                >
                    <h1 className="display-6 fw-bold">Revolutionizing Your Digital Experience</h1>
                    <p className="lead mt-3">An innovative software solution designed to streamline your workflow and boost productivity.</p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <Link to={redirectPath}>
                            <Button variant="primary" size="lg" className="mt-4 px-5 py-3">Get Started</Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
            <Services></Services>
            <Intro></Intro>
            <Footer></Footer>
        </>
    );
}