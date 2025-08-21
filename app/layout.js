// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";
import VisitorTracker from "./components/VisitorTracker";
import SessionWrapper from "./components/SessionWrapper";
import PageTransition from "./components/PageTransition"; // we'll create this

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Veranli",
  description: "E-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <SessionWrapper>
          <Navbar />
          <VisitorTracker />

          {/* Page Transition Wrapper */}
          <PageTransition>{children}</PageTransition>

          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
