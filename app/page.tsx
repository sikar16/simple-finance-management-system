"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f8f7f4' }}>
      {/* Navbar */}
      <nav className="border-b" style={{ backgroundColor: '#1C2541', borderColor: '#2a3656' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div>
              <h1 className="text-xl font-bold text-white">
                ✍ ብእር
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="rounded-sm px-3 py-1  transition-colors hover:bg-white/10"
              style={{ color: '#ffffff' }}
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-sm px-3 py-1  text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#a67c3e' }}
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: 'rgba(28, 37, 65, 0.08)',
            color: '#1C2541'
          }}
        >
          Money Transfer Management System
        </span>

        <h1
          className="mt-6 max-w-4xl text-3xl font-extrabold leading-tight"
          style={{ color: '#1C2541' }}
        >
          Manage Client Deposits, Transfers, and Receipts in One Place.
        </h1>

        <p className="mt-6 max-w-2xl text-lg" style={{ color: '#4a4a4a' }}>
          Amanet helps you manage client balances, record deposits,
          transfer money, upload receipts, and lets every client securely
          view their own transaction history.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/login"
            className="rounded-lg px-6 py-1  text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#1C2541' }}
          >
            Login
          </a>

          <a
            href="#features"
            className="rounded-lg border-2 px-6 py-1  transition-colors hover:bg-white"
            style={{
              borderColor: '#1C2541',
              color: '#1C2541'
            }}
          >
            Learn More
          </a>
        </div>

        {/* Decorative element */}
        <div className="mt-16 flex items-center gap-2">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#a67c3e' }}></div>
          <div className="h-1 w-6 rounded-full" style={{ backgroundColor: '#1C2541' }}></div>
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#a67c3e' }}></div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 pb-24"
      >
        <div className="mb-12 text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: '#1C2541' }}
          >
            Everything You Need to Manage Transfers
          </h2>
          <p className="mt-3" style={{ color: '#4a4a4a' }}>
            Simple, secure, and built for efficiency
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div
            className="group rounded-2xl p-8 transition-all hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              borderBottom: `4px solid #a67c3e`
            }}
          >
            <div
              className="mb-4 inline-flex rounded-xl p-3"
              style={{ backgroundColor: 'rgba(28, 37, 65, 0.08)' }}
            >
              <svg className="h-8 w-8" style={{ color: '#1C2541' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#1C2541' }}>
              Client Management
            </h3>
            <p className="mt-3 leading-relaxed" style={{ color: '#4a4a4a' }}>
              Register clients, manage accounts, and track balances with ease.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="group rounded-2xl p-8 transition-all hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              borderBottom: `4px solid #a67c3e`
            }}
          >
            <div
              className="mb-4 inline-flex rounded-xl p-3"
              style={{ backgroundColor: 'rgba(28, 37, 65, 0.08)' }}
            >
              <svg className="h-8 w-8" style={{ color: '#1C2541' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#1C2541' }}>
              Money Transfers
            </h3>
            <p className="mt-3 leading-relaxed" style={{ color: '#4a4a4a' }}>
              Record every transfer, upload receipts, and maintain a complete transaction history.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="group rounded-2xl p-8 transition-all hover:shadow-xl"
            style={{
              backgroundColor: '#ffffff',
              borderBottom: `4px solid #a67c3e`
            }}
          >
            <div
              className="mb-4 inline-flex rounded-xl p-3"
              style={{ backgroundColor: 'rgba(28, 37, 65, 0.08)' }}
            >
              <svg className="h-8 w-8" style={{ color: '#1C2541' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#1C2541' }}>
              Client Portal
            </h3>
            <p className="mt-3 leading-relaxed" style={{ color: '#4a4a4a' }}>
              Clients can securely log in to view their deposits, transfers, receipts, and remaining balances.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#1C2541' }}>
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-md" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join thousands of businesses managing their financial transactions securely.
          </p>
          <a
            href="/register"
            className="mt-8 inline-block rounded-lg px-6 py-2  text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#a67c3e' }}
          >
            Create Your Account Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{
        backgroundColor: '#f8f7f4',
        borderColor: '#e5e3df'
      }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            © 2026 ብእር. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <div className="h-4 w-px" style={{ backgroundColor: '#d0cec9' }}></div>
            <span
              className="text-sm font-medium"
              style={{ color: '#a67c3e' }}
            >
              #ብእር
            </span>
          </div>
        </div>
      </footer>
    </main >
  );
}