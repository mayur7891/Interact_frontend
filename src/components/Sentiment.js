import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useParams } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = () => {
    const [sentimentCounts, setSentimentCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { video_id } = useParams();

    const sentimentLabels = ["Positive", "Negative", "Neutral"];
    const sentimentColors = ["rgba(100, 255, 0, 0.7)", "rgba(255, 0, 0, 0.7)", "rgba(200, 50, 255, 0.7)"];

    // Fetch sentiment data when component mounts
    useEffect(() => {
        const fetchSentimentData = async () => {
            try {
                const response = await fetch(`https://flask-app-993257609003.asia-south1.run.app/ml/sentiment/${video_id}`);
                if (!response.ok) throw new Error("No sentiment data found");

                const data = await response.json();
                setSentimentCounts([data.positive || 0, data.negative || 0, data.neutral || 0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSentimentData();
    }, [video_id]);

    // Handle loading state
    if (loading) {
        return (
            <div className="text-center mt-5">
                <h2 className="fw-bold text-primary">Loading Sentiment Data...</h2>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    // Handle error state
    if (error || !sentimentCounts) {
        return (
            <div className="text-center mt-5">
                <h2 className="fw-bold text-danger">No Sentiment Data Available</h2>
                <p className="text-muted">{error || "Try analyzing some comments to generate insights."}</p>
                <i className="bi bi-emoji-frown display-3 text-secondary"></i>
            </div>
        );
    }

    const total = sentimentCounts.reduce((acc, val) => acc + val, 0);
    const sentimentPercentages = total
        ? sentimentCounts.map((count) => ((count / total) * 100).toFixed(1))
        : [0, 0, 0];

    const data = {
        labels: sentimentLabels,
        datasets: [
            {
                data: sentimentPercentages,
                backgroundColor: sentimentColors,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Sentiment Analysis" },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw}%`, // Show percentage in tooltip
                },
            },
        },
    };

    return (
        <div className="container d-flex flex-column align-items-center p-4">
            <div className="card shadow-lg p-3 text-center" style={{ width: "400px" }}>
                <h5 className="card-title fw-bold">Sentiment Chart</h5>
                <div className="chart-container mx-auto" style={{ height: "320px", width: "320px" }}>
                    <Pie data={data} options={options} style={{position:'relative'}}/>
                </div>
            </div>

            {/* Sentiment Summary Section */}
            <div className="card shadow-lg p-3 mt-3 w-100 text-center">
                <h5 className="card-title fw-bold">Sentiment Analysis Summary</h5>
                <table className="table table-bordered mt-2">
                    <thead className="table-dark text-light">
                        <tr>
                            <th>Sentiment</th>
                            <th>Count</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sentimentLabels.map((label, index) => (
                            <tr key={index}>
                                <td className="fw-semibold" style={{ color: sentimentColors[index] }}>
                                    {label}
                                </td>
                                <td>{sentimentCounts[index]}</td>
                                <td>{sentimentPercentages[index]}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SentimentChart;
