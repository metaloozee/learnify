import "./globals.css"

import { Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import { Background } from "@/components/ui/background"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/app/supabase-provider"

const lora = Lora({
    subsets: ["latin"],
})

export const metadata = {
    title: "Learnify",
    description: "Elevating Education, One Personalized Step at a Time",
}

export const dynamic = "force-dynamic"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={lora.className}>
            <body>
                <SupabaseProvider>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <div className="flex container my-10 md:mt-10 md:mb-20">
                            {children}
                        </div>
                        <Toaster />
                        <Background />
                        <Analytics />
                    </div>
                </SupabaseProvider>
            </body>
        </html>
    )
}
