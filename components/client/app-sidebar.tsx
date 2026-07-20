'use client'

import { SidebarUserFooter } from "@/components/sidebar-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
    {
        label: "Dashboard",
        href: "/client",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        label: "Deposits",
        href: "/client/deposits",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v16m8-8H4" />
            </svg>
        ),
    },
    {
        label: "Transfers",
        href: "/client/transfers",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
    },
    {
        label: "Notifications",
        href: "/client/notifications",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        badge: "3",
    },
    {
        label: "Profile",
        href: "/client/profile",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader className="border-b px-4 py-5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-base font-bold "
                    >
                        ✍
                    </div>
                    <div>
                        <p className="text-2xl font-bold leading-none" style={{ color: "#1C2541" }}>
                            ብእር
                        </p>
                        <p className="mt-0.5 text-xs" style={{ color: "#9ca3af" }}>
                            Client Portal
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-3">
                <SidebarGroup>

                    <SidebarMenu className="space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton >
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                                        // style={
                                        //     isActive
                                        //         ? { backgroundColor: "#1C2541", color: "#ffffff" }
                                        //         : { color: "#374151" }
                                        // }
                                        >
                                            <span
                                                className="flex h-7 w-7  items-center justify-center rounded-lg"
                                            // style={
                                            //     isActive
                                            //         ? { backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }
                                            //         : { backgroundColor: "rgba(28,37,65,0.07)", color: "#1C2541" }
                                            // }
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: "#a67c3e" }}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && (
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#a67c3e" }} />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>



            </SidebarContent>

            <SidebarFooter className="border-t p-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <SidebarUserFooter />
            </SidebarFooter>
        </Sidebar>
    )
}
