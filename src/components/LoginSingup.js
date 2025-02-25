import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function LoginSignup() {
    const [activeTab, setActiveTab] = useState("login");
    const [user_name, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/auth/login", { user_name, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_id", res.data.user_id);
            console.log(res)
            navigate("/videos");
        } catch (error) {
            alert("Login Failed");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const isCreator = true
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await axios.post("http://localhost:5000/auth/register", { user_name, password, isCreator});
            navigate("/");
        } catch (error) {
            alert("Signup Failed");
        }
    };

    return (
        <div className="container mt-5" style={{background:'transparent'}}>
            <div className="border p-4 rounded shadow-sm bg-light col-md-5 mx-auto">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                            onClick={() => setActiveTab("register")}
                        >
                            Register
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    {activeTab === "login" && (
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label>Email</label>
                                <input
                                  
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>

                        </form>
                    )}
                    {activeTab === "register" && (
                        <form onSubmit={handleSignup}>
                           
                            <div className="form-group mb-3">
                                <label>Uername</label>
                                <input
                                  
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Sign up</button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginSignup;