import Link from "next/link"
import type { Session } from "@supabase/supabase-js"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SubmitEnrollmentButton } from "@/components/enroll-subject-btn"
import { createServerSupabaseClient } from "@/app/supabase-server"
import type { Subject } from "@/app/teacher/page"

export type SubjectData = {
    description: string | null
    subjectid: string
    subjectname: string
    teacherid: string | null
    users: {
        first_name: string | null
        last_name: string | null
        subjects: string[] | null
        userid: string
        username: string
        usertype: string
    } | null
}

export const ExploreSubjectsCard = async ({
    subject,
    session,
}: {
    subject: SubjectData
    session: Session | null
}) => {
    const supabase = await createServerSupabaseClient()
    const { data: UserData } = await supabase
        .from("users")
        .select("subjects")
        .eq("userid", session?.user.id ?? "")
        .single()

    return (
        <Card className="flex flex-col justify-between">
            <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Badge className="max-w-fit" variant={"outline"}>
                        {subject?.users?.first_name} {subject?.users?.last_name}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <h1 className="mt-2 text-2xl font-bold">
                        {subject?.subjectname}
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {subject?.description}
                    </p>
                </CardContent>
            </div>
            {session ? (
                <CardFooter>
                    {UserData?.subjects?.includes(subject.subjectid) ? (
                        <Button className="w-full" disabled>
                            Already Enrolled
                        </Button>
                    ) : (
                        <SubmitEnrollmentButton
                            subject={subject}
                            session={session}
                        />
                    )}
                </CardFooter>
            ) : (
                <CardFooter>
                    <Button className="w-full" disabled>
                        Login to Enroll
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

export const StudentSubjectCard = async ({
    subjectid,
}: {
    subjectid: string
}) => {
    const supabase = await createServerSupabaseClient()
    const { data: subjectData } = await supabase
        .from("subjects")
        .select("*, users(*)")
        .eq("subjectid", subjectid)
        .single()

    return subjectData ? (
        <Link
            className="hover:-translate-y-1 transition-all duration-200"
            href={`/student/subject/${subjectData.subjectid}`}
        >
            <Card className="h-full w-full">
                <CardHeader className="text-sm flex flex-row items-center justify-between space-y-0 pb-0">
                    {subjectData.users?.first_name}{" "}
                    {subjectData.users?.last_name}'s
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {subjectData.subjectname}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {subjectData.description}
                    </p>
                </CardContent>
            </Card>
        </Link>
    ) : (
        <></>
    )
}

export const TeacherSubjectCard = ({ subject }: { subject: Subject }) => {
    return (
        <Link
            className="hover:-translate-y-1 transition-all duration-200"
            href={`/teacher/subject/${subject.subjectid}`}
        >
            <Card className="h-full w-full">
                <CardHeader className="text-sm flex flex-row items-center justify-between space-y-0 pb-0"></CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {subject.subjectname}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {subject.description}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

export const SkeletonCard = () => {
    return (
        <Card className="h-full w-full">
            <CardHeader className="text-sm flex flex-row items-center justify-between space-y-0 pb-0"></CardHeader>
            <CardContent>
                <Skeleton className="w-[200px] h-[30px] rounded-sm mb-4" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-[300px] h-[10px] rounded-full" />
                    <Skeleton className="w-[350px] h-[10px] rounded-full" />
                    <Skeleton className="w-full h-[10px] rounded-full" />
                </div>
            </CardContent>
        </Card>
    )
}
