import { Suspense } from "react"
import { PlusSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SkeletonCard, TeacherSubjectCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type Subject = {
    description: string | null
    subjectid: string
    subjectname: string
    teacherid: string | null
}

export default async function TeacherIndexPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .maybeSingle()
    const { data: subjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("teacherid", session?.user.id ?? "")

    return session && userData?.usertype === "teacher" ? (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Welcome back,{" "}
                <span className="text-muted-foreground">
                    {userData.first_name}!{" "}
                </span>
            </h1>
            <p className="text-md text-muted-foreground">
                Discover a world of teaching. Delve into the subjects you teach,
                explore your contents, and begin a knowledge-rich experience
                designed specifically for you. Click on the subject cards below
                to initiate your exploration.
            </p>
            <Button variant={"default"} className="max-w-fit shadow-xl">
                <PlusSquare className="mr-2 h-4 w-4" /> Create Subject
            </Button>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
                <Suspense
                    fallback={
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    }
                >
                    {subjects?.map((m, index) => (
                        <TeacherSubjectCard subject={m} key={index} />
                    ))}
                </Suspense>
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
