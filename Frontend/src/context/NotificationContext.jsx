import React, { createContext, useContext, useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useAuth } from "./AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // 1. Request FCM Permission & Register Token
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const messaging = getMessaging();
          // We would pass VAPID key here in production
          const currentToken = await getToken(messaging, {
            vapidKey: "YOUR_VAPID_KEY_HERE",
          });
          if (currentToken) {
            await axiosInstance.post("/notifications/fcm-token", {
              token: currentToken,
            });
          }

          // Listen for foreground messages
          onMessage(messaging, (payload) => {
            toast.success(
              `${payload.notification.title}: ${payload.notification.body}`,
              { duration: 5000 },
            );
          });
        }
      } catch (e) {
        console.warn("FCM setup failed", e);
      }
    };
    setupFCM();

    // 2. Listen to Firestore real-time for In-App Notification Center
    const q = query(
      collection(db, "notifications"),
      where("userUid", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      let unread = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({ id: doc.id, ...data });
        if (!data.isRead) unread++;
      });
      setNotifications(notifs);
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/read-all");
    } catch (e) {
      console.error("Failed to mark all read", e);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
