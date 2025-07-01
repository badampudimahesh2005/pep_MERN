import React from 'react';

const Spinner = () => (
    <div style={styles.container}>
        <div style={styles.spinner}></div>
        <span style={styles.text}>Loading...</span>
    </div>
);

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '10px',
    },
    text: {
        color: '#555',
        fontSize: '16px',
    },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default Spinner;