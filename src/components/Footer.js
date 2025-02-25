import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="text-center py-4" style={{ backgroundColor: '#343a40', color: '#ffffff' }}>
            <div className="mb-3">
                <a href="https://facebook.com" className="mx-2 text-white" target="_blank" rel="noopener noreferrer"><FaFacebook size={24} /></a>
                <a href="https://twitter.com" className="mx-2 text-white" target="_blank" rel="noopener noreferrer"><FaTwitter size={24} /></a>
                <a href="https://instagram.com" className="mx-2 text-white" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} /></a>
                <a href="https://linkedin.com" className="mx-2 text-white" target="_blank" rel="noopener noreferrer"><FaLinkedin size={24} /></a>
            </div>
            <p className="mb-0">&copy; {new Date().getFullYear()} Interact. All rights reserved.</p>
        </footer>
    );
}
