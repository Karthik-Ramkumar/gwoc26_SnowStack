import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const quotes = [
    { text: "The journey itself is my home.", author: "Matsuo Basho" },
    { text: "Real poetry, is to lead a beautiful life. To live poetry is better than to write it.", author: "Matsuo Basho" },
    { text: "Every day is a journey, and the journey itself is home.", author: "Matsuo Bashô" },
    { text: "Between our two lives\nthere is also the life of\nthe cherry blossom.", author: "Matsuo Basho" }
];

const LoadingScreen = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        // Pick a random start index
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuoteIndex(randomIndex);

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                // Pick a random NEXT index that is different from current
                setCurrentQuoteIndex(prev => {
                    let next;
                    do {
                        next = Math.floor(Math.random() * quotes.length);
                    } while (next === prev && quotes.length > 1);
                    return next;
                });
                setFade(true);
            }, 500); // 0.5s fade out
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen">
            <div className="japanese-vertical left">松尾</div>
            <div className="japanese-vertical right">芭蕉</div>
            <div className="loading-content">
                <img
                    src="/images/gallery/brownlogo.png"
                    alt="Basho Logo"
                    className="loading-logo"
                />
                <div className={`loading-quote-container ${fade ? 'fade-in' : 'fade-out'}`}>
                    <p className="loading-quote-text">
                        {quotes[currentQuoteIndex].text.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                {i < quotes[currentQuoteIndex].text.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                    <p className="loading-quote-author">― {quotes[currentQuoteIndex].author}</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
