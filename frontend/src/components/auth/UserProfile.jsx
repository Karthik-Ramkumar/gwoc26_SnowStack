import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function UserProfile() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Failed to log out:', err);
        }
    };

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    // Get user's initials for avatar
    const getInitials = (name) => {
        if (!name) return currentUser.email[0].toUpperCase();
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                    ) : (
                        getInitials(currentUser.displayName)
                    )}
                </div>
                <h1 className="profile-name">
                    {currentUser.displayName || 'Basho Member'}
                </h1>
                <p className="profile-email">{currentUser.email}</p>
            </div>

            <div className="profile-section">
                <h3>Account Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <strong style={{ color: '#442D1C' }}>Display Name:</strong>
                        <p style={{ margin: '0.5rem 0 0', color: '#8E5022' }}>
                            {currentUser.displayName || 'Not set'}
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#442D1C' }}>Email:</strong>
                        <p style={{ margin: '0.5rem 0 0', color: '#8E5022' }}>
                            {currentUser.email}
                        </p>
                    </div>
                    <div>
                        <strong style={{ color: '#442D1C' }}>Account Created:</strong>
                        <p style={{ margin: '0.5rem 0 0', color: '#8E5022' }}>
                            {new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <h3>Workshop Registrations</h3>
                <div className="empty-state">
                    <p>You haven't registered for any workshops yet.</p>
                    <button
                        onClick={() => navigate('/workshops')}
                        className="auth-button auth-button-primary"
                    >
                        Explore Workshops
                    </button>
                </div>
            </div>

            <div className="profile-section">
                <h3>Custom Orders</h3>
                <div className="empty-state">
                    <p>You haven't placed any custom orders yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="auth-button auth-button-primary"
                    >
                        Browse Products
                    </button>
                </div>
            </div>

            <div className="profile-section">
                <h3>Account Settings</h3>
                <button
                    onClick={handleLogout}
                    className="auth-button auth-button-primary"
                    style={{ width: 'auto' }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
