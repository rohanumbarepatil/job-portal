import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationCenter({ onClose }) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif.id);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
      if (onClose) onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead} 
            className="text-xs text-blue-600 font-bold hover:text-blue-800"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            You're all caught up!
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map(notif => (
              <li 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t text-center bg-gray-50 shrink-0">
        <button 
          onClick={() => {
            navigate('/dashboard/settings/notifications');
            if (onClose) onClose();
          }}
          className="text-xs text-gray-600 font-bold hover:text-gray-900"
        >
          Notification Settings
        </button>
      </div>
    </div>
  );
}
