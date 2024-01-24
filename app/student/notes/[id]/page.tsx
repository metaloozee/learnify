import { randomUUID } from "crypto"
import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import Link from "next/link"
import { env } from "@/env.mjs"
import { ArrowLeftIcon, FileTextIcon, SymbolIcon } from "@radix-ui/react-icons"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { CookingPot } from "lucide-react"

import type { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomMDX } from "@/components/mdx-remote"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentNotesIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: studentData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .eq("usertype", "student")
        .single()
    const { data: noteData } = await supabase
        .from("notes")
        .select("*")
        .eq("noteid", params.id)
        .single()
    const { data: subjectData } = await supabase
        .from("studentenrollment")
        .select("subjects(*)")
        .eq("userid", studentData?.userid ?? "")
        .eq("subjectid", noteData?.subjectid ?? "")
        .single()

    const { data: notes } = await supabase
        .from("generatedcontent")
        .select("*")
        .eq("noteid", noteData?.noteid ?? "")
        .eq("contenttype", "note")
        .maybeSingle()
    const { data: summary } = await supabase
        .from("generatedcontent")
        .select("*")
        .eq("noteid", noteData?.noteid ?? "")
        .eq("contenttype", "summary")
        .maybeSingle()
    const { data: flashCards } = await supabase
        .from("generatedcontent")
        .select("*")
        .eq("noteid", noteData?.noteid ?? "")
        .eq("contenttype", "flash_cards")
        .maybeSingle()

    const handleGeneratePersonalizedNotes = async () => {
        "use server"

        const supabase = await createServerActionClient<Database>({ cookies })
    }

    const handleGenerateSummary = async () => {
        "use server"

        const supabase = await createServerActionClient<Database>({ cookies })

        try {
            const res = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: {
                        Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`,
                    },
                    method: "POST",
                    body: JSON.stringify(noteData?.notecontent),
                }
            )
            if (!res.ok) {
                throw new Error(
                    "An error occurred while generating the summary."
                )
            }

            const generatedSummary = await res.json()

            const { error } = await supabase.from("generatedcontent").upsert({
                contentid: summary?.contentid ?? randomUUID(),
                contenttitle: `[SUMMARY] ${noteData?.notetitle}`,
                contentbody: generatedSummary[0].summary_text,
                contenttype: "summary",
                noteid: noteData?.noteid,
                studentid: session?.user.id,
            })

            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            return revalidatePath(`/student/notes/${noteData?.noteid}`)
        }
    }

    const handleGenerateFlashCards = async () => {
        "use server"

        const supabase = await createServerActionClient<Database>({ cookies })
    }

    return session && studentData && noteData && subjectData ? (
        <div className="w-full h-full flex flex-col justify-center">
            <Button
                className="text-muted-foreground max-w-fit"
                asChild
                size={null}
                variant={"link"}
            >
                <Link
                    className="hover:underline"
                    href={`/student/subject/${noteData.subjectid}`}
                >
                    <ArrowLeftIcon className="mr-2" />
                    nevermind
                </Link>
            </Button>
            <Tabs className="mt-10" defaultValue="note">
                <TabsList>
                    <TabsTrigger value="note">Personalized Note</TabsTrigger>
                    <TabsTrigger value="flash_cards">Flash Cards</TabsTrigger>
                    <TabsTrigger disabled value="mini_quiz">
                        Mini Quiz
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="note">
                    {notes ? (
                        <Suspense
                            fallback={
                                <div className="mt-5 flex flex-col gap-5 ">
                                    <Skeleton className="h-10 w-[800px]" />
                                    <Skeleton className="h-4 w-[600px]" />
                                    <Skeleton className="h-4 w-[550px]" />
                                    <Skeleton className="h-4 w-[300px]" />
                                </div>
                            }
                        >
                            <ScrollArea className="mt-5 h-[432px] ">
                                <CustomMDX source={notes.contentbody} />
                            </ScrollArea>
                            <div className="mt-10 flex flex-wrap flex-row gap-5">
                                <form action={handleGenerateSummary}>
                                    <Button disabled={!!summary} type="submit">
                                        <FileTextIcon className="mr-2" />{" "}
                                        Generate Summary
                                    </Button>
                                </form>
                                <form action={handleGeneratePersonalizedNotes}>
                                    <Button type="submit" variant={"secondary"}>
                                        Regenerate Note{" "}
                                        <SymbolIcon className="ml-2" />
                                    </Button>
                                </form>
                            </div>
                            {summary && (
                                <Card className="mt-10">
                                    <CardHeader>
                                        <CardTitle>Summary</CardTitle>
                                        <CardDescription>
                                            {summary.contentbody}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            )}
                        </Suspense>
                    ) : (
                        <div className="mt-5 flex flex-col gap-5">
                            <h1 className="text-3xl md:text-4xl">
                                Content Not Found
                            </h1>
                            <p className="text-md text-muted-foreground">
                                Worry not! Click the mystical 'Generate Content'
                                button below, and watch as personalized notes
                                magically materialize. It's like summoning your
                                own army of knowledge imps, only less chaotic
                                and with better grammar!
                            </p>
                            <form action={handleGeneratePersonalizedNotes}>
                                <Button type="submit" className="max-w-fit">
                                    Generate Content{" "}
                                    <CookingPot className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="flash_cards">
                    {flashCards ? (
                        <Suspense
                            fallback={
                                <div className="mt-5 flex flex-col gap-5 ">
                                    <Skeleton className="h-10 w-[800px]" />
                                    <Skeleton className="h-4 w-[600px]" />
                                    <Skeleton className="h-4 w-[550px]" />
                                    <Skeleton className="h-4 w-[300px]" />
                                </div>
                            }
                        >
                            <ScrollArea className="mt-5 h-[432px] ">
                                Coming soon
                                {/* <CustomMDX source={notes.contentbody} /> */}
                            </ScrollArea>
                            <div className="mt-10 flex flex-row gap-5">
                                <form action={handleGenerateFlashCards}>
                                    <Button type="submit" variant={"secondary"}>
                                        Regenerate Cards{" "}
                                        <SymbolIcon className="ml-2" />
                                    </Button>
                                </form>
                            </div>
                        </Suspense>
                    ) : (
                        <div className="mt-5 flex flex-col gap-5">
                            <h1 className="text-3xl md:text-4xl">
                                Content Not Found
                            </h1>
                            <p className="text-md text-muted-foreground">
                                Worry not! Click the mystical 'Generate Content'
                                button below, and watch as personalized notes
                                magically materialize. It's like summoning your
                                own army of knowledge imps, only less chaotic
                                and with better grammar!
                            </p>
                            <form action={handleGenerateFlashCards}>
                                <Button type="submit" className="max-w-fit">
                                    Generate Content{" "}
                                    <CookingPot className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
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
