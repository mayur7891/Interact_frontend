import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { FaPaperPlane } from 'react-icons/fa';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus } from '@react-three/drei';
import { Tilt } from 'react-tilt';
import './About.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Sahil from './images/sahil.jpg';
import Mayur from './images/Mayur.jpeg';
import Ankita from './images/Ankita.jpeg';
import Nikhil from './images/Nikhil.jpeg';

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

function FloatingShapes() {
    const sphereRef = useRef();
    const torusRef = useRef();
    const icosaRef = useRef();

    useFrame(({ clock }) => {
        const time = clock.elapsedTime;
        if (sphereRef.current) {
            sphereRef.current.position.y = Math.sin(time) * 2;
            sphereRef.current.rotation.x = time * 0.5;
        }
        if (torusRef.current) {
            torusRef.current.rotation.y = time * 0.5;
        }
        if (icosaRef.current) {
            icosaRef.current.rotation.x = time * 0.5;
        }
    });

    return (
        <>
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Sphere ref={sphereRef} args={[1, 32, 32]} position={[-5, 0, 0]}>
                <meshStandardMaterial color="#ff0066" metalness={0.6} roughness={0.2} />
            </Sphere>
            <Torus ref={torusRef} args={[1.5, 0.4, 16, 100]} position={[5, 0, 0]}>
                <meshStandardMaterial color="#00ff99" metalness={0.6} />
            </Torus>
            <mesh ref={icosaRef} position={[0, 0, -10]}>
                <icosahedronGeometry args={[1.2, 2]} />
                <meshStandardMaterial color="#0099ff" metalness={0.6} roughness={0.1} />
            </mesh>
        </>
    );
}

function Scene() {
    return (
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 3} />
            <FloatingShapes />
        </Canvas>
    );
}

const About = () => {
    const planeRef = useRef(null);
    const modulesRef = useRef(null);
    const modulesInView = useInView(modulesRef, { once: true, margin: '-100px' });
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        gsap.to(planeRef.current, {
            y: 20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
        });
    }, []);

    const modules = [
        { title: 'Query Matching', description: 'Finds and retrieves the most relevant comments based on meaning.' },
        { title: 'Sentiment Analysis', description: 'Analyzes comments to determine their emotional tone.' },
        { title: 'Comment Clustering', description: 'Groups similar comments together for better insights.' },
    ];

    const team = [
        { name: 'Sahil', avatar: Sahil },
        { name: 'Mayur', avatar: Mayur },
        { name: 'Ankita', avatar: Ankita },
        { name: 'Nikhil', avatar: Nikhil },
    ];

    return (
        <>
            <div style={{ position: 'relative', zIndex: 1000 }}>
                <Navbar />
            </div>
            <div className="about-page" style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', minHeight: '100vh' }}>
                <div className="threejs-scene">
                    <Scene />
                </div>

                <section className="hero">
                    <motion.div className="paper-plane" ref={planeRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <FaPaperPlane size={60} />
                    </motion.div>
                    <motion.div className="hero-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5 }}>
                        <h1>Analyze. Learn. Interact.</h1>
                        <p>Redefining digital interactions</p>
                    </motion.div>
                </section>

                <motion.div className="animated-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <h2 className='text-white'>
                        {'Smart Insights, Seamless Interact.'.split('').map((char, i) => (
                            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                {char}
                            </motion.span>
                        ))}
                    </h2>
                </motion.div>

                <div className="modules" ref={modulesRef}>
                    {modules.map((module, i) => (
                        <Tilt key={i} options={defaultOptions}>
                            <motion.div
                                className={`card ${i % 2 === 0 ? 'left' : 'right'} card-custom`}
                                initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                                animate={modulesInView ? { x: 0, opacity: 1 } : {}}
                                transition={{ delay: i * 0.3, type: 'spring', stiffness: 50 }}
                            >
                                <div className="card-content">
                                    <h3>{module.title}</h3>
                                    <p>{module.description}</p>
                                </div>
                            </motion.div>
                        </Tilt>
                    ))}
                </div>

                <div className="team-section">
                    <h2>Meet the Team</h2>
                    <div className="team-grid">
                        {team.map((member, i) => (
                            <Tilt key={i} options={defaultOptions}>
                                <motion.div className="team-card" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="avatar" style={{ backgroundImage: `url(${member.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                    <h3>{member.name}</h3>
                                </motion.div>
                            </Tilt>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
