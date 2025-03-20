import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import { motion, AnimatePresence } from "framer-motion";

const TestLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [placeholderText, setPlaceholderText] = useState("Enter your username");
    const navigate = useNavigate();

    useEffect(() => {
        const placeholders = ["Enter your username", "Type here...", "Start typing..."];
        let index = 0;
        const interval = setInterval(() => {
            setPlaceholderText(placeholders[index]);
            index = (index + 1) % placeholders.length;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ username: "", password: "", confirmPassword: "" });
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.username || !formData.password) {
            setError("All fields are required!");
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            if (isLogin) {
                const res = await axios.post("https://flask-app-570571842976.us-central1.run.app/auth/login", {
                    user_name: formData.username,
                    password: formData.password,
                });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user_id", res.data.user_id);
                navigate("/videos");
            } else {
                await axios.post("https://flask-app-570571842976.us-central1.run.app/auth/register", {
                    user_name: formData.username,
                    password: formData.password,
                    isCreator: true,
                });
                navigate("/");
            }
        } catch (error) {
            // console.log(error);
            setError(error.response?.data?.error || (isLogin ? "Login Failed" : "Signup Failed"));
        }
    };

    return (
        <div className="custom-container" style={{ backgroundColor: 'rgb(249, 250, 251)' }}>
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="custom-alert"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="custom-form-wrapper">
                <div className="custom-form-box">
                    <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="custom-form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="custom-input"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={placeholderText}
                                required
                            />
                        </div>
                        <div className="custom-form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="custom-input"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <div className="custom-form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="custom-input"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <button type="submit" className="custom-button">
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>
                    <p className="custom-toggle-text" onClick={toggleForm}>
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestLogin;
