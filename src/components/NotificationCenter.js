import React from 'react';

function NotificationCenter({ notifications }) {
  return (
    <div className="notification-center">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
