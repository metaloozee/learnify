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
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Exciting Things Are{" "}
                <span className="text-muted-foreground">Coming Soon!</span>
            </h1>
            <p className="text-md text-muted-foreground">
                Stay tuned for our upcoming launch. We can't wait to share it
                with you.
            </p>
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
