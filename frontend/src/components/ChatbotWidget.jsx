import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chatFlows from './chatFlows';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentState, setCurrentState] = useState('HOME');
    const [messageHistory, setMessageHistory] = useState([
        { type: 'bot', state: 'HOME', text: chatFlows.HOME.message }
    ]);

    // Order tracking form state
    const [orderNumber, setOrderNumber] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleButtonClick = (button) => {
        // Add user's choice to history
        setMessageHistory(prev => [
            ...prev,
            { type: 'user', text: button.label }
        ]);

        // Handle different action types
        if (button.action === 'NAVIGATE') {
            navigate(button.route);
            setTimeout(() => {
                setMessageHistory(prev => [
                    ...prev,
                    { type: 'bot', text: `Taking you to ${button.route}...` }
                ]);
            }, 300);
            setTimeout(() => setIsOpen(false), 800);
            return;
        }

        if (button.action === 'EMAIL') {
            window.open(`mailto:${button.email}`, '_self');
            setMessageHistory(prev => [
                ...prev,
                { type: 'bot', text: `Opening email to ${button.email}...` }
            ]);
            return;
        }

        if (button.action === 'LINK') {
            window.open(button.url, '_blank');
            setMessageHistory(prev => [
                ...prev,
                { type: 'bot', text: 'Opening link in new tab...' }
            ]);
            return;
        }

        if (button.action === 'INFO') {
            setMessageHistory(prev => [
                ...prev,
                { type: 'bot', text: button.text }
            ]);
            return;
        }

        // Default: Navigate to next chat state
        if (button.next && chatFlows[button.next]) {
            const nextFlow = chatFlows[button.next];
            setCurrentState(button.next);

            setTimeout(() => {
                setMessageHistory(prev => [
                    ...prev,
                    { type: 'bot', state: button.next, text: nextFlow.message }
                ]);
            }, 400);
        }
    };

    const handleReset = () => {
        setCurrentState('HOME');
        setMessageHistory([
            { type: 'bot', state: 'HOME', text: chatFlows.HOME.message }
        ]);
        setOrderNumber('');
        setOrderEmail('');
    };

    // Handle order tracking form submission
    const handleOrderTrackingSubmit = async (e) => {
        e.preventDefault();

        if (!orderNumber.trim() || !orderEmail.trim()) {
            setMessageHistory(prev => [
                ...prev,
                { type: 'bot', text: 'Please enter both your order number and email address.' }
            ]);
            return;
        }

        // Add user message
        setMessageHistory(prev => [
            ...prev,
            { type: 'user', text: `Order: ${orderNumber}\nEmail: ${orderEmail}` }
        ]);

        setIsLoading(true);

        try {
            const response = await fetch('/api/products/track-order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_number: orderNumber.trim(),
                    email: orderEmail.trim()
                })
            });

            const data = await response.json();

            if (data.found) {
                // Build status message
                let statusMessage = `Order Found!\n\nOrder Number: ${data.order_number}\nStatus: ${data.status_display}\nTotal: Rs. ${data.total_amount.toLocaleString()}`;

                if (data.tracking_number) {
                    statusMessage += `\n\nTracking Number: ${data.tracking_number}`;
                    if (data.courier_service) {
                        statusMessage += `\nCourier: ${data.courier_service}`;
                    }
                }

                if (data.delivered_at) {
                    const deliveredDate = new Date(data.delivered_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                    statusMessage += `\n\nDelivered on: ${deliveredDate}`;
                }

                setMessageHistory(prev => [
                    ...prev,
                    { type: 'bot', text: statusMessage }
                ]);

                // Go back to tracking menu
                setCurrentState('ORDER_TRACKING');
            } else {
                setMessageHistory(prev => [
                    ...prev,
                    { type: 'bot', text: data.error || 'Order not found. Please check your order number and email.' }
                ]);
            }
        } catch (error) {
            setMessageHistory(prev => [
                ...prev,
                { type: 'bot', text: 'Sorry, we could not look up your order at this time. Please try again later or contact support.' }
            ]);
        } finally {
            setIsLoading(false);
            setOrderNumber('');
            setOrderEmail('');
        }
    };

    const currentFlow = chatFlows[currentState];
    const isInputMode = currentFlow?.inputMode === 'order_tracking';

    return (
        <div className="chatbot-widget">
            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <span>B</span>
                        </div>
                        <div className="chatbot-header-text">
                            <h4>Basho Assistant</h4>
                            <span className="chatbot-status">Online</span>
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        <button
                            className="chatbot-reset-btn"
                            onClick={handleReset}
                            aria-label="Reset chat"
                            title="Start over"
                        >
                            ↺
                        </button>
                        <button
                            className="chatbot-close-btn"
                            onClick={toggleChat}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Message Body */}
                <div className="chatbot-body">
                    {messageHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`chatbot-message ${message.type}`}
                        >
                            <div className="chatbot-message-bubble">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}

                    {/* Order Tracking Input Form */}
                    {isInputMode && (
                        <form className="chatbot-tracking-form" onSubmit={handleOrderTrackingSubmit}>
                            <input
                                type="text"
                                placeholder="Order Number (e.g., ORD-20250115...)"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="chatbot-tracking-input"
                                disabled={isLoading}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={orderEmail}
                                onChange={(e) => setOrderEmail(e.target.value)}
                                className="chatbot-tracking-input"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="chatbot-tracking-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Looking up...' : 'Track Order'}
                            </button>
                        </form>
                    )}

                    {/* Action Buttons */}
                    {currentFlow && currentFlow.buttons && !isLoading && (
                        <div className="chatbot-buttons">
                            {currentFlow.buttons.map((button, index) => (
                                <button
                                    key={index}
                                    className="chatbot-action-btn"
                                    onClick={() => handleButtonClick(button)}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Footer */}
                <div className="chatbot-footer-info">
                    <span>{isInputMode ? 'Enter your details above' : 'Tap a button to continue'}</span>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;
