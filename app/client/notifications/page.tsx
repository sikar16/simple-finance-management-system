const notifications = [
    {
        id: 1,
        title: "Transfer Completed",
        message: "Your transfer of 20,000 ETB to Abebe Kebede has been completed.",
        date: "July 16, 2026",
        read: false,
        type: "success",
    },
    {
        id: 2,
        title: "New Deposit Received",
        message: "A deposit of 50,000 ETB has been added from Sara Ali.",
        date: "July 15, 2026",
        read: true,
        type: "deposit",
    },
    {
        id: 3,
        title: "Pending Transfer",
        message: "Transfer request from Dawit Tadesse is waiting for approval.",
        date: "July 14, 2026",
        read: false,
        type: "pending",
    },
];


export default function NotificationsPage() {

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

            <div className="space-y-4">

                {notifications.map((notification) => (

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
                                        notification.type === "success"
                                            ? "#ecfdf5"
                                            :
                                            notification.type === "deposit"
                                                ? "#f8f1e8"
                                                :
                                                "#eff6ff",

                                    color:
                                        notification.type === "success"
                                            ? "#059669"
                                            :
                                            notification.type === "deposit"
                                                ? "#a67c3e"
                                                :
                                                "#2563eb"
                                }}
                            >

                                {notification.type === "success" && "✓"}

                                {notification.type === "deposit" && "💰"}

                                {notification.type === "pending" && "⏳"}

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


                                    {!notification.read && (

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
                                    {notification.date}
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

                ))}

            </div>


        </div>
    );
}