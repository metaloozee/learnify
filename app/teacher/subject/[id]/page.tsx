import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotesDataTable } from "@/components/notes-data-table"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function TeacherSubjectIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .eq("usertype", "teacher")
        .single()
    const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("subjectid", params.id)
        .eq("teacherid", session?.user.id ?? "")
        .single()
    const { data: notes } = await supabase
        .from("notes")
        .select("noteid, notetitle, notecontent")
        .eq("subjectid", subject?.subjectid ?? "")

    return session && userData && subject ? (
        <div className="w-full h-full flex flex-col justify-center">
            <Tabs defaultValue="notes">
                <TabsList>
                    <TabsTrigger value="notes">Manage Notes</TabsTrigger>
                    <TabsTrigger value="students">Manage Students</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                    {notes && <NotesDataTable data={notes} />}
                </TabsContent>
                <TabsContent value="students">coming soon</TabsContent>
            </Tabs>
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
