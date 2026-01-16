import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import chatFlows from './chatFlows';
import './ChatbotWidget.css';

// Constants
const STORAGE_KEY = 'basho_chatbot_history';
const STORAGE_STATE_KEY = 'basho_chatbot_state';

// Helper: Get time-based greeting
const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    if (hour < 21) return 'Good evening!';
    return 'Hello!';
};

// Helper: Get initial message with greeting
const getInitialMessage = () => {
    const greeting = getTimeBasedGreeting();
    return `${greeting} Welcome to Basho Pottery.\n\n${chatFlows.HOME.message}`;
};

// Helper function: Get helpful next steps based on order status
const getStatusNextSteps = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return '\n\nNext Steps:\n• Your order is being reviewed\n• You\'ll receive a confirmation email shortly\n• Processing typically takes 1-2 business days';
        case 'confirmed':
        case 'processing':
            return '\n\nNext Steps:\n• Your order is being prepared\n• Our artisans are crafting your piece\n• Estimated dispatch: 3-5 business days';
        case 'shipped':
            return '\n\nNext Steps:\n• Your order is on the way!\n• Track using the tracking number above\n• Estimated delivery: 3-7 business days';
        case 'delivered':
            return '\n\nThank you for your order!\n• Enjoy your handcrafted piece\n• Share your experience on Instagram @basho.pottery';
        case 'cancelled':
            return '\n\nThis order was cancelled.\n• Refund processed within 5-7 business days\n• Contact us if you have questions';
        default:
            return '';
    }
};

// Helper function: Get next steps for Custom Orders (CO-)
const getCustomOrderNextSteps = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return '\n\nNext Steps:\n• Our team is reviewing your request\n• We\'ll contact you within 2-3 business days\n• Please ensure your phone is reachable';
        case 'contacted':
            return '\n\nNext Steps:\n• We\'ve reached out to discuss your project\n• Check your email and phone for our message\n• Ready to finalize the details!';
        case 'in_progress':
            return '\n\nNext Steps:\n• Your custom piece is being crafted\n• Our artisans are working on your vision\n• We\'ll update you on progress';
        case 'completed':
            return '\n\nYour custom order is complete!\n• Ready for pickup or delivery\n• Thank you for choosing Basho';
        case 'cancelled':
            return '\n\nThis request was cancelled.\n• Contact us if you\'d like to start a new project';
        default:
            return '';
    }
};

// Typing Indicator Component
const TypingIndicator = () => (
    <div className="chatbot-message bot">
        <div className="chatbot-bot-avatar">
            <span>🏺</span>
        </div>
        <div className="chatbot-message-bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
);

const ChatbotWidget = () => {
    // Load from localStorage or use defaults
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentState, setCurrentState] = useState(() => {
        const saved = localStorage.getItem(STORAGE_STATE_KEY);
        return saved || 'HOME';
    });
    const [messageHistory, setMessageHistory] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [{ type: 'bot', state: 'HOME', text: getInitialMessage() }];
            }
        }
        return [{ type: 'bot', state: 'HOME', text: getInitialMessage() }];
    });

    // Order tracking form state
    const [orderNumber, setOrderNumber] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Razorpay modal detection
    const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const chatBodyRef = useRef(null);

    // Persist chat history to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
    }, [messageHistory]);

    // Persist current state
    useEffect(() => {
        localStorage.setItem(STORAGE_STATE_KEY, currentState);
    }, [currentState]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory, isTyping]);

    // Detect Razorpay modal open/close
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const razorpayFrame = document.querySelector('.razorpay-container, .razorpay-checkout-frame, iframe[src*="razorpay"]');
            const razorpayBackdrop = document.querySelector('.razorpay-backdrop');

            if (razorpayFrame || razorpayBackdrop) {
                setIsRazorpayOpen(true);
                setIsOpen(false);
            } else {
                setIsRazorpayOpen(false);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        return () => observer.disconnect();
    }, []);

    // Helper to add bot message with typing delay
    const addBotMessage = useCallback((text, state = null) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessageHistory(prev => [...prev, { type: 'bot', state, text }]);
            setIsTyping(false);
        }, 800 + Math.random() * 400); // 800-1200ms delay
    }, []);

    const toggleChat = () => {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleMinimize = () => {
        setIsMinimized(true);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleButtonClick = (button) => {
        // Add user's choice to history
        setMessageHistory(prev => [...prev, { type: 'user', text: button.label }]);

        // Handle different action types
        if (button.action === 'NAVIGATE') {
            navigate(button.route);
            addBotMessage(`Taking you to ${button.route}...`);
            setTimeout(() => setIsOpen(false), 1200);
            return;
        }

        if (button.action === 'EMAIL') {
            window.open(`mailto:${button.email}`, '_self');
            addBotMessage(`Opening email to ${button.email}...`);
            return;
        }

        if (button.action === 'LINK') {
            window.open(button.url, '_blank');
            addBotMessage('Opening link in new tab...');
            return;
        }

        if (button.action === 'INFO') {
            addBotMessage(button.text);
            return;
        }

        // Default: Navigate to next chat state
        if (button.next && chatFlows[button.next]) {
            const nextFlow = chatFlows[button.next];
            setCurrentState(button.next);
            addBotMessage(nextFlow.message, button.next);
        }
    };

    const handleReset = () => {
        setCurrentState('HOME');
        setMessageHistory([{ type: 'bot', state: 'HOME', text: getInitialMessage() }]);
        setOrderNumber('');
        setOrderEmail('');
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_STATE_KEY);
    };

    // Handle order tracking form submission
    const handleOrderTrackingSubmit = async (e) => {
        e.preventDefault();

        if (!orderNumber.trim() || !orderEmail.trim()) {
            addBotMessage('Please enter both your order number and email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(orderEmail.trim())) {
            addBotMessage('Please enter a valid email address (e.g., name@example.com).');
            return;
        }

        setMessageHistory(prev => [...prev, { type: 'user', text: `Order: ${orderNumber}\nEmail: ${orderEmail}` }]);
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await fetch('/api/products/track-order/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_number: orderNumber.trim(), email: orderEmail.trim() })
            });

            const data = await response.json();
            setIsTyping(false);

            if (data.found) {
                let statusMessage;

                if (data.order_type === 'custom') {
                    statusMessage = `Custom Order Found!\n\nOrder Number: ${data.order_number}\nProject Type: ${data.project_type}\nStatus: ${data.status_display}`;
                    if (data.budget) statusMessage += `\nBudget: ${data.budget}`;
                    statusMessage += getCustomOrderNextSteps(data.status);
                } else {
                    statusMessage = `Order Found!\n\nOrder Number: ${data.order_number}\nStatus: ${data.status_display}\nTotal: Rs. ${data.total_amount?.toLocaleString() || 'N/A'}`;
                    if (data.tracking_number) {
                        statusMessage += `\n\nTracking Number: ${data.tracking_number}`;
                        if (data.courier_service) statusMessage += `\nCourier: ${data.courier_service}`;
                    }
                    if (data.delivered_at) {
                        const deliveredDate = new Date(data.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                        statusMessage += `\n\nDelivered on: ${deliveredDate}`;
                    }
                    statusMessage += getStatusNextSteps(data.status);
                }

                setMessageHistory(prev => [...prev, { type: 'bot', text: statusMessage }]);
                setCurrentState('ORDER_TRACKING');
            } else {
                setMessageHistory(prev => [...prev, { type: 'bot', text: data.error || 'Order not found. Please check your order number and email.' }]);
            }
        } catch (error) {
            setIsTyping(false);
            setMessageHistory(prev => [...prev, { type: 'bot', text: 'Sorry, we could not look up your order at this time. Please try again later or contact support.' }]);
        } finally {
            setIsLoading(false);
            setOrderNumber('');
            setOrderEmail('');
        }
    };

    const currentFlow = chatFlows[currentState];
    const isInputMode = currentFlow?.inputMode === 'order_tracking';
    const lastMessage = messageHistory[messageHistory.length - 1];

    // Get window classes
    const windowClasses = [
        'chatbot-window',
        isOpen ? 'open' : '',
        isMinimized ? 'minimized' : '',
        isFullscreen ? 'fullscreen' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className="chatbot-widget">
            {/* Chat Window */}
            <div className={windowClasses}>
                {/* Header - Floating/Sticky */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info" onClick={isMinimized ? toggleChat : undefined}>
                        <div className="chatbot-avatar">
                            <span>🏺</span>
                        </div>
                        <div className="chatbot-header-text">
                            <h4>Basho Assistant</h4>
                            <span className="chatbot-status">
                                {isMinimized ? (lastMessage?.text?.substring(0, 30) + '...') : 'Online'}
                            </span>
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        {/* Fullscreen toggle - desktop only */}
                        <button
                            className="chatbot-header-btn chatbot-fullscreen-btn"
                            onClick={handleFullscreen}
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        >
                            {isFullscreen ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                </svg>
                            )}
                        </button>
                        {/* Minimize button */}
                        <button
                            className="chatbot-header-btn chatbot-minimize-btn"
                            onClick={handleMinimize}
                            aria-label="Minimize chat"
                            title="Minimize"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14" />
                            </svg>
                        </button>
                        {/* Reset button */}
                        <button
                            className="chatbot-header-btn chatbot-reset-btn"
                            onClick={handleReset}
                            aria-label="Reset chat"
                            title="Start over"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                        {/* Close button */}
                        <button
                            className="chatbot-header-btn chatbot-close-btn"
                            onClick={toggleChat}
                            aria-label="Close chat"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Message Body */}
                {!isMinimized && (
                    <>
                        <div className="chatbot-body" ref={chatBodyRef}>
                            {messageHistory.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chatbot-message ${message.type} message-animate`}
                                >
                                    {message.type === 'bot' && (
                                        <div className="chatbot-bot-avatar">
                                            <span>🏺</span>
                                        </div>
                                    )}
                                    <div className="chatbot-message-bubble">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && <TypingIndicator />}

                            {/* Order Tracking Input Form */}
                            {isInputMode && !isTyping && (
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
                                    <button type="submit" className="chatbot-tracking-submit" disabled={isLoading}>
                                        {isLoading ? 'Looking up...' : 'Track Order'}
                                    </button>
                                </form>
                            )}

                            {/* Action Buttons */}
                            {currentFlow && currentFlow.buttons && !isLoading && !isTyping && (
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
                    </>
                )}
            </div>

            {/* Toggle Button - Hidden when Razorpay modal is open */}
            {!isRazorpayOpen && (
                <button
                    className={`chatbot-toggle-btn ${isOpen ? 'active' : ''} ${isMinimized ? 'has-preview' : ''}`}
                    onClick={toggleChat}
                    aria-label={isOpen ? 'Close chat' : 'Open chat'}
                >
                    {isOpen || isMinimized ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};

export default ChatbotWidget;
