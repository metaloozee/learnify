import { Suspense } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateNoteButton } from "@/components/create-note-btn"
import { ManageSubject } from "@/components/manage-subject"
import { NotesCard } from "@/components/note-card"
import { Search } from "@/components/search"
import { StudentEnrollmentDataTable } from "@/components/student-data-table"
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

    const { data: studentEnrollment } = await supabase
        .from("studentenrollment")
        .select(
            `
            enrollmentid,
            userid,
            subjectid,

            users (userid, username, usertype, first_name, last_name)
        `
        )
        .eq("subjectid", params.id)

    return session && userData && subject && studentEnrollment ? (
        <div className="w-full h-full flex flex-col justify-center">
            <Tabs defaultValue="notes">
                <div className="flex justify-between">
                    <TabsList>
                        <TabsTrigger value="notes">Manage Notes</TabsTrigger>
                        <TabsTrigger value="students">
                            Manage Students
                        </TabsTrigger>
                    </TabsList>

                    <ManageSubject subject={subject} />
                </div>

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
                        <CreateNoteButton
                            id={subject.subjectid}
                            teacherid={subject.teacherid ?? ""}
                        />
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
                <TabsContent value="students">
                    <div className="mt-16 flex flex-col gap-5">
                        <h1 className="text-3xl md:text-4xl">
                            Student{" "}
                            <span className="text-muted-foreground">
                                Management
                            </span>
                        </h1>
                        <p className="text-md text-muted-foreground">
                            Effortlessly oversee and guide your students'
                            educational journey. Manage enrollments, track
                            progress, and provide personalized support for a
                            tailored learning experience
                        </p>
                    </div>
                    <div className="mt-10">
                        <StudentEnrollmentDataTable data={studentEnrollment} />
                    </div>
                </TabsContent>
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
