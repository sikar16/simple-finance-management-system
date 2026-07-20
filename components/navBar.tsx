import Link from "next/link";

export default function NavBar() {
    return (
        <nav
            className="border-b"
            style={{ backgroundColor: "#1C2541", borderColor: "#2a3656" }}
        >
            <Link href="/" className="  cursor-pointer">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <h1 className="text-xl font-bold text-white">✍ ብእር</h1>
                </div>
            </Link>
        </nav>
    )
}