import "./globals.css"

import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "@/app/supabase-provider"

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
        <html lang="en">
            <body>
                <SupabaseProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        <div className="relative flex min-h-screen flex-col">
                            <Navbar />
                            <div className="flex my-10 md:mt-10 md:mb-20 items-center justify-center">
                                {children}
                            </div>
                        </div>
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
