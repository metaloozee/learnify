import Link from "next/link"
import { ArrowLeftIcon, SymbolIcon } from "@radix-ui/react-icons"
import { Bot, CookingPot } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiChatPlayground } from "@/components/ai-playground"
import { FlashCard } from "@/components/flashcard"
import { GenerateContentButton } from "@/components/generate-content"
import { CustomMDX } from "@/components/mdx-remote"
import { Quiz, type QuizProps } from "@/components/quiz"
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
        .eq("studentid", studentData?.userid ?? "")
        .eq("contenttype", "note")
        .maybeSingle()
    const { data: flashCards } = await supabase
        .from("generatedcontent")
        .select("*")
        .eq("noteid", noteData?.noteid ?? "")
        .eq("contenttype", "flash_cards")
        .maybeSingle()
    const { data: quiz } = await supabase
        .from("qna")
        .select("*")
        .eq("noteid", noteData?.noteid ?? "")
        .eq("studentid", studentData?.userid ?? "")
        .order("graded", { ascending: true })

    return session && studentData && noteData && subjectData ? (
        <div className="w-full h-full flex flex-col justify-center">
            <div className="flex flex-row justify-between items-center">
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

                <AiChatPlayground />
            </div>

            <Tabs className="mt-10" defaultValue="note">
                <TabsList>
                    <TabsTrigger className="text-xs" value="note">
                        Personalized Note
                    </TabsTrigger>
                    <TabsTrigger className="text-xs" value="flash_cards">
                        Flash Cards
                    </TabsTrigger>
                    <TabsTrigger className="text-xs" value="mini_quiz">
                        Mini Quiz
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="note">
                    {notes ? (
                        <>
                            <ScrollArea className="mt-5 h-[432px]  rounded-xl px-4 py-2 border">
                                <CustomMDX source={notes.contentbody} />
                            </ScrollArea>
                            <div className="mt-10 flex flex-wrap flex-row gap-5">
                                <GenerateContentButton
                                    note={noteData}
                                    content={notes}
                                    studentid={studentData.userid}
                                    type="note"
                                    regenerate
                                >
                                    Regenerate Note{" "}
                                    <SymbolIcon className="ml-2" />
                                </GenerateContentButton>
                            </div>
                        </>
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
                            <GenerateContentButton
                                note={noteData}
                                content={notes}
                                studentid={studentData.userid}
                                type="note"
                            >
                                Generate Content{" "}
                                <CookingPot className="ml-2 h-4 w-4" />
                            </GenerateContentButton>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="flash_cards">
                    {flashCards ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                                {JSON.parse(flashCards.contentbody).map(
                                    (flashcard: any) => (
                                        <FlashCard
                                            key={flashcard.id}
                                            title={flashcard.flashcard_title}
                                            answer={flashcard.flashcard_answer}
                                        />
                                    )
                                )}
                            </div>
                            <div className="mt-10 flex flex-wrap flex-row gap-5">
                                <GenerateContentButton
                                    note={noteData}
                                    content={flashCards}
                                    studentid={studentData.userid}
                                    type="flashcard"
                                    regenerate
                                >
                                    Regenerate Cards{" "}
                                    <SymbolIcon className="ml-2" />
                                </GenerateContentButton>
                            </div>
                        </>
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
                            <GenerateContentButton
                                note={noteData}
                                content={flashCards}
                                studentid={studentData.userid}
                                type="flashcard"
                            >
                                Generate Content{" "}
                                <CookingPot className="ml-2 h-4 w-4" />
                            </GenerateContentButton>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="mini_quiz">
                    {quiz && quiz.length > 0 ? (
                        <>
                            <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {quiz.map(
                                    (q: (typeof quiz)[0], index: number) => (
                                        <Quiz key={index} quiz={q} />
                                    )
                                )}
                            </div>
                            <div className="mt-10 flex flex-wrap flex-row gap-5">
                                <GenerateContentButton
                                    note={noteData}
                                    content={null}
                                    studentid={studentData.userid}
                                    type="quiz"
                                    regenerate
                                >
                                    Regenerate Quiz{" "}
                                    <SymbolIcon className="ml-2" />
                                </GenerateContentButton>
                            </div>
                        </>
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
                            <GenerateContentButton
                                note={noteData}
                                content={flashCards}
                                studentid={studentData.userid}
                                type="quiz"
                            >
                                Generate Content{" "}
                                <CookingPot className="ml-2 h-4 w-4" />
                            </GenerateContentButton>
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
