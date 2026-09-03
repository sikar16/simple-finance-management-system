'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/client/app-sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { useFirebaseMessaging } from "@/src/hooks/useFirebaseMessaging"

function FirebaseMessagingSetup() {
    useFirebaseMessaging();
    return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <FirebaseMessagingSetup />
            <SidebarProvider>
                <AppSidebar />
                <main className="relative flex min-h-screen flex-1 flex-col overflow-x-auto">
                    <div className="absolute left-3 top-3 z-20">
                        <SidebarTrigger className="rounded-lg bg-white/10 text-white backdrop-blur-sm hover:bg-white/20" />
                    </div>

                    {children}
                </main>
            </SidebarProvider>
        </AuthProvider>
    )
}
