import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyDeQwjklidMRCb9dubHg52mbJGG_KxQfYk"; // Replace with your actual API Key

const Assistant = ({ video_id }) => {
    const [summary, setSummary] = useState("Fetching summary...");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, [video_id]);

    // Fetch summary from database
    const fetchSummary = async () => {
        try {
            const response = await axios.get(`https://flask-app-993257609003.us-central1.run.app/ml/getsummary/${video_id}`);
            setSummary(response.data?.summary || "No summary available.");
        } catch (error) {
            // console.error("Error fetching summary:", error);
            setSummary("Failed to fetch summary.");
        }
    };

    // Ask question to Gemini
    const askQuestion = async () => {
        if (!question.trim()) return alert("Please enter a question.");
        setLoading(true);
        setAnswer("");

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
                {
                    contents: [
                        {
                            parts: [{ text: `Based on this summary: ${summary}, answer the question: ${question}` }]
                        }
                    ]
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            // console.log("🔹 Gemini API Response:", response.data);

            if (
                response.data?.candidates &&
                response.data.candidates.length > 0 &&
                response.data.candidates[0].content?.parts &&
                response.data.candidates[0].content.parts.length > 0
            ) {
                setAnswer(response.data.candidates[0].content.parts[0].text);
            } else {
                setAnswer("No valid answer received.");
            }
        } catch (error) {
            // console.error("🚨 Error generating answer:", error);
            setAnswer("Error fetching answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 p-4 bg-dark text-white rounded shadow-lg" style={{ maxWidth: "600px" }}>
            <h2 className="text-center text-white mb-3">Ask Assistant</h2>
            {/* <div className="card bg-secondary text-white mb-3">
                <div className="card-body">
                    <h5 className="card-title">Video Summary</h5>
                    <p className="card-text">{summary}</p>
                </div>
            </div> */}

            <div className="mt-3">
                <label className="form-label">Ask a Question:</label>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Type your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{
                        background: "transparent",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.5)",
                        placeholderColor: "rgba(255,255,255,0.5)"
                    }}
                />
                <button
                    className="btn w-100"
                    onClick={askQuestion}
                    disabled={loading}
                    style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        color: "white"
                    }}
                >
                    {loading ? "Thinking..." : "Ask"}
                </button>
            </div>

            {answer && (
                <div className="mt-4">
                    <h4 className="text-center">Answer</h4>
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <p className="card-text">{answer}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assistant;
