import React from "react"

import { AccountSettingsForm } from "@/components/settings-form"
import { SkeletonCard } from "@/components/subject-card"
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
            <React.Suspense fallback={<SkeletonCard />}>
                <AccountSettingsForm session={session} user={userData} />
            </React.Suspense>
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
        </div>
    )
}
