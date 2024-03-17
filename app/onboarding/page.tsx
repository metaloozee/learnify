import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { OnboardForm } from "@/components/onboard-form"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Onboarding() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: userData } = await supabase
        .from("users")
        .select("username")
        .eq("userid", session?.user.id ?? "")
        .maybeSingle()

    return session && !userData ? (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Welcome{" "}
                <span className="text-muted-foreground">
                    {session.user.user_metadata.full_name}
                </span>
            </h1>
            <p className="text-md text-muted-foreground">
                Let's kickstart your personalized learning journey. Take a
                moment to shape your experience by creating your profile. Simply
                submit the form below and unlock a world of tailored educational
                content designed just for you.
            </p>
            <OnboardForm session={session} />
        </div>
    ) : (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Unauthorized / Already Registered
            </h1>
            <p className="text-md text-muted-foreground">
                You don't have the necessary privileges to view this page.
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
