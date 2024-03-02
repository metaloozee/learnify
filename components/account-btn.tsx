"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type User } from "@supabase/supabase-js"
import { UserIcon } from "lucide-react"

import { getURL } from "@/lib/helpers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type UserData } from "@/components/navbar"
import { useSupabase } from "@/app/supabase-provider"

export const UserAccount = ({
    user,
    userData,
    children,
}: {
    user: User | null
    userData: UserData | null
    children?: React.ReactElement
}) => {
    const router = useRouter()
    const pathname = usePathname()

    const { supabase: supa } = useSupabase()

    const handleLogin = async () => {
        await supa.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: getURL() },
        })

        router.refresh()
    }

    const handleLogout = async () => {
        await supa.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    className="ml-1 relative h-8 w-8 rounded-full shadow-xl"
                >
                    <Avatar>
                        <AvatarImage src={user.user_metadata.avatar_url} />
                        <AvatarFallback>
                            <UserIcon className="text-muted-foreground/90" />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {userData?.first_name ?? ""}{" "}
                            {userData?.last_name ?? ""}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userData?.username ?? user.user_metadata.full_name}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link className="text-center w-full" href={"/account"}>
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            onClick={handleLogout}
                            variant={"destructive"}
                            className="w-full"
                        >
                            Log Out
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : children ? (
        <Button className="shadow-xl max-w-fit group" onClick={handleLogin}>
            {children}
        </Button>
    ) : pathname === "/" ? (
        <></>
    ) : (
        <Button className="shadow-xl max-w-fit group" onClick={handleLogin}>
            Login
        </Button>
    )
}
