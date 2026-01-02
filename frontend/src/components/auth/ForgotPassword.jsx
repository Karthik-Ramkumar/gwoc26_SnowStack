import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setLoading(true);
            await resetPassword(email);
            setSuccess('Password reset email sent! Please check your inbox.');
            setEmail('');
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-card-header">
                    <img
                        src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
                        alt="Basho Logo"
                        className="auth-logo"
                    />
                    <h2 className="auth-title">Reset Password</h2>
                    <p className="auth-subtitle">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {error && <div className="auth-message error">{error}</div>}
                {success && <div className="auth-message success">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button auth-button-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                Sending Reset Link
                                <span className="spinner"></span>
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
                    Remember your password?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
