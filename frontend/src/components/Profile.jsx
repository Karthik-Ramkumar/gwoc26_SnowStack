import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, ShoppingBag, Package, Clock } from 'lucide-react';
import './Profile.css';

function Profile() {
    const { currentUser, logout } = useAuth();
    const { orders, loading: ordersLoading } = useOrders();
    const navigate = useNavigate();
    const [imageError, setImageError] = React.useState(false);
    const [expandedOrder, setExpandedOrder] = React.useState(null);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    // Format the account creation date
    const createdAt = currentUser.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    const lastSignIn = currentUser.metadata?.lastSignInTime
        ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'N/A';

    // Format order date
    const formatOrderDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'status-delivered';
            case 'shipped':
                return 'status-shipped';
            case 'processing':
                return 'status-processing';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    // Get order status timeline data
    const getOrderTimeline = (currentStatus) => {
        const statuses = [
            { key: 'confirmed', label: 'Confirmed', icon: '✓' },
            { key: 'processing', label: 'Processing', icon: '⚙' },
            { key: 'shipped', label: 'Shipped', icon: '📦' },
            { key: 'delivered', label: 'Delivered', icon: '✓' }
        ];

        const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase());

        return statuses.map((status, index) => ({
            ...status,
            isCompleted: index < currentIndex,
            isActive: statusOrder[currentIndex] === status.key,
            isCancelled: currentStatus?.toLowerCase() === 'cancelled'
        }));
    };

    return (
        <div className="profile-page-new">
            <div className="profile-container-new">
                {/* Profile Card - Vellum Glass */}
                <div className="profile-card-glass">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-new">
                            {currentUser.photoURL && !imageError ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="Profile"
                                    className="avatar-image-new"
                                    referrerPolicy="no-referrer"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="avatar-placeholder-new">
                                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="profile-info-section">
                        <h1 className="profile-name-new">
                            {currentUser.displayName || 'Basho Member'}
                        </h1>
                        <p className="profile-email-new">{currentUser.email}</p>
                        <button onClick={handleLogout} className="logout-btn-new">
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Account Details - Porcelain Card */}
                <div className="section-container">
                    <h2 className="section-title-profile">Account Details</h2>

                    <div className="profile-porcelain-card">
                        <div className="detail-row">
                            <div className="detail-icon-new">
                                <User size={20} />
                            </div>
                            <div className="detail-content-new">
                                <span className="detail-label-new">Display Name</span>
                                <span className="detail-value-new">{currentUser.displayName || 'Not set'}</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon-new">
                                <Mail size={20} />
                            </div>
                            <div className="detail-content-new">
                                <span className="detail-label-new">Email Address</span>
                                <span className="detail-value-new">{currentUser.email}</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-icon-new">
                                <Calendar size={20} />
                            </div>
                            <div className="detail-content-new">
                                <span className="detail-label-new">Member Since</span>
                                <span className="detail-value-new">{createdAt}</span>
                            </div>
                        </div>

                        <div className="detail-row last">
                            <div className="detail-icon-new">
                                <Clock size={20} />
                            </div>
                            <div className="detail-content-new">
                                <span className="detail-label-new">Last Sign In</span>
                                <span className="detail-value-new">{lastSignIn}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order History Section */}
                <div className="section-container">
                    <h2 className="section-title-profile">Order History</h2>

                    <div className="profile-porcelain-card">
                        {ordersLoading ? (
                            <div className="orders-loading">
                                <div className="loading-spinner"></div>
                                <span>Loading orders...</span>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="orders-empty">
                                <Package size={48} strokeWidth={1.5} />
                                <h3>No Orders Yet</h3>
                                <p>Your order history will appear here once you make a purchase.</p>
                                <button
                                    className="browse-products-btn"
                                    onClick={() => navigate('/products')}
                                >
                                    <ShoppingBag size={18} />
                                    <span>Browse Products</span>
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.orderId} className="order-card-wrapper">
                                        <div 
                                            className={`order-row ${expandedOrder === order.orderId ? 'expanded' : ''}`}
                                            onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                                        >
                                            <div className="order-items-preview">
                                                {order.items.slice(0, 3).map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="order-item-thumb"
                                                        style={{ zIndex: 3 - index }}
                                                    >
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} />
                                                        ) : (
                                                            <div className="order-item-placeholder">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="order-items-more">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="order-info">
                                                <div className="order-title">
                                                    {order.items.length === 1
                                                        ? order.items[0].name
                                                        : `${order.items[0]?.name || 'Order'} + ${order.items.length - 1} more`
                                                    }
                                                </div>
                                                <div className="order-meta">
                                                    <span className="order-number">#{order.orderNumber}</span>
                                                    <span className="order-date">{formatOrderDate(order.createdAt)}</span>
                                                    <span className="order-amount">₹{order.totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className={`order-status ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </div>
                                        </div>
                                        
                                        {/* Order Status Timeline */}
                                        {expandedOrder === order.orderId && (
                                            <div className="order-timeline-container">
                                                {order.status?.toLowerCase() === 'cancelled' ? (
                                                    <div className="order-cancelled-notice">
                                                        <span className="cancelled-icon">⚠</span>
                                                        <div>
                                                            <strong>Order Cancelled</strong>
                                                            <p>This order has been cancelled.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="order-timeline">
                                                        {getOrderTimeline(order.status).map((step, index, array) => (
                                                            <div key={step.key} className="timeline-step">
                                                                <div className={`timeline-dot ${
                                                                    step.isActive ? 'active' : 
                                                                    step.isCompleted ? 'completed' : 'pending'
                                                                }`}>
                                                                    <span className="timeline-icon">{step.icon}</span>
                                                                </div>
                                                                <div className="timeline-label">
                                                                    {step.label}
                                                                </div>
                                                                {index < array.length - 1 && (
                                                                    <div className={`timeline-line ${
                                                                        step.isCompleted ? 'completed' : 'pending'
                                                                    }`}></div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Order Details */}
                                                <div className="order-details-expanded">
                                                    <div className="order-detail-row">
                                                        <span className="detail-label">Shipping Address:</span>
                                                        <span className="detail-value">
                                                            {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                                                        </span>
                                                    </div>
                                                    {order.trackingNumber && (
                                                        <div className="order-detail-row">
                                                            <span className="detail-label">Tracking Number:</span>
                                                            <span className="detail-value tracking-number">{order.trackingNumber}</span>
                                                        </div>
                                                    )}
                                                    <div className="order-items-list">
                                                        <h4>Items in this order:</h4>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="order-item-detail">
                                                                <span className="item-name">{item.name}</span>
                                                                <span className="item-qty">x{item.quantity}</span>
                                                                <span className="item-price">₹{item.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="section-container">
                    <h2 className="section-title-profile">Quick Actions</h2>

                    <div className="quick-actions-grid">
                        <button
                            className="quick-action-card"
                            onClick={() => navigate('/products')}
                        >
                            <ShoppingBag size={24} />
                            <span>Browse Collections</span>
                        </button>

                        <button
                            className="quick-action-card"
                            onClick={() => navigate('/workshops')}
                        >
                            <Calendar size={24} />
                            <span>View Workshops</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
