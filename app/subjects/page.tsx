import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CreateEnrollment } from "@/components/create-enrollment"
import { SkeletonCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function SubjectsIndexPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: subjects } = await supabase
        .from("subjects")
        .select("*, users(*)")
    const { data: enrollments } = await supabase
        .from("studentenrollment")
        .select("subjectid")
        .eq("userid", session?.user.id ?? "")

    const enrollmentIds = enrollments?.map((enrollment) => enrollment.subjectid)

    return (
        <div className="mt-20 flex flex-col gap-2 md:gap-5">
            <h1 className="text-3xl md:text-4xl">
                Explore Diverse Subjects{" "}
                <span className="text-muted-foreground">
                    and Ignite Your Curiosity!
                </span>
            </h1>
            <p className="text-sm md:text-md text-muted-foreground">
                Embark on a learning journey tailored to your interests. Choose
                from a wide array of subjects, each offering a unique
                exploration into the fascinating world of knowledge. Enroll
                today and unlock the doors to a personalized and enriching
                educational experience.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
                <Suspense
                    fallback={
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    }
                >
                    {subjects?.map(async (subject, index) => (
                        <CreateEnrollment
                            key={index}
                            subject={subject}
                            userEnrollmentSubjectIds={enrollmentIds ?? []}
                            session={session}
                        />
                    ))}
                </Suspense>
            </div>
        </div>
    )
}
