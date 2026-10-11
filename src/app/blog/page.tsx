import { getAllPosts } from "@/lib/blog";
import { BlogGrid } from "@/components/BlogGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | QR Code Generator",
  description:
    "Tips, guides, and insights on QR codes — from vCards and WiFi sharing to events and bulk generation.",
  alternates: { canonical: "https://qr.beyondtheinnovation.com/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return <BlogGrid posts={posts} />;
}
