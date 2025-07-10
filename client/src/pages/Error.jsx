import React from "react";

const Error = () => {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            color: "#1a202c",
            fontFamily: "Segoe UI, sans-serif"
        }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#fee2e2"/>
                <path d="M12 8v4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#ef4444"/>
            </svg>
            <h1 style={{ fontSize: "2.5rem", margin: "1rem 0 0.5rem" }}>Oops!</h1>
            <p style={{ fontSize: "1.2rem", color: "#64748b", marginBottom: "2rem" }}>
                Something went wrong. The page you are looking for doesn't exist or an error occurred.
            </p>
            <a
                href="/"
                style={{
                    padding: "0.75rem 1.5rem",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontWeight: "500",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.08)"
                }}
            >
                Go Home
            </a>
        </div>
    );
};

export default Error;