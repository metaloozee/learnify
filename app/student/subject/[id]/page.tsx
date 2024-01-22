import { Suspense } from "react"
import { revalidatePath } from "next/cache"

import { Badge } from "@/components/ui/badge"
import { NotesCard } from "@/components/note-card"
import { Search } from "@/components/search"
import { SkeletonCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentSubjectIndexPage({
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
    const { data: subjectData } = await supabase
        .from("studentenrollment")
        .select("userid, subjectid, subjects(*, users(first_name, last_name))")
        .eq("userid", session?.user?.id ?? "")
        .eq("subjectid", params.id)
        .maybeSingle()

    return session && subjectData ? (
        <div className="mt-20 flex flex-col gap-5">
            <Badge className="max-w-fit" variant={"outline"}>
                {subjectData.subjects?.users?.first_name}{" "}
                {subjectData.subjects?.users?.last_name}
                {"'s "}
            </Badge>
            <h1 className="text-3xl md:text-4xl">
                {subjectData.subjects?.subjectname}
            </h1>
            <p className="text-md text-muted-foreground">
                {subjectData.subjects?.description}
            </p>

            <div className="mt-10 flex flex-col gap-5">
                <Search placeholder="Search Notes..." />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
                    <Suspense
                        key={query}
                        fallback={
                            <>
                                <SkeletonCard />
                            </>
                        }
                    >
                        <NotesCard
                            q={query}
                            type="student"
                            subjectid={subjectData.subjectid}
                        />
                    </Suspense>
                </div>
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
