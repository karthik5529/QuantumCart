import React from 'react';

// 1. Accept the new `handleLogout` prop
const UserProfileModal = ({ user, onClose, handleLogout }) => {
    if (!user) return null;

    // The joinDate logic can be simplified as it's not present in the new backend user object
    // If you add it back to your backend, you can uncomment this.
    // const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric'
    // });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>×</button>
                
                <div className="profile-header">
                    <img src={user.image} alt={user.displayName} className="profile-avatar-large" />
                    <h2 className="profile-displayName">{user.displayName}</h2>
                    <p className="profile-email">{user.email}</p>
                    {user.membership === 'Gold' && (
                        <div className="gold-member-badge">
                            ✨ Gold Member
                        </div>
                    )}
                </div>

                <div className="profile-body">
                    <div className="profile-stat">
                        <span className="stat-label">Membership</span>
                        <span className="stat-value">{user.membership}</span>
                    </div>
                    {/* Add more user stats here if needed */}
                </div>

                {/* 2. Add a footer section with a logout button */}
                <div className="profile-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
