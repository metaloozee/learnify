import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentAnalyticsIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: subjectData } = await supabase
        .from("subjects")
        .select("subjectname")
        .eq("subjectid", params.id)
        .eq("teacherid", session?.user.id ?? "")
        .maybeSingle()
    const { data: studentData } = await supabase
        .from("users")
        .select("userid, first_name")
        .eq("username", params.student)
        .eq("usertype", "student")
        .maybeSingle()
    const { data: enrollmentData } = await supabase
        .from("studentenrollment")
        .select("*")
        .eq("subjectid", params.id)
        .eq("userid", studentData?.userid ?? "")
        .maybeSingle()
    const { data: notes } = await supabase
        .from("notes")
        .select("noteid, notetitle")
        .eq("is_published", true)
        .eq("subjectid", params.id)
        .eq("teacherid", session?.user.id ?? "")
        .order("updated_at", { ascending: false })

    const { count: generatedContentCount } = await supabase
        .from("generatedcontent")
        .select("contentbody, contentid", { count: "exact", head: true })
        .eq("studentid", studentData?.userid ?? "")
    const { count: generatedQuizzesCount } = await supabase
        .from("qna")
        .select("*", { count: "exact", head: true })
        .eq("studentid", studentData?.userid ?? "")

    return session && enrollmentData && subjectData && studentData ? (
        <div className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href={`/teacher/subject/${params.id}`}
                            >
                                {subjectData.subjectname}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Student Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl md:text-4xl">
                            Manage{" "}
                            <span className="text-muted-foreground">
                                {studentData.first_name}!
                            </span>
                        </h1>

                        <div className="flex flex-wrap gap-2 max-h-fit">
                            <Badge variant={"outline"} className="max-w-fit">
                                Personalized Contents Generated:{" "}
                                {generatedContentCount}
                            </Badge>
                            <Badge variant={"outline"} className="max-w-fit">
                                Mini Quizzes Generated: {generatedQuizzesCount}
                            </Badge>
                        </div>
                    </div>
                    <p className="mt-5 text-md text-muted-foreground">
                        Explore detailed insights into each student's progress
                        and performance by clicking on their name below. Dive
                        into the wealth of generated content and quiz
                        evaluations tailored to their learning journey,
                        providing valuable feedback and guidance to enhance
                        their academic experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 mt-20">
                        {notes?.map((note, index) => (
                            <Link
                                key={index}
                                className="hover:-translate-y-1 transition-all duration-200"
                                href={`/teacher/subject/${params.id}/${params.student}/${note.noteid}`}
                            >
                                <Card className="h-full w-full">
                                    <CardHeader className="pb-0" />
                                    <CardContent>
                                        <h1 className="text-2xl font-bold">
                                            {note.notetitle}
                                        </h1>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
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
