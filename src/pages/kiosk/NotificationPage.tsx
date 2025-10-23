import { useState, useEffect } from 'react'
import './NotificationPage.css'

interface Notification {
  id: number;
  title: string;
  body: string;
  level: 'info' | 'warning' | 'error';
  created_at: string;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Error loading notifications. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="notification-card">
            <p>No notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <span className={`notification-level level-${notification.level}`}>
                {notification.level.charAt(0).toUpperCase() + notification.level.slice(1)}
              </span>
              <h2 className="notification-title">{notification.title}</h2>
              <p className="notification-body">{notification.body}</p>
              <p className="notification-time">
                {formatDate(notification.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;