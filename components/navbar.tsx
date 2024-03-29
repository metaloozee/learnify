import Image from "next/image"
import Link from "next/link"
import Brand from "@/public/_static/brand.svg"

import { UserAccount } from "@/components/account-btn"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type UserData = {
    first_name: string | null
    last_name: string | null
    userid: string
    username: string
    usertype: string
}

export const Navbar = async () => {
    const supabase = createServerSupabaseClient()
    const { data: user } = await supabase.auth.getUser()

    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", user.user?.id ?? "")
        .maybeSingle()

    return (
        <header className="top-0 z-40 w-full border-b bg-background/30 backdrop-blur-md">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src={Brand}
                            alt="Learnify"
                            width={40}
                            height={40}
                        />
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end">
                    <nav className="flex items-center justify-center gap-5">
                        <UserAccount
                            user={user.user ?? null}
                            userData={userData ?? null}
                        />
                    </nav>
                </div>
            </div>
        </header>
    )
}
