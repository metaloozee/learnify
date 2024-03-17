import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { MoveUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SkeletonCard, StudentSubjectCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentIndexPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: user } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("userid", session?.user.id ?? "")
        .maybeSingle()

    const { data: userSubjects } = await supabase
        .from("studentenrollment")
        .select("subjectid")
        .eq("userid", session?.user.id ?? "")

    return session && user ? (
        <div className="mt-20 flex flex-col gap-2 md:gap-5">
            <h1 className="text-3xl md:text-4xl">
                Welcome back,{" "}
                <span className="text-muted-foreground">
                    {user?.first_name}
                </span>
            </h1>
            <p className="text-sm md:text-md text-muted-foreground">
                Your learning journey awaits. Explore your subjects, dive into
                personalized content, and embark on a knowledge-filled adventure
                tailored just for you. Click on any subject card below to begin
                your exploration.
            </p>

            <Button variant={"secondary"} className="max-w-fit" asChild>
                <Link href={"/subjects"}>
                    Explore Subjects <MoveUpRight className="ml-2 h-3 w-3" />
                </Link>
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
                    {userSubjects &&
                        userSubjects.map((subject, index) => (
                            <StudentSubjectCard
                                key={index}
                                subjectid={subject.subjectid}
                            />
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
            <Link
                className="text-muted-foreground text-xs flex justify-start items-center"
                href={"/"}
            >
                <ArrowLeftIcon className="mr-2" />
                back
            </Link>
        </div>
    )
}
