import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function TeacherNotesIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: teacherData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .single()
    const { data: noteData } = await supabase
        .from("notes")
        .select("*")
        .eq("noteid", params.id)
        .single()
    const { data: subjectData } = await supabase
        .from("subjects")
        .select("*")
        .eq("subjectid", noteData?.subjectid ?? "")
        .eq("teacherid", teacherData?.userid ?? "")
        .single()

    return session && teacherData && noteData && subjectData ? (
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
