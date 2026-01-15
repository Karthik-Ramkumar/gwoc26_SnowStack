/**
 * Basho Chatbot - Conversation Flow Configuration
 * 
 * Button-based navigation chatbot with predefined states.
 * No AI, no API calls - just static flow navigation.
 */

const chatFlows = {
    // ===================================
    // HOME - Initial Entry Point
    // ===================================
    HOME: {
        id: 'HOME',
        message: "Namaste! Welcome to Basho — where clay meets soul.\n\nHow can I help you today?",
        buttons: [
            { label: 'Workshops & Experiences', next: 'WORKSHOPS_MENU' },
            { label: 'Products & Orders', next: 'PRODUCTS_MENU' },
            { label: 'Payments & Refunds', next: 'PAYMENTS_MENU' },
            { label: 'Track My Order', next: 'ORDER_TRACKING' },
            { label: 'Studio & Visit Info', next: 'STUDIO_MENU' },
        ],
    },

    // ===================================
    // WORKSHOPS & EXPERIENCES
    // ===================================
    WORKSHOPS_MENU: {
        id: 'WORKSHOPS_MENU',
        message: "Our workshops are thoughtfully designed for all skill levels.\n\nWhat would you like to know?",
        buttons: [
            { label: 'View Available Workshops', next: 'WORKSHOPS_LIST' },
            { label: 'Workshop Types Explained', next: 'WORKSHOPS_TYPES' },
            { label: 'How to Register', next: 'WORKSHOPS_REGISTER' },
            { label: 'Cancellation Policy', next: 'WORKSHOPS_CANCEL' },
            { label: 'Back to Main Menu', next: 'HOME' },
        ],
    },

    WORKSHOPS_LIST: {
        id: 'WORKSHOPS_LIST',
        message: "We offer the following workshops:\n\n• Wheel Throwing\n• Hand Building\n• Glazing\n\nEach session is 2-3 hours of mindful making.\n\nWould you like to browse our upcoming sessions?",
        buttons: [
            { label: 'Browse Workshops', action: 'NAVIGATE', route: '/workshops' },
            { label: 'Tell Me More', next: 'WORKSHOPS_TYPES' },
            { label: 'Back', next: 'WORKSHOPS_MENU' },
        ],
    },

    WORKSHOPS_TYPES: {
        id: 'WORKSHOPS_TYPES',
        message: "Workshop Types:\n\nWheel Throwing\nLearn to center clay and create vessels on the potter's wheel.\n\nHand Building\nShape clay using pinching, coiling, and slab techniques.\n\nGlazing\nAdd color and finish to bisque-fired pieces.\n\nAll materials are included. No experience needed!",
        buttons: [
            { label: 'See Upcoming Dates', action: 'NAVIGATE', route: '/workshops' },
            { label: 'How to Register', next: 'WORKSHOPS_REGISTER' },
            { label: 'Back', next: 'WORKSHOPS_MENU' },
        ],
    },

    WORKSHOPS_REGISTER: {
        id: 'WORKSHOPS_REGISTER',
        message: "How to Register:\n\n1. Visit our Workshops page\n2. Choose your preferred workshop and date\n3. Fill in your details\n4. Complete payment via Razorpay\n\nYou'll receive a confirmation email instantly!",
        buttons: [
            { label: 'Register Now', action: 'NAVIGATE', route: '/workshops' },
            { label: 'Cancellation Policy', next: 'WORKSHOPS_CANCEL' },
            { label: 'Back', next: 'WORKSHOPS_MENU' },
        ],
    },

    WORKSHOPS_CANCEL: {
        id: 'WORKSHOPS_CANCEL',
        message: "Cancellation Policy:\n\n• 48+ hours notice: Full refund\n• 24-48 hours: 50% refund\n• Less than 24 hours: No refund\n\nRescheduling is available subject to slot availability.\n\nContact us at hello@basho.in for assistance.",
        buttons: [
            { label: 'Contact Support', action: 'EMAIL', email: 'hello@basho.in' },
            { label: 'Back', next: 'WORKSHOPS_MENU' },
        ],
    },

    // ===================================
    // PRODUCTS & ORDERS
    // ===================================
    PRODUCTS_MENU: {
        id: 'PRODUCTS_MENU',
        message: "Each piece at Basho is handcrafted with care.\n\nHow can I assist you?",
        buttons: [
            { label: 'Browse Collections', next: 'PRODUCTS_BROWSE' },
            { label: 'Custom Orders', next: 'PRODUCTS_CUSTOM' },
            { label: 'Shipping Information', next: 'PRODUCTS_SHIPPING' },
            { label: 'Product Care Guide', next: 'PRODUCTS_CARE' },
            { label: 'Back to Main Menu', next: 'HOME' },
        ],
    },

    PRODUCTS_BROWSE: {
        id: 'PRODUCTS_BROWSE',
        message: "Explore our handcrafted ceramic collections — from everyday tableware to statement art pieces.\n\nEach item is made with love in our Surat studio.",
        buttons: [
            { label: 'Shop Now', action: 'NAVIGATE', route: '/products' },
            { label: 'Custom Orders', next: 'PRODUCTS_CUSTOM' },
            { label: 'Back', next: 'PRODUCTS_MENU' },
        ],
    },

    PRODUCTS_CUSTOM: {
        id: 'PRODUCTS_CUSTOM',
        message: "We love bringing your vision to life!\n\nCustom orders are perfect for:\n• Corporate gifts\n• Wedding favors\n• Personalized home decor\n• Restaurant tableware\n\nMinimum order quantities may apply.",
        buttons: [
            { label: 'Request Custom Order', action: 'NAVIGATE', route: '/corporate' },
            { label: 'View Corporate Gifts', action: 'NAVIGATE', route: '/corporate' },
            { label: 'Back', next: 'PRODUCTS_MENU' },
        ],
    },

    PRODUCTS_SHIPPING: {
        id: 'PRODUCTS_SHIPPING',
        message: "Shipping Details:\n\n• Pan-India delivery: 5-7 business days\n• Free shipping on orders above Rs. 5,000\n• Secure ceramic-safe packaging\n• Tracking provided via email\n\nShipping calculated at checkout based on weight.",
        buttons: [
            { label: 'Track My Order', next: 'ORDER_TRACKING' },
            { label: 'Shop Products', action: 'NAVIGATE', route: '/products' },
            { label: 'Back', next: 'PRODUCTS_MENU' },
        ],
    },

    PRODUCTS_CARE: {
        id: 'PRODUCTS_CARE',
        message: "Caring for Your Ceramics:\n\n• Hand wash recommended\n• Microwave and dishwasher safe (unless stated otherwise)\n• Avoid sudden temperature changes\n• Handle with love — each piece is unique!\n\nSmall variations are part of the handmade charm.",
        buttons: [
            { label: 'Shop Products', action: 'NAVIGATE', route: '/products' },
            { label: 'Back', next: 'PRODUCTS_MENU' },
        ],
    },

    // ===================================
    // PAYMENTS & REFUNDS
    // ===================================
    PAYMENTS_MENU: {
        id: 'PAYMENTS_MENU',
        message: "We use Razorpay for secure payments.\n\nWhat do you need help with?",
        buttons: [
            { label: 'Payment Methods', next: 'PAYMENTS_METHODS' },
            { label: 'Payment Failed?', next: 'PAYMENTS_FAILED' },
            { label: 'Refund Policy', next: 'PAYMENTS_REFUND' },
            { label: 'Request a Refund', next: 'PAYMENTS_REQUEST' },
            { label: 'Back to Main Menu', next: 'HOME' },
        ],
    },

    PAYMENTS_METHODS: {
        id: 'PAYMENTS_METHODS',
        message: "Accepted Payment Methods:\n\n• Credit/Debit Cards (Visa, Mastercard, RuPay)\n• UPI (GPay, PhonePe, Paytm)\n• Net Banking\n• Wallets (Paytm, Mobikwik)\n\nAll transactions are secured by Razorpay.",
        buttons: [
            { label: 'Payment Failed?', next: 'PAYMENTS_FAILED' },
            { label: 'Back', next: 'PAYMENTS_MENU' },
        ],
    },

    PAYMENTS_FAILED: {
        id: 'PAYMENTS_FAILED',
        message: "If your payment failed but money was deducted:\n\n1. Don't worry — failed transactions auto-refund in 5-7 days\n2. Check your email for transaction details\n3. If not refunded after 7 days, contact us with your order ID\n\nWe're here to help!",
        buttons: [
            { label: 'Contact Support', action: 'EMAIL', email: 'hello@basho.in' },
            { label: 'Try Again', action: 'NAVIGATE', route: '/cart' },
            { label: 'Back', next: 'PAYMENTS_MENU' },
        ],
    },

    PAYMENTS_REFUND: {
        id: 'PAYMENTS_REFUND',
        message: "Refund Policy:\n\n• Products: Refund within 7 days if item arrives damaged\n• Workshops: See workshop cancellation policy\n• Refunds processed within 5-7 business days\n\nCustom orders are non-refundable once production begins.",
        buttons: [
            { label: 'Request a Refund', next: 'PAYMENTS_REQUEST' },
            { label: 'Workshop Cancellation', next: 'WORKSHOPS_CANCEL' },
            { label: 'Back', next: 'PAYMENTS_MENU' },
        ],
    },

    PAYMENTS_REQUEST: {
        id: 'PAYMENTS_REQUEST',
        message: "To request a refund, please email us at hello@basho.in with:\n\n• Your order number\n• Reason for refund\n• Photos (if item damaged)\n\nWe'll respond within 24-48 hours.",
        buttons: [
            { label: 'Email Support', action: 'EMAIL', email: 'hello@basho.in' },
            { label: 'Back', next: 'PAYMENTS_MENU' },
        ],
    },

    // ===================================
    // ORDER TRACKING
    // ===================================
    ORDER_TRACKING: {
        id: 'ORDER_TRACKING',
        message: "Track Your Order\n\nI can help you check the status of your order. You'll need your order number and email address.",
        buttons: [
            { label: 'Enter Order Details', next: 'ORDER_TRACKING_INPUT' },
            { label: 'I Dont Have My Order Number', next: 'ORDER_TRACKING_HELP' },
            { label: 'Back to Main Menu', next: 'HOME' },
        ],
    },

    ORDER_TRACKING_INPUT: {
        id: 'ORDER_TRACKING_INPUT',
        message: "Please enter your order details below.",
        inputMode: 'order_tracking',
        buttons: [
            { label: 'Back', next: 'ORDER_TRACKING' },
        ],
    },

    ORDER_TRACKING_HELP: {
        id: 'ORDER_TRACKING_HELP',
        message: "Your order number was sent to your email when you placed the order.\n\nLook for an email from orders@basho.in\n\nIf you still can't find it, please contact us with your name and approximate order date.",
        buttons: [
            { label: 'Contact Support', action: 'EMAIL', email: 'hello@basho.in' },
            { label: 'Try Again', next: 'ORDER_TRACKING_INPUT' },
            { label: 'Back', next: 'ORDER_TRACKING' },
        ],
    },

    // ===================================
    // STUDIO & VISIT INFO
    // ===================================
    STUDIO_MENU: {
        id: 'STUDIO_MENU',
        message: "Our studio is a quiet space for slow craft and shared making.",
        buttons: [
            { label: 'Studio Location', next: 'STUDIO_LOCATION' },
            { label: 'Visiting Hours', next: 'STUDIO_HOURS' },
            { label: 'Upcoming Exhibitions', next: 'STUDIO_EXHIBITIONS' },
            { label: 'Studio Policies', next: 'STUDIO_POLICIES' },
            { label: 'Back to Main Menu', next: 'HOME' },
        ],
    },

    STUDIO_LOCATION: {
        id: 'STUDIO_LOCATION',
        message: "Basho Studio\n\nSilent Zone, Opp. Airport\nR.S. No. 811 Paikee, Plot No. 311\nSurat-Dumas Road\nSurat, Gujarat\n\nVisits by appointment only.",
        buttons: [
            { label: 'Get Directions', action: 'LINK', url: 'https://maps.google.com/maps?q=21.130000,72.724000' },
            { label: 'Book a Visit', next: 'STUDIO_HOURS' },
            { label: 'Back', next: 'STUDIO_MENU' },
        ],
    },

    STUDIO_HOURS: {
        id: 'STUDIO_HOURS',
        message: "Visiting Hours:\n\n• Tuesday to Saturday: 10 AM to 6 PM\n• Sunday and Monday: Closed\n\nVisits are by appointment only. Please email us to schedule.",
        buttons: [
            { label: 'Schedule a Visit', action: 'EMAIL', email: 'hello@basho.in' },
            { label: 'View Studio Page', action: 'NAVIGATE', route: '/studio' },
            { label: 'Back', next: 'STUDIO_MENU' },
        ],
    },

    STUDIO_EXHIBITIONS: {
        id: 'STUDIO_EXHIBITIONS',
        message: "We participate in pop-ups and exhibitions across India.\n\nCheck our Studio page for upcoming events!",
        buttons: [
            { label: 'View Exhibitions', action: 'NAVIGATE', route: '/studio' },
            { label: 'Past Pop-ups', action: 'NAVIGATE', route: '/studio' },
            { label: 'Back', next: 'STUDIO_MENU' },
        ],
    },

    STUDIO_POLICIES: {
        id: 'STUDIO_POLICIES',
        message: "Studio Policies:\n\n• Visits require prior confirmation\n• Handle pieces with care\n• Photography allowed unless specified\n• No refunds on custom orders once production begins\n\nWe appreciate your understanding!",
        buttons: [
            { label: 'Visit Studio Page', action: 'NAVIGATE', route: '/studio' },
            { label: 'Back', next: 'STUDIO_MENU' },
        ],
    },
};

export default chatFlows;
