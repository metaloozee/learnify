import Link from "next/link"

import { TeacherPlayground } from "@/components/teacher-playground"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type NoteData = {
    notecontent: string
    noteid: string
    notetitle: string
    subjectid: string | null
    userid: string | null
}

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
        .eq("usertype", "teacher")
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
        <div className="flex flex-col gap-5">
            <span className="text-xs text-muted-foreground">
                Dashboard &gt;{" "}
                <Link href={`/teacher/subject/${subjectData.subjectid}`}>
                    {subjectData.subjectname}
                </Link>{" "}
                &gt;{" "}
                <Link href={`/teacher/notes/${noteData.noteid}`}>
                    {noteData.notetitle}
                </Link>
            </span>

            <div className="mt-10">
                <TeacherPlayground
                    session={session}
                    user={teacherData}
                    subject={subjectData}
                    note={noteData}
                />
            </div>
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
