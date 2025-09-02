import type React from "react"
import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Luxe Jewelry - Where Timeless Beauty Meets You",
  description:
    "Discover our exquisite collection of luxury rings, necklaces, earrings, and bracelets crafted for the discerning jewelry connoisseur.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lora.variable} antialiased`}>
      <body className="font-serif">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
