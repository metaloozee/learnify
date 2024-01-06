import "./globals.css"

import { Lora } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/app/supabase-provider"

const lora = Lora({
    subsets: ["latin"],
})

export const metadata = {
    title: "Doro",
    description: "Personalized Learning Web Application",
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
                    <ThemeProvider attribute="class" defaultTheme="light">
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <div className="flex container my-10 md:mt-10 md:mb-20">
                                {children}
                            </div>
                            <Toaster />
                        </div>
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
