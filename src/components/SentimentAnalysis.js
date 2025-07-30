import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SentimentAnalysis = ({ video_id }) => {
    const [sentiments, setSentiments] = useState({ positive: 0, negative: 0, neutral: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ pos: 0, neg: 0, neu: 0 });

    const getOuterRadius = () => (window.innerWidth < 768 ? 60 : 100);
    const [outerRadius, setOuterRadius] = useState(getOuterRadius());

    useEffect(() => {
        const handleResize = () => setOuterRadius(getOuterRadius());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                const response = await fetch(`https://flask-app-993257609003.us-central1.run.app/ml/sentiment/${video_id}`);
                if (!response.ok) throw new Error("No sentiment data found");

                const data = await response.json();
                const total = data.positive + data.negative + data.neutral;
                setSentiments({
                    positive: data.positive || 0,
                    negative: data.negative || 0,
                    neutral: data.neutral || 0,
                    positivePercent: total ? ((data.positive / total) * 100).toFixed(1) : 0,
                    negativePercent: total ? ((data.negative / total) * 100).toFixed(1) : 0,
                    neutralPercent: total ? ((data.neutral / total) * 100).toFixed(1) : 0,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSentimentData();
    }, [video_id]);

    useEffect(() => {
        if (!loading) {
            let progressInterval = setInterval(() => {
                setProgress((prev) => {
                    const newPos = Math.min(prev.pos + 5, sentiments.positivePercent);
                    const newNeg = Math.min(prev.neg + 5, sentiments.negativePercent);
                    const newNeu = Math.min(prev.neu + 5, sentiments.neutralPercent);

                    if (newPos === sentiments.positivePercent && newNeg === sentiments.negativePercent && newNeu === sentiments.neutralPercent) {
                        clearInterval(progressInterval);
                    }

                    return { pos: newPos, neg: newNeg, neu: newNeu };
                });
            }, 100);

            return () => clearInterval(progressInterval);
        }
    }, [loading, sentiments]);

    if (loading) return (
        <div className="text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return <h3 className="text-center text-danger">Error: {error}</h3>;

    const data = [
        { name: "Positive", value: sentiments.positive, color: "#28a745" },
        { name: "Negative", value: sentiments.negative, color: "#dc3545" },
        { name: "Neutral", value: sentiments.neutral, color: "#ffc107" },
    ];

    return (
        <div className="container-fluid mt-4" style={{ width: "100vw", padding: "20px" }}>
            <h3 className="mb-3 text-white text-center">Sentiment Analysis</h3>
            <div className="row">
                <div className="col-lg-6 col-md-12 d-flex flex-column align-items-center">
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" outerRadius={outerRadius} fill="#8884d8" dataKey="value">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 mt-5">
                    {["Positive", "Negative", "Neutral"].map((sentiment, index) => {
                        const colors = ["bg-success", "bg-danger", "bg-warning"];
                        const progressValues = [progress.pos, progress.neg, progress.neu];

                        return (
                            <div className="mb-3" key={index}>
                                <div className="progress">
                                    <div className={`progress-bar ${colors[index]}`} role="progressbar" style={{ width: `${progressValues[index]}%` }}>
                                        {progressValues[index]}%
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style>{`
                .chart-container {
                    width: 100%;
                    height: 300px;
                }
                @media (max-width: 768px) {
                    .chart-container {
                        height: 200px;
                    }
                }
            `}</style>
        </div>
    );
};

export default SentimentAnalysis;
