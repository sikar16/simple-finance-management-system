import { prisma } from "./prisma";
import { sendPushNotification } from "./firebase";

export async function createAndSendNotification(
  clientId: string,
  title: string,
  message: string,
  data?: Record<string, string>
) {
  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        clientId,
        title,
        message,
      },
    });

    // Get user's FCM token
    const user = await prisma.user.findUnique({
      where: { id: clientId },
      select: { fcmToken: true },
    });

    // Send push notification if user has FCM token
    if (user?.fcmToken) {
      await sendPushNotification(user.fcmToken, title, message, data);
    }

    return notification;
  } catch (error) {
    console.error("Error creating/sending notification:", error);
    throw error;
  }
}