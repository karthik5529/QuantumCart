import React from 'react';

// UPDATE: Accept the 'user' prop
const Notifications = ({ user, onClose }) => {

  // Create a welcome notification if the user is logged in
  const notifications = [];
  if (user) {
    notifications.push({
      id: 1,
      icon: '👋',
      title: 'Welcome to QuantumCart!',
      // Personalize the message with the user's first name
      message: `Hi ${user.displayName.split(' ')[0]}, we're glad to have you here. Happy shopping!`,
      time: 'just now'
    });
  }

  return (
    <div className="header-dropdown notifications-dropdown">
      <div className="dropdown-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="dropdown-close-btn">&times;</button>
      </div>
      <div className="dropdown-body">
        {/* UPDATE: Conditionally render the welcome message or the empty state */}
        {notifications.length === 0 ? (
          <div className="empty-message">
            <p><strong>No new notifications.</strong></p>
            <p>We'll catch up soon!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notif => (
              <div key={notif.id} className="notification-item">
                <div className="notification-icon">{notif.icon}</div>
                <div className="notification-content">
                  <p className="notification-title">{notif.title}</p>
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="dropdown-footer">
        <a href="#notifications">View all notifications</a>
      </div>
    </div>
  );
};

export default Notifications;
