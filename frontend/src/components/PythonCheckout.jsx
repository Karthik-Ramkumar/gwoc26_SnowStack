// Python Checkout Redirect
// Use this to redirect from React to Python Django checkout

import React from 'react';

const PythonCheckout = () => {
    const redirectToCheckout = () => {
        // Redirect to Python Django checkout
        window.location.href = '/api/products/checkout/';
    };

    return (
        <div className="python-checkout-redirect">
            <h2>Secure Checkout</h2>
            <p>Click below to proceed to our secure checkout powered by Django + Razorpay</p>
            <button 
                onClick={redirectToCheckout}
                className="btn btn-primary"
                style={{
                    backgroundColor: '#B78B5A',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: 'white',
                    margin: '10px'
                }}
            >
                Proceed to Checkout
            </button>
            
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>✓ Secure payment processing</p>
                <p>✓ Multiple payment options</p>
                <p>✓ Order confirmation via email</p>
            </div>
        </div>
    );
};

export default PythonCheckout;