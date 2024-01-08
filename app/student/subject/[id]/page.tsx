import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentSubjectIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("subjectid", params.id)
        .single()
    const { data: studentData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .single()

    return session &&
        subject &&
        studentData &&
        studentData.subjects?.includes(subject.subjectid) ? (
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
            <h1 className="text-3xl md:text-4xl">Unauthorized</h1>
            <p className="text-md text-muted-foreground">
                You don't have the necessary privileges to view this page.
            </p>
        </div>
    )
}
