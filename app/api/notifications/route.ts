import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      
      const notifications = await prisma.notification.findMany({
        where: { clientId: decoded.id },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(notifications);
    } catch (jwtError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      
      const body = await req.json();
      const { notificationIds } = body;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        return NextResponse.json(
          { message: "Notification IDs are required" },
          { status: 400 }
        );
      }

      // Mark notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          clientId: decoded.id,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ message: "Notifications marked as read" });
    } catch (jwtError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { message: "Failed to update notifications" },
      { status: 500 }
    );
  }
}