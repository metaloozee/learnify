import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { FilePlus2 } from "lucide-react"

import { Database } from "@/types/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotesCard } from "@/components/note-card"
import { Search } from "@/components/search"
import { SkeletonCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function TeacherSubjectIndexPage({
    params,
    searchParams,
}: {
    params: any
    searchParams?: {
        query?: string
    }
}) {
    const supabase = await createServerSupabaseClient()

    const query = searchParams?.query || ""

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

    const createNote = async () => {
        "use server"
        const supabase = await createServerActionClient<Database>({ cookies })

        try {
            const { data, error } = await supabase
                .from("notes")
                .insert({
                    notetitle: "Untitled",
                    notecontent: "Click me in order to edit",
                    subjectid: subject?.subjectid,
                    teacherid: subject?.teacherid,
                })
                .select()
                .single()

            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            revalidatePath(`/teacher/subject/${subject?.subjectid}`)
        }
    }

    return session && userData && subject ? (
        <div className="w-full h-full flex flex-col justify-center">
            <Tabs defaultValue="notes">
                <TabsList>
                    <TabsTrigger value="notes">Manage Notes</TabsTrigger>
                    <TabsTrigger value="students">Manage Students</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                    <div className="mt-16 flex flex-col gap-5">
                        <h1 className="text-3xl md:text-4xl">
                            {subject.subjectname}
                        </h1>
                        <p className="text-md text-muted-foreground">
                            Effortlessly organize and enhance your teaching
                            materials. Create, edit, and organize notes to
                            provide a seamless learning experience for your
                            students. Stay in control of your subject's content
                            and empower your students with engaging educational
                            resources.
                        </p>
                        <form action={createNote}>
                            <Button
                                variant={"default"}
                                className="max-w-fit shadow-xl"
                                type="submit"
                            >
                                <FilePlus2 className="mr-2 h-4 w-4" /> Create
                                Note
                            </Button>
                        </form>
                    </div>
                    <div className="mt-10 flex flex-col gap-5">
                        <Search placeholder="Search Notes..." />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
                            <Suspense
                                key={query}
                                fallback={
                                    <>
                                        <SkeletonCard />
                                        <SkeletonCard />
                                    </>
                                }
                            >
                                <NotesCard
                                    q={query}
                                    type="teacher"
                                    subjectid={subject.subjectid}
                                />
                            </Suspense>
                        </div>
                    </div>
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
