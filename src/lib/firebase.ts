import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey && getApps().length === 0) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    initializeApp({
      credential: cert(serviceAccount),
    });
    messagingInstance = getMessaging();
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    console.warn("Push notifications will not work without proper Firebase credentials");
  }
} else if (!serviceAccountKey) {
  console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found in environment variables");
  console.warn("Push notifications will not work without proper Firebase credentials");
}

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  if (!messagingInstance) {
    console.warn("Firebase messaging not initialized, skipping push notification");
    return null;
  }

  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    const response = await messagingInstance.send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}