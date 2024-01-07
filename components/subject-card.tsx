import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

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
            href={`/subject/${subjectData.subjectid}`}
        >
            <Card>
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
