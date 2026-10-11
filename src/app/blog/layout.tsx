import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog | QR Code Generator",
    template: "%s | QR Code Generator",
  },
  description:
    "Tips, guides, and insights on QR codes — from vCards and WiFi sharing to events and bulk generation.",
  openGraph: {
    siteName: "QR Code Generator",
    type: "website",
    locale: "en_US",
    url: "https://qr.beyondtheinnovation.com/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
