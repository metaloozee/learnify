import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerSupabaseClient } from "@/app/supabase-server"
import type { Subject } from "@/app/teacher/page"

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
