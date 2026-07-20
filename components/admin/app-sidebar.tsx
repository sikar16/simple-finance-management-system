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
        href: "/dashboard",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },

    {
        label: "Clients",
        href: "/dashboard/clients",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-5a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },

    {
        label: "Deposits",
        href: "/dashboard/deposits",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v10m0-14a9 9 0 100 18 9 9 0 000-18z" />
            </svg>
        ),
    },

    {
        label: "Transfers",
        href: "/dashboard/transfers",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
            </svg>
        ),
    },

    {
        label: "Bank Accounts",
        href: "/dashboard/bank-accounts",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M5 10V8l7-4 7 4v2M5 10v10h14V10M9 14h6" />
            </svg>
        ),
    },

    {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 004 0M9 12h6m-6 4h6" />
            </svg>
        ),
    },

    {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1h6z" />
            </svg>
        ),
        badge: "5",
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
                            Admin Portal
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
                                        >
                                            <span
                                                className="flex h-7 w-7  items-center justify-center rounded-lg"
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
