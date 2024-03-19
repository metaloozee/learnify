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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { CustomMDX } from "@/components/mdx-remote"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentNoteAnalyticsIndexPage({
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
        .select("first_name, last_name, userid")
        .eq("username", params.student)
        .eq("usertype", "student")
        .maybeSingle()
    const { data: note } = await supabase
        .from("notes")
        .select("noteid, notetitle")
        .eq("is_published", true)
        .eq("noteid", params.note)
        .eq("subjectid", params.id)
        .eq("teacherid", session?.user.id ?? "")
        .maybeSingle()

    const { data: flashCards } = await supabase
        .from("generatedcontent")
        .select("contentbody")
        .eq("contenttype", "flash_cards")
        .eq("noteid", note?.noteid ?? "")
        .eq("studentid", studentData?.userid ?? "")
        .maybeSingle()
    const { data: notes } = await supabase
        .from("generatedcontent")
        .select("contentbody")
        .eq("contenttype", "note")
        .eq("noteid", note?.noteid ?? "")
        .eq("studentid", studentData?.userid ?? "")
        .maybeSingle()
    const { data: quiz } = await supabase
        .from("qna")
        .select("graded, answer, question, tries")
        .eq("noteid", note?.noteid ?? "")
        .eq("studentid", studentData?.userid ?? "")
        .order("graded", { nullsFirst: false })

    return session && note && subjectData ? (
        <div className="flex flex-col gap-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/teacher/subject/${params.id}`}>
                            {subjectData.subjectname}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href={`/teacher/subject/${params.id}/${params.student}`}
                        >
                            {studentData?.first_name} {studentData?.last_name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{note.notetitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-10">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel minSize={30} className="pr-4">
                        <h1 className="text-muted-foreground font-semibold mb-5">
                            Personalized Note
                        </h1>
                        {notes ? (
                            <div className="rounded-xl px-4 border">
                                <CustomMDX source={notes.contentbody} />
                            </div>
                        ) : (
                            <h1>Content Not Found</h1>
                        )}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20} className="px-4">
                        <h1 className="text-muted-foreground font-semibold mb-5">
                            Flash Cards
                        </h1>
                        {flashCards ? (
                            <>
                                <div className="grid grid-cols-1 gap-5">
                                    {JSON.parse(flashCards.contentbody).map(
                                        (flashcard: any) => (
                                            <Card key={flashcard.id}>
                                                <CardHeader>
                                                    <CardTitle>
                                                        {
                                                            flashcard.flashcard_title
                                                        }
                                                    </CardTitle>
                                                    <p className="text-muted-foreground">
                                                        {
                                                            flashcard.flashcard_answer
                                                        }
                                                    </p>
                                                </CardHeader>
                                            </Card>
                                        )
                                    )}
                                </div>
                            </>
                        ) : (
                            <h1>Content Not Found</h1>
                        )}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20} className="pl-4">
                        <h1 className="text-muted-foreground font-semibold mb-5">
                            Mini Quiz
                        </h1>
                        {quiz && quiz.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-5">
                                    {quiz.map(
                                        (
                                            q: (typeof quiz)[0],
                                            index: number
                                        ) => (
                                            <Card key={index}>
                                                <CardHeader>
                                                    <CardTitle>
                                                        {q.question}
                                                    </CardTitle>
                                                    <p className="text-muted-foreground">
                                                        {q.answer}
                                                    </p>
                                                </CardHeader>
                                                {q.graded && (
                                                    <CardFooter className="space-x-2">
                                                        <Badge>Graded</Badge>
                                                        <Badge
                                                            variant={"outline"}
                                                        >
                                                            Tries: {q.tries}
                                                        </Badge>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        )
                                    )}
                                </div>
                            </>
                        ) : (
                            <h1>Content Not Found</h1>
                        )}
                    </ResizablePanel>
                </ResizablePanelGroup>
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
