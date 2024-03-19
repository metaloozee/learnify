import Link from "next/link"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
                            <BreadcrumbPage>Student Analytics</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="mt-10">
                    <h1 className="text-3xl md:text-4xl">
                        {studentData.first_name}
                        <span className="text-muted-foreground">
                            's Student Analytics
                        </span>
                    </h1>
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
