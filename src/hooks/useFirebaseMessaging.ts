import { useEffect, useState } from "react";
import { requestNotificationPermission, onMessageListener } from "@/src/lib/firebase-config";
import { getStoredAuth } from "@/src/lib/auth";

export function useFirebaseMessaging() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setupMessaging() {
      try {
        // Check if notifications are supported
        if (!("Notification" in window)) {
          console.log("This browser does not support notifications");
          setLoading(false);
          return;
        }

        setPermission(Notification.permission);

        // Request permission if not granted
        if (Notification.permission === "default") {
          const fcmToken = await requestNotificationPermission();
          if (fcmToken) {
            setToken(fcmToken);
            await registerTokenWithServer(fcmToken);
          }
        } else if (Notification.permission === "granted") {
          const fcmToken = await requestNotificationPermission();
          if (fcmToken) {
            setToken(fcmToken);
            await registerTokenWithServer(fcmToken);
          }
        }

        // Listen for incoming messages
        onMessageListener((payload) => {
          console.log("Received foreground message:", payload);
          // Handle foreground notification (e.g., show a toast)
          if (payload.notification) {
            new Notification(payload.notification.title as string, {
              body: payload.notification.body,
              icon: "/icon.png",
            });
          }
        });
      } catch (error) {
        console.error("Error setting up Firebase messaging:", error);
      } finally {
        setLoading(false);
      }
    }

    setupMessaging();
  }, []);

  async function registerTokenWithServer(fcmToken: string) {
    try {
      const auth = getStoredAuth();
      if (!auth) return;

      await fetch("/api/fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ fcmToken }),
      });
    } catch (error) {
      console.error("Error registering FCM token:", error);
    }
  }

  async function requestPermission() {
    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
        setPermission("granted");
        await registerTokenWithServer(fcmToken);
      }
      return fcmToken;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return null;
    }
  }

  return {
    token,
    permission,
    loading,
    requestPermission,
  };
}