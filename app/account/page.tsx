import React from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { DeleteAccountForm } from "@/components/delete-account-form"
import { AccountSettingsForm } from "@/components/settings-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Account() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .maybeSingle()

    return session && userData ? (
        <div className="mt-20 flex flex-col gap-5 w-full">
            <h1 className="text-3xl md:text-4xl">
                Manage Your{" "}
                <span className="text-muted-foreground">Account</span>
            </h1>
            <p className="text-md text-muted-foreground">
                Take control of your account by customizing your credentials and
                information. Update your details seamlessly and ensure your
                learning experience is personalized to your preferences.
            </p>
            <AccountSettingsForm session={session} user={userData} />
            <DeleteAccountForm session={session} user={userData} />
        </div>
    ) : (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Unauthorized / Account Not Found
            </h1>
            <p className="text-md text-muted-foreground">
                You don't have the necessary privileges to view this page /
                Kindly register yourself before changing your credentials.
            </p>
            <Link
                className="text-muted-foreground text-xs flex justify-start items-center"
                href={"/"}
            >
                <ArrowLeftIcon className="mr-2" />
                back
            </Link>
        </div>
    )
}
