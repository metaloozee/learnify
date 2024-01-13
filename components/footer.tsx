import Link from "next/link"

import { ModeToggle } from "@/components/theme-toggle"
import { createServerSupabaseClient } from "@/app/supabase-server"

export const Footer = async () => {
    const supabase = createServerSupabaseClient()

    return (
        <footer className="absolute w-full top-full border-t bg-background">
            <div className="container my-10 mx-auto flex flex-col md:flex-row md:flex-nowrap items-center md:justify-between">
                <div className="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left space-y-2">
                    <Link href={"/"} className="text-2xl font-bold">
                        Doro
                    </Link>
                    <p className="text-slate-500 text-xs">
                        Elevating Education, One Personalized Step at a Time
                    </p>
                    <div className="pt-4">
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </footer>
    )
}
