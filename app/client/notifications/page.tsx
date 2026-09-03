"use client";

import { useEffect, useState } from "react";
import { getStoredAuth } from "@/src/lib/auth";

type Notification = {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const auth = getStoredAuth();
                if (!auth) {
                    setError("Please login to view notifications");
                    setLoading(false);
                    return;
                }

                const response = await fetch("/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch notifications");
                }

                const data = await response.json();
                setNotifications(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load notifications");
            } finally {
                setLoading(false);
            }
        }

        fetchNotifications();
    }, []);

    const getNotificationType = (title: string) => {
        if (title.toLowerCase().includes("transfer")) return "success";
        if (title.toLowerCase().includes("deposit")) return "deposit";
        return "pending";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-500">Loading notifications...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold"
                    style={{ color: "#1C2541" }}
                >
                    Notifications
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Stay updated with your latest activities.
                </p>
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No notifications yet
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const type = getNotificationType(notification.title);

                        return (
                            <div
                                key={notification.id}
                                className="
                  flex
                  items-start
                  justify-between
                  rounded-2xl
                  border
                  bg-white
                  p-5
                  shadow-sm
                  transition
                  hover:shadow-md
                "
                                style={{
                                    borderColor: "rgba(0,0,0,0.06)"
                                }}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div
                                        className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                    "
                                        style={{
                                            background:
                                                type === "success"
                                                    ? "#ecfdf5"
                                                    : type === "deposit"
                                                        ? "#f8f1e8"
                                                        : "#eff6ff",
                                            color:
                                                type === "success"
                                                    ? "#059669"
                                                    : type === "deposit"
                                                        ? "#a67c3e"
                                                        : "#2563eb"
                                        }}
                                    >
                                        {type === "success" && "✓"}
                                        {type === "deposit" && "💰"}
                                        {type === "pending" && "⏳"}
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3
                                                className="font-semibold"
                                                style={{
                                                    color: "#1C2541"
                                                }}
                                            >
                                                {notification.title}
                                            </h3>

                                            {!notification.isRead && (
                                                <span
                                                    className="
                            h-2
                            w-2
                            rounded-full
                          "
                                                    style={{
                                                        background: "#a67c3e"
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {formatDate(notification.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Action */}
                                <button
                                    className="
                    rounded-xl
                    px-3
                    py-2
                    text-xs
                    font-medium
                    transition
                    hover:bg-gray-100
                  "
                                    style={{
                                        color: "#1C2541"
                                    }}
                                >
                                    View
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}